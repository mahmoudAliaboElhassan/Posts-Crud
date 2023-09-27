import React, { Fragment } from "react";
import { Container, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import "./formStyle.css";
import { useTranslation } from "react-i18next";
import { Login } from "../RTK/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseTheme from "../hooks/use-theme";

const authSchema = Yup.object().shape({
  email: Yup.string().email().required("Email Field is required"),
  password: Yup.string()
    .required("Password Field is required")
    .matches(/^[a-zA-Z].*/, "Password must start with a character")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      "Password must contain at least one letter and one number"
    )
    .min(10, "Minimum Number of Chars is 10"),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = UseTheme();

  let errorMsg;
  const { error, loading } = useSelector((state) => state.auth);
  console.log(error);
  if (error === "Network Error") {
    errorMsg = t("network-error");
  } else if (
    (error === "Request failed with status code 400" || error === null) &&
    !loading
  ) {
    errorMsg = t("login-error");
  } else errorMsg = error;

  const form = (formikProps) => (
    <Fragment>
      <Form onSubmit={formikProps.handleSubmit} className="form-style">
        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="email-field">
            {t("email")}
          </Form.Label>
          <ToastContainer />
          <Form.Control
            className="input-field"
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.email}
            isInvalid={!!formikProps.errors.email}
            id="email-field"
          />
          <Form.Control.Feedback type="invalid">
            {formikProps.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="password-field">
            {t("password")}
          </Form.Label>
          <Form.Control
            className="input-field"
            type="password"
            placeholder="Enter Password Here"
            name="password"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.password}
            isInvalid={!!formikProps.errors.password}
            id="password-field"
          />
          <Form.Control.Feedback type="invalid">
            {formikProps.errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <button type="submit" class="my-2 btn btn-primary" disabled={loading}>
          {loading ? t("loading") : t("login")}
        </button>
        <div>
          {t("no-account")} <Link to={"/signup"}>{t("signup")}</Link>
        </div>{" "}
        <div>
          <Link to={"/forgetpassword"}> {t("forget-password")} </Link>
        </div>
      </Form>
    </Fragment>
  );
  return (
    <Container>
      <Col xs={{ span: 8, offset: 2 }}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          render={form}
          onSubmit={(values) => {
            dispatch(
              Login({
                email: values.email,
                password: values.password,
              })
            )
              .unwrap()
              .then(() => {
                toast.success(t("login-success"), {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme,
                });
                setTimeout(() => {
                  navigate("/");
                }, 1000);
              })
              .catch(() => {
                swal({
                  icon: "error",
                  title: t("error"),
                  text: `${errorMsg}`,
                });
              });
          }}
          validationSchema={authSchema}
        />
      </Col>
    </Container>
  );
};

export default LoginPage;
