import { useState } from "react";
import { motion } from "framer-motion";
import UsePostDetails from "../hooks/use-post-details";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { editPost } from "../RTK/Slices/PostSlice";
import { Formik } from "formik";
import { postSchema } from "../util/postSchema";
import withGuard from "../util/withGuard";
import { useTranslation } from "react-i18next";
import { ReactComponent as Edit } from "../assets/edit.svg";
import styles from "./buttons.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseTheme from "../hooks/use-theme";
import UsePostOptions from "../hooks/use-post-options";
import Select from "react-select";
import "./posts.css";
const EditPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = UseTheme();
  const { options } = UsePostOptions();
  const { loading, error, post } = UsePostDetails(id);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    setSelectedImage(selectedImage);
  };

  const form = (formikProps) => (
    <Form
      onSubmit={formikProps.handleSubmit}
      style={{ width: "90%", margin: "auto" }}
    >
      <div className="d-flex justify-content-between align-items-center image-select-container">
        <Form.Group className="custom-select mb-3">
          <Form.Label
            className="label-color"
            htmlFor="select"
            onClick={() => document.getElementById("select").focus()}
          >
            {t("select")}
          </Form.Label>
          <Select
            id="select"
            options={options.slice(1)}
            value={
              selectedType
                ? { label: t(selectedType.value), value: selectedType.value }
                : {
                    value: post?.post_type?.value,
                    label: t(post?.post_type?.value),
                  }
            }
            onChange={(val) => {
              val.value === ""
                ? setSelectedType({ label: t("all"), value: "all" })
                : setSelectedType(val);
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
            value={formikProps.values.image}
            id="image"
            className="mb-2"
          />
        </Form.Group>
      </div>
      <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
        <Form.Label className="label-color">{t("title")}</Form.Label>
        <Form.Control
          type="text"
          name="title"
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          value={formikProps.values.title}
          isInvalid={!!formikProps.errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {formikProps.errors.title}
        </Form.Control.Feedback>
      </Form.Group>
      <ToastContainer />
      <Form.Group className="mb-4">
        <Form.Label className="label-color">{t("description")}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          value={formikProps.values.description}
          isInvalid={!!formikProps.errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {formikProps.errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Loading loading={loading} error={error}>
        <button className={styles.btnShine} type="submit">
          {" "}
          <Edit />
          <span className="mx-1"> {t("edit")}</span>
        </button>
      </Loading>
    </Form>
  );

  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: "0.3" }}
    >
      <Loading loading={loading} error={error}>
        <Formik
          initialValues={{
            title: post?.title,
            description: post?.description,
          }}
          onSubmit={(values) => {
            dispatch(
              editPost({
                id: post.id,
                title: values.title,
                description: values.description,
                img: selectedImage,
                post_type_val: selectedType?.value || post?.post_type?.value,
              })
            )
              .unwrap()
              .then(() => {
                toast.success(t("post-edit"), {
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
          }}
          render={form}
          validationSchema={postSchema}
        />
      </Loading>
    </motion.div>
  );
};

export default withGuard(EditPost);
