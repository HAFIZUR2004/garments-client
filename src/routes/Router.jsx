import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// Auth
import Login from "../Auth/Login.jsx";

// Pages
import Home from "../pages/Home/Home.jsx";
import AllProducts from "../Products/AllProducts.jsx";
import ProductDetails from "../Products/ProductDetails.jsx";
import BookingPage from "../Products/BookingPage.jsx";

// Dashboard
import Dashboard from "../Dashboard/Admin/DashboardHome.jsx";
import ManageUsers from "../Dashboard/Admin/ManageUsers.jsx";
import AddProduct from "../Dashboard/Manager/AddProduct.jsx";
import MyOrders from "../Dashboard/Buyer/MyOrders.jsx";

// Protected Routes
import PrivateRoute from "../components/PrivateRoute.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import ManagerRoute from "../components/ManagerRoute.jsx";
import BuyerRoute from "../components/BuyerRoute.jsx";
import Register from "../Auth/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register/>},
      { path: "allproducts", element: <AllProducts /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "book/:id", element: <BookingPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> }, // /dashboard home

      // Admin Routes
      {
        path: "manage-users",
       element: 
        (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },

      // Manager Routes
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        ),
      },

      // Buyer Routes
      {
        path: "my-orders",
        element: (
          <BuyerRoute>
            <MyOrders />
          </BuyerRoute>
        ),
      },
    ],
  },
]);
