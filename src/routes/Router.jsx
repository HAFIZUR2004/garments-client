import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// Auth
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";

// Public Pages
import Home from "../pages/Home/Home.jsx";
import AllProducts from "../Products/AllProducts.jsx";
import ProductDetails from "../Products/ProductDetails.jsx";
import BookingPage from "../Products/BookingPage.jsx";
import BuyNowPage from "../Products/BuyNowPage.jsx";

// Dashboard Home (ROLE BASED)
import Dashboard from "../Dashboard/DashboardHome.jsx";

// Admin Pages
import ManageUsers from "../Dashboard/Admin/ManageUsers.jsx";
import AdminAllProducts from "../Dashboard/Admin/AdminAllProducts.jsx";
import AdminAllOrders from "../Dashboard/Admin/AdminAllOrders.jsx";

// Manager Pages
import AddProduct from "../Dashboard/Manager/AddProduct.jsx";

// Buyer Pages
import MyOrders from "../Dashboard/Buyer/MyOrders.jsx";
import TrackOrder from "../Dashboard/Buyer/TrackOrder.jsx";

// Route Guards
import PrivateRoute from "../components/PrivateRoute.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import ManagerRoute from "../components/ManagerRoute.jsx";
import BuyerRoute from "../components/BuyerRoute.jsx";
import ApprovedOrders from "../Dashboard/Manager/approved-orders.jsx";
import PendingOrders from "../Dashboard/Manager/pending-orders.jsx";

export const router = createBrowserRouter([
  // ================= PUBLIC ROUTES =================
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "allproducts", element: <AllProducts /> },
      { path: "product/:id", element: <ProductDetails /> },
    ],
  },

  // ================= DASHBOARD ROUTES =================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // 🔥 ROLE BASED DASHBOARD HOME
      {
        path: "",
        element: <Dashboard />, // Admin / Manager / Buyer auto detect
      },

      // ========== ADMIN ROUTES ==========
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-products",
        element: (
          <AdminRoute>
            <AdminAllProducts />
          </AdminRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AdminAllOrders />
          </AdminRoute>
        ),
      },

      // ========== MANAGER ROUTES ==========
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        ),
      },
      {
        path: "PendingOrders",
        element: (
          <ManagerRoute>
            <PendingOrders/>
          </ManagerRoute>
        ),
      },
      {
        path: "ApprovedOrders",
        element: (
          <ManagerRoute>
            <ApprovedOrders/>
          </ManagerRoute>
        ),
      },

      // ========== BUYER ROUTES ==========
      {
        path: "my-orders",
        element: (
          <BuyerRoute>
            <MyOrders />
          </BuyerRoute>
        ),
      },
      {
        path: "book/:id",
        element: (
          <BuyerRoute>
            <BookingPage />
          </BuyerRoute>
        ),
      },
      {
        path: "buy-now",
        element: (
          <BuyerRoute>
            <BuyNowPage />
          </BuyerRoute>
        ),
      },
      {
        path: "/dashboard/track-order/:orderId",
        element: (
          <BuyerRoute>
            <TrackOrder />
          </BuyerRoute>
        ),
      },
    ],
  },
]);
