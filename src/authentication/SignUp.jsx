import React, { Fragment } from "react";
import { Container, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { authSchema } from "../util/authSchema";
import swal from "sweetalert";
import "./formStyle.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Login, Signup } from "../RTK/Slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseTheme from "../hooks/use-theme";

const SignUpPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = UseTheme();
  const { error, loading } = useSelector((state) => state.auth);

  let errorMsg;
  const errorHandle = () => {
    if (error === "Network Error") {
      errorMsg = t("network-error");
    } else if (error === "Request failed with status code 400" && !loading) {
      errorMsg = t("signup-error");
    } else errorMsg = error;
    swal({
      icon: "error",
      title: t("error"),
      text: `${errorMsg}`,
    });
  };

  const form = (formikProps) => (
    <Fragment>
      <Form onSubmit={formikProps.handleSubmit} className="form-style">
        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="username-field">
            {t("username")}
          </Form.Label>
          <ToastContainer />
          <Form.Control
            type="text"
            placeholder="Mahmoud Ali"
            name="username"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.username}
            isInvalid={!!formikProps.errors.username}
            id="username-field"
          />
          <Form.Control.Feedback type="invalid">
            {formikProps.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="email-field">
            {t("email")}
          </Form.Label>
          <Form.Control
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
          {loading ? t("loading") : t("signup")}
        </button>
        <div>
          {t("have-account")} <Link to={"/login"}>{t("login")}</Link>
        </div>
      </Form>
    </Fragment>
  );

  return (
    <Container>
      <Col xs={{ span: 8, offset: 2 }}>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          render={form}
          onSubmit={(values, actions) => {
            dispatch(
              Signup({
                username: values.username,
                email: values.email,
                password: values.password,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(
                  Login({
                    email: values.email,
                    password: values.password,
                  })
                )
                  .unwrap()
                  .then(() => {
                    toast.success(t("sign-success"), {
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
                  });
              })
              .catch(errorHandle);
          }}
          validationSchema={authSchema}
        />
      </Col>
    </Container>
  );
};

export default SignUpPage;
