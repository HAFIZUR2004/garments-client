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
  AiOutlineClockCircle 
} from "react-icons/ai";

const DashboardSidebar = ({ isOpen }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-500 text-white py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300"
      : "text-gray-700 hover:bg-blue-100 py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300";

  const menuItems = [
    { to: "/", name: "Home", icon: <AiOutlineHome /> },
    { to: "/dashboard", name: "Dashboard Home", icon: <AiOutlineDashboard /> },
    { to: "/dashboard/manage-users", name: "Manage Users", icon: <AiOutlineUser /> },
    { to: "/dashboard/all-products", name: "All Products", icon: <AiOutlineAppstore /> },
    { to: "/dashboard/all-orders", name: "All Orders", icon: <AiOutlineShoppingCart /> },
    { to: "/dashboard/add-product", name: "Add Product", icon: <AiOutlinePlus /> },
    { to: "/dashboard/PendingOrders", name: "Pending Orders", icon: <AiOutlineClockCircle /> },
    { to: "/dashboard/ApprovedOrders", name: "Approved Orders", icon: <AiOutlineCheck /> },
    { to: "/dashboard/my-orders", name: "My Orders", icon: <AiOutlineShoppingCart /> },
  ];

  return (
    <aside
      className={`flex flex-col min-h-screen bg-base-200 border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <ul className="menu flex-1 p-2">
        {menuItems.map((item) => (
          <li key={item.to} className="relative group">
            <NavLink to={item.to} end className={linkClass}>
              {/* Icon */}
              <span className="text-lg">{item.icon}</span>

              {/* Text only show if sidebar open */}
              {isOpen && <span>{item.name}</span>}
            </NavLink>

            {/* Tooltip when collapsed */}
            {!isOpen && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
