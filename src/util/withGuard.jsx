import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const withGuard = (Component) => {
  const Wrapper = () => {
    const navigate = useNavigate();
    const { loadingAuth, token } = useSelector((state) => state.auth);
    const location = useLocation();

    useEffect(() => {
      if (!loadingAuth) {
        if (!token) {
          if (!location.pathname.startsWith("/password-reset"))
            navigate("/login");
        }
      }
    }, [loadingAuth, token, navigate]);

    if (loadingAuth) {
      return <Loader />;
    }
    return <Component />;
  };

  return Wrapper;
};

export default withGuard;
