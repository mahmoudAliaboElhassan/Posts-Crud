import { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { logOutUser } from "../RTK/Slices/authSlice";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import i18next from "i18next";
import DarkMode from "./DarkMode";
import { ReactComponent as Globe } from "../assets/globe (1).svg";
import { ReactComponent as Menu } from "../assets/menu.svg";
import withGuard from "../util/withGuard";

const NavbarStyle = ({ isActive }) => {
  return { fontWeight: isActive ? "bold" : "normal" };
};

const Languages = [
  {
    code: "en",
    name: "English",
    country_code: "us",
  },
  {
    code: "ar",
    name: "عربي",
    country_code: "eg",
    dir: "rtl",
  },
];

const Header = () => {
  const currLanguageCode = Cookies.get("i18next") || "en";
  const currentLanguage = Languages.find((l) => l.code === currLanguageCode);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token, username } = useSelector((state) => state.auth);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  useEffect(() => {
    document.body.dir = currentLanguage.dir || "ltr";
    document.title = t("website-title");
  }, [currentLanguage, t]);

  const handleLogout = () => {
    closeNav();
    dispatch(logOutUser());
    localStorage.removeItem("currentPage");
    localStorage.removeItem("value");
  };
  const handleNavToggle = () => {
    setIsNavExpanded(!isNavExpanded);
  };
  const closeNav = () => {
    setIsNavExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      className="bg-header-footer"
      style={{
        position: "sticky",
        top: "0px",
        zIndex: "100",
        marginBottom: "10px",
        alignItems: "center",
      }}
      expanded={isNavExpanded}
    >
      <Container>
        <Navbar.Brand>
          <NavLink
            to="/"
            className="navigate-link mx-2"
            style={NavbarStyle}
            end
            onClick={closeNav}
          >
            {t("home")}
          </NavLink>
        </Navbar.Brand>
        {token && (
          <div
            className={
              currLanguageCode === "ar"
                ? "user-style menu-style me-3"
                : "user-style menu-style ms-3"
            }
          >
            {username && username.charAt(0).toUpperCase()}
          </div>
        )}{" "}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={
            currLanguageCode === "en"
              ? "no-dropdown-style menu-style ms-5 menu-right"
              : "no-dropdown-style menu-style me-5 menu-left"
          }
          onClick={handleNavToggle}
        >
          <Menu />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="me-2">
          <Nav
            className={
              currLanguageCode === "en" ? "ms-auto me-1" : "ms-1 me-auto"
            }
          >
            <NavLink
              to="post/add"
              className="navigate-link add"
              style={NavbarStyle}
              onClick={closeNav}
            >
              {t("add")}
            </NavLink>
            <div
              onClick={closeNav}
              className="mx-1"
              style={{ width: "fit-content" }}
            >
              <DarkMode />
            </div>
            <Dropdown className="nav-item globe">
              <Dropdown.Toggle className="no-dropdown-style mx-1">
                <Globe />
              </Dropdown.Toggle>
              <Dropdown.Menu
                className={
                  currLanguageCode === "ar"
                    ? "dropdown-color langs dropdown-ar"
                    : "dropdown-color langs dropdown-en"
                }
                style={{
                  left: currLanguageCode === "ar" ? "60%" : " -130px",
                  right: currLanguageCode === "ar" ? "inherit" : "100%",
                }}
              >
                {Languages.map((lang) => (
                  <Dropdown.Item
                    className="d-flex justify-content-between align-items-center fs-5"
                    disabled={lang.code === currLanguageCode}
                    key={lang.code}
                    onClick={() => {
                      i18next.changeLanguage(lang.code);
                      closeNav();
                    }}
                  >
                    <i
                      className={`flag flag-${lang.country_code} larger-icon`}
                    ></i>{" "}
                    {lang.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          {token && (
            <div onClick={handleLogout} className="logout-btn mx-1">
              {t("logOut")}
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default withGuard(Header);
