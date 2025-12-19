import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiHome, FiBox, FiInfo, FiPhone, FiLogIn, FiUserPlus, FiLogOut, FiGrid, FiMenu, FiX } from "react-icons/fi";
import defaultAvatar from "../assets/avater.jpg";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, loading, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
    setProfileDropdown(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold flex items-center gap-2 py-2 lg:py-0"
      : "text-gray-700 hover:text-blue-500 flex items-center gap-2 py-2 lg:py-0";

  return (
    <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      
      {/* --- LEFT SECTION: Logo & Mobile Menu Toggle --- */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button (Only shows on mobile) */}
        <button
          className="lg:hidden text-gray-700 p-1"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setProfileDropdown(false); // প্রোফাইল খোলা থাকলে বন্ধ করে দিবে
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>

        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <FiGrid size={24} className="hidden xs:block" /> GarmentsPro
        </Link>
      </div>

      {/* --- CENTER SECTION: Navigation Links (Desktop + Mobile Dropdown) --- */}
      <div className={`
        absolute lg:static top-[60px] left-0 w-full lg:w-auto bg-white lg:bg-transparent 
        shadow-lg lg:shadow-none transition-all duration-300 ease-in-out z-40
        ${mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100"}
      `}>
        <ul className="flex flex-col lg:flex-row gap-4 p-6 lg:p-0">
          <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiHome /> Home</NavLink></li>
          <li><NavLink to="/allproducts" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiBox /> Products</NavLink></li>
          {!user && (
            <>
              <li><NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiInfo /> About Us</NavLink></li>
              <li><NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiPhone /> Contact</NavLink></li>
              <li><NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiLogIn /> Login</NavLink></li>
              <li>
                <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1 w-fit">
                  <FiUserPlus /> Register
                </NavLink>
              </li>
            </>
          )}
          {user && (
            <li className="lg:hidden">
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}><FiGrid /> Dashboard</NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* --- RIGHT SECTION: Profile & Auth --- */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdown(!profileDropdown);
                setMobileMenuOpen(false); // মেনু খোলা থাকলে বন্ধ করে দিবে
              }}
              className="flex items-center gap-2 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-blue-500 transition"
            >
              <img src={user?.photoURL || defaultAvatar} alt="user" className="w-9 h-9 rounded-full object-cover" />
              <span className="hidden md:inline font-medium text-gray-700">{user?.displayName?.split(' ')[0]}</span>
            </button>

            <AnimatePresence>
              {profileDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-xl z-50 border border-gray-100 overflow-hidden"
                >
                  <div className="p-5 bg-blue-50 flex flex-col items-center text-center">
                    <img src={user?.photoURL || defaultAvatar} alt="user" className="w-16 h-16 rounded-full border-4 border-white shadow-sm mb-2" />
                    <span className="font-bold text-gray-800">{user?.displayName}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                  
                  <div className="p-2">
                    <Link to="/dashboard" onClick={() => setProfileDropdown(false)} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                      <FiGrid size={18} /> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" onClick={() => setProfileDropdown(false)} className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                      <FiUserPlus size={18} /> Profile Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2">
            {/* Desktop Auth buttons (If needed when not logged in) */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;