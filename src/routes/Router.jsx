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
import PaymentSuccessPage from "../pages/PaymentSuccessPage.jsx";
import ProfilePage from "../Dashboard/ProfilePage.jsx";
import ManageProducts from "../Dashboard/Manager/ManageProducts.jsx";
import AboutUs from "../pages/AboutUs.jsx";
import Contact from "../pages/Contact.jsx";

export const router = createBrowserRouter([
    // ================= PUBLIC ROUTES =================
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "login", element: <Login /> },
            // ❌ REMOVED: { path: "paymentsuccesspage", element: <PaymentSuccessPage/> }, 
            { path: "register", element: <Register /> },
            { path: "allproducts", element: <AllProducts /> },
            { path: "about", element: <AboutUs/>},
            { path: "contact", element: <Contact/> },

            {
                path: "product/:id",
                element: (
                    <PrivateRoute>
                        <ProductDetails />
                    </PrivateRoute>
                ),
            },
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
            {
                path: "profile",
                element: <ProfilePage />,
            },

            // ✅ ADDED: পেমেন্ট সফলতার পাতা
            {
                path: "payment-success",
                element: <PaymentSuccessPage />,
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
                path: "/dashboard/add-product",
                element: (
                    <ManagerRoute blockOnSuspend>
                        <AddProduct />
                    </ManagerRoute>
                ),
            },
            {
                path: "/dashboard/manage-products",
                element: <ManageProducts />,
                //  (
                //     <ManagerRoute>
                //         <ManageProducts />
                //     </ManagerRoute>
                // ),
            },
            {
                path: "/dashboard/pending-orders",
                element: (
                    <ManagerRoute>
                        <PendingOrders />
                    </ManagerRoute>
                ),
            },
            {
                path: "/dashboard/approved-orders",
                element: (
                    <ManagerRoute blockOnSuspend>
                        <ApprovedOrders />
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
            // 💡 ড্যাশবোর্ড রুটের ভেতরে থাকলে /dashboard/track-order/:orderId না লিখে শুধু track-order/:orderId লিখুন।
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