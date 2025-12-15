// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   AiOutlineHome,
//   AiOutlineDashboard,
//   AiOutlineUser,
//   AiOutlineAppstore,
//   AiOutlineShoppingCart,
//   AiOutlinePlus,
//   AiOutlineCheck,
//   AiOutlineClockCircle,
// } from "react-icons/ai";
// import { MdOutlineLocationOn } from "react-icons/md";

// const DashboardSidebar = ({ isOpen }) => {
//   const linkClass = ({ isActive }) =>
//     isActive
//       ? "bg-blue-500 text-white py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300"
//       : "text-gray-700 hover:bg-blue-100 py-2 px-3 rounded flex items-center gap-3 mb-2 transition-all duration-300";

//   const menuItems = [
//     { to: "/", name: "Home", icon: <AiOutlineHome /> },
//     { to: "/dashboard", name: "Dashboard Home", icon: <AiOutlineDashboard /> },
//     { to: "/dashboard/manage-users", name: "Manage Users", icon: <AiOutlineUser /> },
//     { to: "/dashboard/all-products", name: "All Products", icon: <AiOutlineAppstore /> },
//     { to: "/dashboard/all-orders", name: "All Orders", icon: <AiOutlineShoppingCart /> },
//     { to: "/dashboard/add-product", name: "Add Product", icon: <AiOutlinePlus /> },
//     { to: "/dashboard/pending-orders", name: "Pending Orders", icon: <AiOutlineClockCircle /> },
//     { to: "/dashboard/approved-orders", name: "Approved Orders", icon: <AiOutlineCheck /> },
//      {to: "/dashboard/track-order",name: "Track Order",icon: <MdOutlineLocationOn />,},
//     { to: "/dashboard/my-orders", name: "My Orders", icon: <AiOutlineShoppingCart /> },
   
//   ];

//   return (
//     <aside
//       className={`flex flex-col min-h-screen bg-base-200 border-r transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <ul className="menu flex-1 p-2">
//         {menuItems.map((item) => (
//           <li key={item.to} className="relative group">
//             <NavLink to={item.to} end className={linkClass}>
//               {/* Icon */}
//               <span className="text-lg">{item.icon}</span>

//               {/* Text */}
//               {isOpen && <span>{item.name}</span>}
//             </NavLink>

//             {/* Tooltip when sidebar collapsed */}
//             {!isOpen && (
//               <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity">
//                 {item.name}
//               </span>
//             )}
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// };

// export default DashboardSidebar;


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
import { MdOutlineLocationOn } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

const DashboardSidebar = ({ isOpen }) => {
  const { user } = useAuth(); // user.role

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-500 text-white py-2 px-3 rounded flex items-center gap-3 mb-2"
      : "text-gray-700 hover:bg-blue-100 py-2 px-3 rounded flex items-center gap-3 mb-2";

  return (
    <aside
      className={`min-h-screen bg-base-200 border-r transition-all ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <ul className="menu p-2">

        {/* ========== COMMON ========== */}
        <NavLink to="/" className={linkClass}>
          <AiOutlineHome className="text-lg" />
          {isOpen && "Home"}
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          <AiOutlineDashboard className="text-lg" />
          {isOpen && "Dashboard"}
        </NavLink>

        {/* ========== ADMIN ========== */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/dashboard/manage-users" className={linkClass}>
              <AiOutlineUser className="text-lg" />
              {isOpen && "Manage Users"}
            </NavLink>

            <NavLink to="/dashboard/all-products" className={linkClass}>
              <AiOutlineAppstore className="text-lg" />
              {isOpen && "All Products"}
            </NavLink>

            <NavLink to="/dashboard/all-orders" className={linkClass}>
              <AiOutlineShoppingCart className="text-lg" />
              {isOpen && "All Orders"}
            </NavLink>
          </>
        )}

        {/* ========== MANAGER ========== */}
        {user?.role === "manager" && (
          <>
            <NavLink to="/dashboard/add-product" className={linkClass}>
              <AiOutlinePlus className="text-lg" />
              {isOpen && "Add Product"}
            </NavLink>

            <NavLink to="/dashboard/pending-orders" className={linkClass}>
              <AiOutlineClockCircle className="text-lg" />
              {isOpen && "Pending Orders"}
            </NavLink>

            <NavLink to="/dashboard/approved-orders" className={linkClass}>
              <AiOutlineCheck className="text-lg" />
              {isOpen && "Approved Orders"}
            </NavLink>
          </>
        )}

        {/* ========== BUYER ========== */}
        {user?.role === "buyer" && (
          <>
            <NavLink to="/dashboard/my-orders" className={linkClass}>
              <AiOutlineShoppingCart className="text-lg" />
              {isOpen && "My Orders"}
            </NavLink>

            <NavLink to="/dashboard/track-order/:orderId" className={linkClass}>
              <MdOutlineLocationOn className="text-lg" />
              {isOpen && "Track Order"}
            </NavLink>
          </>
        )}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
