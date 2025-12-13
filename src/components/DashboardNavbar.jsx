import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";

const DashboardNavbar = ({ toggleSidebar }) => {
  const { firebaseUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Anonymous",
    email: "",
    photoURL: "https://via.placeholder.com/40",
  });

  const dropdownRef = useRef();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      setUserData({
        name: firebaseUser.displayName || "Anonymous",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || "https://via.placeholder.com/40",
      });
    }
  }, [firebaseUser]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between bg-base-300 px-4 py-3 shadow-md relative">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="btn btn-ghost p-2"
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navbar Title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* User / Avatar */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src={userData.photoURL}
            alt={userData.name}
            className="w-8 h-8 rounded-full border"
          />
          <span className="hidden md:inline">{userData.name}</span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-md z-50 border">
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
              <img
                src={userData.photoURL}
                alt={userData.name}
                className="w-12 h-12 rounded-full border"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{userData.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">{userData.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
