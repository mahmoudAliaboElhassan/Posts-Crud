import { useFormik } from "formik";
import { Button, Col, Container, Form, ToastContainer } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import UseTheme from "../hooks/use-theme";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { resetPassword } from "../RTK/Slices/authSlice";

const resetSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password Field is required")
    .matches(/^[a-zA-Z].*/, "Password must start with a character")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      "Password must contain at least one letter and one number"
    )
    .min(10, "Minimum Number of Chars is 10"),
});

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = UseTheme();
  const { uid, token } = useParams();

  let errorMsg;
  const { error, loading } = useSelector((state) => state.auth);
  if (error === "Network Error") {
    errorMsg = t("network-error");
  } else errorMsg = error;

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: (values) => {
      dispatch(
        resetPassword({
          uid,
          token,
          new_password: values.password,
        })
      )
        .unwrap()
        .then(() => {
          toast.success(t("reset-success"), {
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
    },
    validationSchema: resetSchema,
  });
  return (
    <Container>
      <Col xs={{ span: 8, offset: 2 }}>
        <Form onSubmit={formik.handleSubmit} className="form-style">
          <Form.Group className="mb-4">
            <Form.Label className="label-color" htmlFor="password-field">
              {t("new-password")}
            </Form.Label>{" "}
            <ToastContainer />
            <Form.Control
              className="input-field"
              type="password"
              placeholder="Enter Password Here"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={!!formik.errors.password}
              id="password-field"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div>
            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? t("loading") : t("reset")}
            </Button>

            <div className="ms-1 me-1 mt-1">
              <Link to={"/login"}> {t("back")}</Link>
            </div>
          </div>
        </Form>
      </Col>
    </Container>
  );
}

export default ResetPassword;
