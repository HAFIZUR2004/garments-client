import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiHome,
  FiBox,
  FiInfo,
  FiPhone,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import defaultAvatar from "../assets/avater.jpg";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, firebaseUser, userProfile, loading, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const userData = {
    name:
      user?.displayName ||
      firebaseUser?.displayName ||
      userProfile?.name ||
      "User",
    email: user?.email || firebaseUser?.email || "N/A",
    photoURL:
      user?.photoURL ||
      firebaseUser?.photoURL ||
      userProfile?.photoURL ||
      defaultAvatar,
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 py-2 font-medium transition-all
     ${
       isActive
         ? "text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600"
         : "text-gray-700 hover:text-blue-600"
     }`;

  return (
    <nav className="w-full backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-gray-700"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setProfileDropdown(false);
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>

        <Link
          to="/"
          className="text-xl font-bold text-gray-800 flex items-center gap-2 tracking-wide"
        >
          <FiGrid /> GarmentsPro
        </Link>
      </div>

      {/* CENTER */}
      <div
        className={`absolute lg:static top-[64px] left-0 w-full lg:w-auto
        backdrop-blur-md lg:backdrop-blur-0
        border-b lg:border-0 border-gray-200
        transition-all duration-300
        ${
          mobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100"
        }`}
      >
        <ul className="flex flex-col lg:flex-row gap-6 px-6 py-4 lg:p-0">
          <li>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
              <FiHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/allproducts" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
              <FiBox /> Products
            </NavLink>
          </li>

          {!user && (
            <>
              <li>
                <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  <FiInfo /> About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  <FiPhone /> Contact
                </NavLink>
              </li>

              {/* Login */}
              <li>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-300
                  hover:border-blue-500 hover:text-blue-600
                  transition flex items-center gap-2"
                >
                  <FiLogIn /> Login
                </NavLink>
              </li>

              {/* Register */}
              <li>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2 rounded-full border border-blue-600
                  text-blue-600 font-semibold
                  hover:bg-blue-600 hover:text-white
                  transition-all flex items-center gap-2"
                >
                  <FiUserPlus /> Register
                </NavLink>
              </li>
            </>
          )}

          {user && (
            <li className="lg:hidden">
              <NavLink to="/dashboard" className={navLinkClass}>
                <FiGrid /> Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-blue-500 transition"
            >
              <img
                src={userData.photoURL}
                onError={(e) => (e.target.src = defaultAvatar)}
                className="w-9 h-9 rounded-full object-cover border"
                alt="user"
              />
              <span className="hidden md:inline font-medium text-gray-700">
                {userData.name.split(" ")[0]}
              </span>
            </button>

            <AnimatePresence>
              {profileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 backdrop-blur-xl
                  border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="p-5 text-center">
                    <img
                      src={userData.photoURL}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                      alt="user"
                    />
                    <p className="font-bold text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>

                  <div className="px-2 pb-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100"
                    >
                      <FiGrid /> Dashboard
                    </Link>

                    <button
                      onClick={logOut}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
