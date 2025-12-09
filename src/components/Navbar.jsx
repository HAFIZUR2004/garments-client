import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import defaultAvatar from "../assets/haf.jpeg";

const Navbar = () => {
  const { user, loading, logOut } = useAuth();
  console.log(user)
  // 🔥 Firebase user load না হওয়া পর্যন্ত navbar দেখাবে না
  if (loading) {
    return null; // চাইলে Spinner return করতে পারো
  }

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "text-gray-700 hover:text-blue-500";

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      
      {/* Left - Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        GarmentsPro
      </Link>

      {/* Right - Menu */}
      <ul className="flex items-center gap-6">
        
        {/* Common Links */}
        <li>
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/allproducts" className={navLinkClass}>All-Products</NavLink>
        </li>

        {/* Before Login */}
        {!user && (
          <>
            <li>
              <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </li>
            <li>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            </li>
            <li>
              <NavLink 
                to="/register"
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Register
              </NavLink>
            </li>
          </>
        )}

        {/* After Login */}
        {user && (
          <>
            <li>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            </li>

            {/* User Avatar */}
            <li>
              <img
                src={user?.photoURL || defaultAvatar}
                alt="user"
                className="w-9 h-9 rounded-full border"
                title={user?.displayName}
              />
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
