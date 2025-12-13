import React from "react";
import { NavLink } from "react-router-dom";

const DashboardSidebar = ({ isOpen }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-500 text-white py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300"
      : "text-gray-700 hover:bg-blue-100 py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300";

  const menuItems = [
    {
      to: "/",
      name: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M13 5v6h6", // Home icon
    },
    {
      to: "/dashboard",
      name: "Dashboard Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M13 5v6h6",
    },
    {
      to: "/dashboard/manage-users",
      name: "Manage Users",
      icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857"
    },
    {
      to: "/dashboard/all-products",
      name: "All Products",
      icon: "M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6",
    },
    {
      to: "/dashboard/all-orders",
      name: "All Orders",
      icon: "M9 17v-6h6v6",
    },
    {
      to: "/dashboard/add-product",
      name: "Add Product",
      icon: "M12 4v16m8-8H4",
    },
    {
      to: "/dashboard/track-order",
      name: "Track Order",
      icon: "M12 4v16m8-8H4",
    },
    {
      to: "/dashboard/my-orders",
      name: "My Orders",
      icon: "M5 13l4 4L19 7",
    },
  ];

  return (
    <aside
      className={`flex flex-col min-h-screen bg-base-200 border-r transition-all duration-300 ${isOpen ? "w-64" : "w-16"
        }`}
    >
      <ul className="menu flex-1 p-2">
        {menuItems.map((item) => (
          <li key={item.to} className="relative group">
            <NavLink to={item.to} end className={linkClass}>
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Use different icon for Home */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.to === "/" ? "M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4h-4v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" : item.icon}
                />
              </svg>

              {/* Text only show if sidebar open */}
              {isOpen && <span>{item.name}</span>}
            </NavLink>

            {/* Only Dashboard Home shows tooltip when collapsed */}
            {!isOpen && item.name === "Dashboard Home" && (
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
