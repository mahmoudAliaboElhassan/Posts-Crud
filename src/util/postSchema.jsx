import * as Yup from "yup";

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title is Very Short Insert at Least 3 characters")
    .max(30, "Maximum Number of characters is 30 characters")
    .matches("^(?! *$).*$", "Title can not be Spaces only"),

  description: Yup.string()
    .required("Description is required")
    .max(300, "Description is Very long Insert Maximum 300 characters")
    .matches("^(?! *$).*$", "Description can not be Spaces only"),
});
