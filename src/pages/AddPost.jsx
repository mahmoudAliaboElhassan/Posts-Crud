import { useState } from "react";
import { motion } from "framer-motion";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../RTK/Slices/PostSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useFormik } from "formik";
import { postSchema } from "../util/postSchema";
import withGuard from "../util/withGuard";
import { useTranslation } from "react-i18next";
import { ReactComponent as Add } from "../assets/plus-square.svg";
import styles from "./buttons.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseTheme from "../hooks/use-theme";
import UsePostOptions from "../hooks/use-post-options";
import Select from "react-select";
import "./posts.css";

const AddPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = UseTheme();
  const { options } = UsePostOptions();
  const [selectedType, setSelectedType] = useState(options[7]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { loading, error } = useSelector((state) => state.posts);

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    setSelectedImage(selectedImage);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: postSchema,
    onSubmit: (values) => {
      dispatch(
        addPost({
          title: values.title,
          description: values.description,
          img: selectedImage,
          date: new Date(),
          post_type_val: selectedType.value,
        })
      )
        .unwrap()
        .then(() => {
          toast.success(t("success-add"), {
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
    },
  });

  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: "0.3" }}
    >
      <Form
        onSubmit={formik.handleSubmit}
        style={{ width: "90%", margin: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-center image-select-container">
          <Form.Group className="custom-select mb-3">
            <Form.Label className="label-color">{t("select")}</Form.Label>
            <Select
              options={options.slice(1)}
              value={
                selectedType
                  ? { label: t(selectedType.value), value: selectedType.value }
                  : { value: options.value, label: t(options.value) }
              }
              onChange={(val) => {
                setSelectedType(val);
              }}
            />
          </Form.Group>

          <Form.Group className="image">
            <Form.Label className="label-color" htmlFor="image">
              {t("image-selected")}
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImage}
              name="image"
              val={formik.values.image}
              className="mb-2"
              id="image"
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="title-field">
            {t("title")}
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            id="title-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            isInvalid={!!formik.errors.title}
          />
          {formik.touched.title && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <ToastContainer />
        <Form.Group className="mb-4">
          <Form.Label className="label-color" htmlFor="password-field">
            {t("description")}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            id="password-field"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            isInvalid={!!formik.errors.description}
          />
          {formik.touched.description && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Loading loading={loading} error={error}>
          <button class={styles.btnShine} type="submit">
            {" "}
            <Add />
            <span className="mx-1"> {t("add")}</span>
          </button>
        </Loading>
      </Form>
    </motion.div>
  );
};

export default withGuard(AddPost);
