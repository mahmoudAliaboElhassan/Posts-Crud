import * as Yup from "yup";

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title should be at least 3 characters long")
    .matches(
      /^(\s*\S){3,}.*$/,
      "Title should have at least 3 non-space characters"
    ),

  description: Yup.string()
    .required("Description is required")
    .min(3, "Description should be at least 3 characters long")
    .max(300, "Description is Very long Insert Maximum 300 characters")
    .matches(
      /^(\s*\S){3,}.*$/,
      "Description should have at least 3 non-space characters"
    ),
});
