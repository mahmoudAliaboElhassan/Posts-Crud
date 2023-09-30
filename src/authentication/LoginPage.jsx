import { Container, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
  if (error === "Network Error") {
    errorMsg = t("network-error");
  } else if (
    (error === "Request failed with status code 400" || error === null) &&
    !loading
  ) {
    errorMsg = t("login-error");
  } else errorMsg = error;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      console.log(values.email);
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
    },
    validationSchema: authSchema,
  });
  return (
    <Container>
      <Col xs={{ span: 8, offset: 2 }}>
        <Form onSubmit={formik.handleSubmit} className="form-style">
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
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              isInvalid={!!formik.errors.email}
              id="email-field"
            />
            {formik.touched.email && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="label-color" htmlFor="password-field">
              {t("password")}
            </Form.Label>
            <Form.Control
              className="input-field"
              type="password"
              placeholder={t("password-here")}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={!!formik.errors.password}
              id="password-field"
            />
            {formik.touched.password && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            )}
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
      </Col>
    </Container>
  );
};

export default LoginPage;
