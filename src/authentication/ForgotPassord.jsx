import React from "react";
import { Button, Container, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import "./formStyle.css";
import { useTranslation } from "react-i18next";
import { ForgetPassword } from "../RTK/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import UseTheme from "../hooks/use-theme";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = UseTheme();

  let errorMsg;
  const { error, loading } = useSelector((state) => state.auth);
  if (
    (error === "Request failed with status code 400" || error === null) &&
    !loading
  ) {
    errorMsg = t("forget-error-message");
  } else if (error === "Network Error" || error === null) {
    errorMsg = t("network-error");
  } else errorMsg = error;

  const form = (formikProps) => (
    <Form onSubmit={formikProps.handleSubmit} className="form-style">
      <Form.Group>
        <Form.Label className="label-color" htmlFor="email-field">
          {t("email")}
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          id="email-field"
          placeholder="name@example.com"
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          value={formikProps.values.email}
          isInvalid={!!formikProps.errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {formikProps.errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="mt-3" disabled={loading}>
        {loading ? t("loading") : t("send-password")}
      </Button>

      <div className="ms-1 me-1 mt-1">
        <Link to={"/login"}> {t("back")}</Link>
      </div>
    </Form>
  );

  return (
    <Container>
      <ToastContainer />
      <Col xs={{ span: 8, offset: 2 }}>
        <Formik
          initialValues={{
            email: "",
          }}
          render={form}
          onSubmit={(values) => {
            dispatch(
              ForgetPassword({
                email: values.email,
              })
            )
              .unwrap()
              .then(() => {
                toast.success(t("forget-message"), {
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
                  navigate("/login");
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
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required("Email Field is required"),
          })}
        />
      </Col>
    </Container>
  );
};

export default ForgotPassword;
