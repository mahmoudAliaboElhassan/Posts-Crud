import { Container, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
    if (error === "Network Error" && !loading) {
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

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    onSubmit: (values) => {
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
    },
    validationSchema: authSchema,
  });

  return (
    <Container>
      <Col xs={{ span: 8, offset: 2 }}>
        <Form onSubmit={formik.handleSubmit} className="form-style">
          <Form.Group className="mb-4">
            <Form.Label className="label-color" htmlFor="username-field">
              {t("username")}
            </Form.Label>
            <ToastContainer />
            <Form.Control
              type="text"
              placeholder={t("person")}
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              isInvalid={!!formik.errors.username}
              id="username-field"
            />
            {formik.touched.username && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="label-color" htmlFor="email-field">
              {t("email")}
            </Form.Label>
            <Form.Control
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
            {loading ? t("loading") : t("signup")}
          </button>
          <div>
            {t("have-account")} <Link to={"/login"}>{t("login")}</Link>
          </div>
        </Form>
      </Col>
    </Container>
  );
};

export default SignUpPage;
