import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineAppstore,
  AiOutlineShoppingCart,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { MdManageAccounts, MdOutlineLocationOn } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

const DashboardSidebar = ({ isOpen }) => {
  const { user } = useAuth();

  // isActive প্যারামিটারটি NavLink থেকে অটোমেটিক আসে
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-600 text-white py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all shadow-md"
      : "text-gray-700 hover:bg-blue-100 py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all";

  return (
    <aside
      className={`min-h-screen bg-base-200 border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <ul className="menu p-2">
        {/* ========== COMMON ========== */}
        {/* Home এর জন্য end প্রোপার্টি জরুরি যাতে সব রুটে এটি একটিভ না দেখায় */}
        <NavLink to="/" end className={linkClass}>
          <AiOutlineHome className="text-xl" />
          {isOpen && <span className="font-medium">Home</span>}
        </NavLink>

        {/* Dashboard Home - এখানেও end ব্যবহার করা ভালো */}
        <NavLink to="/dashboard" end className={linkClass}>
          <AiOutlineDashboard className="text-xl" />
          {isOpen && <span className="font-medium">Dashboard</span>}
        </NavLink>

        {/* ========== ADMIN ========== */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/dashboard/manage-users" className={linkClass}>
              <AiOutlineUser className="text-xl" />
              {isOpen && <span className="font-medium">Manage Users</span>}
            </NavLink>

            <NavLink to="/dashboard/all-products" className={linkClass}>
              <AiOutlineAppstore className="text-xl" />
              {isOpen && <span className="font-medium">All Products</span>}
            </NavLink>

            <NavLink to="/dashboard/all-orders" className={linkClass}>
              <AiOutlineShoppingCart className="text-xl" />
              {isOpen && <span className="font-medium">All Orders</span>}
            </NavLink>
          </>
        )}

        {/* ========== MANAGER ========== */}
        {user?.role === "manager" && (
          <>
            <NavLink to="/dashboard/add-product" className={linkClass}>
              <AiOutlinePlus className="text-xl" />
              {isOpen && <span className="font-medium">Add Product</span>}
            </NavLink>
            
            <NavLink to="/dashboard/manage-products" className={linkClass}>
              <MdManageAccounts className="text-xl" />
              {isOpen && <span className="font-medium">Manage Products</span>}
            </NavLink>

            <NavLink to="/dashboard/pending-orders" className={linkClass}>
              <AiOutlineClockCircle className="text-xl" />
              {isOpen && <span className="font-medium">Pending Orders</span>}
            </NavLink>

            <NavLink to="/dashboard/approved-orders" className={linkClass}>
              <AiOutlineCheck className="text-xl" />
              {isOpen && <span className="font-medium">Approved Orders</span>}
            </NavLink>
          </>
        )}

        {/* ========== BUYER ========== */}
        {user?.role === "buyer" && (
          <>
            <NavLink to="/dashboard/my-orders" className={linkClass}>
              <AiOutlineShoppingCart className="text-xl" />
              {isOpen && <span className="font-medium">My Orders</span>}
            </NavLink>

            <NavLink to="/dashboard/track-order" className={linkClass}>
              <MdOutlineLocationOn className="text-xl" />
              {isOpen && <span className="font-medium">Track Order</span>}
            </NavLink>
          </>
        )}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;