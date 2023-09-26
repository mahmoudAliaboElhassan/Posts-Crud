import { configureStore } from "@reduxjs/toolkit";
import posts from "./Slices/PostSlice.jsx";
import auth from "./Slices/authSlice.jsx";

export const store = configureStore({
  reducer: { posts, auth },
});
