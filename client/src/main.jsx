import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PostEdit from "./views/PostEdit.jsx";
import Posts from "./views/Posts.jsx";
import PostDetail from "./views/PostDetail.jsx";
import Home from "./views/Home.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/carts/new",
        element: <PostEdit />,
      },
      {
        path: "/carts/",
        element: <Posts />,
      },
      {
        path: "/carts/1",
        element: <PostDetail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
