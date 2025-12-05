import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout></Layout>,
  },
]);