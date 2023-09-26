import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./API/axios-global";
import "mdb-ui-kit/css/mdb.min.css";

import { Provider } from "react-redux";
import { store } from "./RTK/Store";

import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Loader from "./components/Loader";
import PostList from "./components/PostList";
import SignUpPage from "./authentication/SignUp";
import LoginPage from "./authentication/LoginPage";
import ForgotPassord from "./authentication/ForgotPassord";
import "./index.css";
import ResetPassword from "./authentication/ResetPassword";

const Add = React.lazy(() => import("./pages/AddPost"));
const Edit = React.lazy(() => import("./pages/EditPost"));
const Details = React.lazy(() => import("./pages/Details"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PostList /> },
      {
        path: "post/add",
        element: (
          <Suspense fallback={<Loader />}>
            <Add />
          </Suspense>
        ),
      },
      {
        path: "post/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Details />
          </Suspense>
        ),
        loader: ({ params }) => {
          if (isNaN(params.id)) {
            throw new Response("Bad Request", {
              statusText: "Please Enter a Number in the url to get its details",
              status: 400,
            });
          }
          return <Details />;
        },
      },
      {
        path: "post/:id/edit",
        element: (
          <Suspense fallback={<Loader />}>
            <Edit />
          </Suspense>
        ),
        loader: ({ params }) => {
          if (isNaN(params.id)) {
            throw new Response("Bad Request", {
              statusText: "Please Enter a Number in the url to Update it",
              status: 400,
            });
          }
          return <Edit />;
        },
      },
      { path: "signup", element: <SignUpPage />, replace: true },
      { path: "login", element: <LoginPage />, replace: true },
      { path: "forgetpassword", element: <ForgotPassord />, replace: true },
      {
        path: "password-reset/:uid/:token",
        element: <ResetPassword />,
        replace: true,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
