import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom"; // Link যোগ করা হলো নেভিগেশনের জন্য

const DashboardNavbar = ({ toggleSidebar }) => {
  const { firebaseUser, logout, userProfile } = useAuth(); // userProfile ব্যবহার করা হলো
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- থিম স্টেট এবং লজিক ---
  // আপনার ডার্ক মোড লজিক যদি না থাকে, তবে এই অংশটি বাদ দিতে পারেন। 
  // আমি ধরে নিচ্ছি আপনার অ্যাপে ডার্ক মোড সাপোর্ট আছে।
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || false
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  // --- থিম স্টেট এবং লজিক শেষ ---

  // --- ইউজার ডেটা ---
  const userData = {
    name: firebaseUser?.displayName || userProfile?.name || "Anonymous User",
    email: firebaseUser?.email || "N/A",
    photoURL:
      firebaseUser?.photoURL || userProfile?.photoURL || "https://via.placeholder.com/40/007bff/ffffff?text=U", // Default Avatar
  };

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

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 shadow-md sticky top-0 z-40">
      
      {/* 1. Sidebar Toggle / Hamburger Menu (Mobile Responsive) */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 dark:text-gray-300 btn btn-ghost p-2 lg:hidden" // lg:hidden added for desktop hide
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

      {/* 2. Logo / Dashboard Title */}
      <Link to="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Dashboard
      </Link>

      {/* 3. Right Side: Theme Toggle & User Menu */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle (Optional) */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost p-2 text-gray-600 dark:text-gray-300"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            // Sun icon for Light Mode
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.585 5.567a.75.75 0 0 1-.758 1.144L3.89 4.672a.75.75 0 0 1 .757-1.144l2.938 1.939Z" />
                <path fillRule="evenodd" d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM2.25 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75ZM4.672 19.332a.75.75 0 0 1 1.144-.758l1.939 2.938a.75.75 0 0 1-1.144.758l-1.94-2.938ZM11.25 12a.75.75 0 0 1 1.5 0v.008a.75.75 0 0 1-1.5 0v-.008Z" clipRule="evenodd" />
                <path d="M16.415 5.567a.75.75 0 0 1-.758-1.144l2.938-1.939a.75.75 0 1 1 .758 1.144l-2.938 1.939Z" />
                <path fillRule="evenodd" d="M19.332 4.672a.75.75 0 0 1 .758 1.144l-1.939 2.938a.75.75 0 0 1-1.144-.758l1.939-2.938Z" clipRule="evenodd" />
            </svg>
          ) : (
            // Moon icon for Dark Mode
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.544 1.764a.75.75 0 0 1 1.14.94L8.71 5.922a.75.75 0 0 1-1.14-.94l1.974-3.218ZM13.89 1.764a.75.75 0 0 1 1.14.94l-1.974 3.218a.75.75 0 0 1-1.14-.94l1.974-3.218Z" clipRule="evenodd" />
                <path d="M12 6a6 6 0 0 0-5.69 3.9h11.38A6 6 0 0 0 12 6Z" />
                <path fillRule="evenodd" d="M17.25 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75ZM4.5 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H5.25A.75.75 0 0 1 4.5 12Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M7.71 18.078a.75.75 0 0 1 1.14.94l-1.974 3.218a.75.75 0 0 1-1.14-.94l1.974-3.218Z" clipRule="evenodd" />
                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                <path fillRule="evenodd" d="M15.82 18.078a.75.75 0 0 1 1.14.94l-1.974 3.218a.75.75 0 0 1-1.14-.94l1.974-3.218Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <img
              src={userData.photoURL}
              alt={userData.name}
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            {/* User Name (hidden on small screens) */}
            <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-200">
                {userData.name}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-700 shadow-xl rounded-lg z-50 border border-gray-200 dark:border-gray-600 overflow-hidden">
              
              {/* User Info Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
                <img
                  src={userData.photoURL}
                  alt={userData.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={userData.name}>
                    {userData.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300 truncate" title={userData.email}>
                    {userData.email}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-6-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-2 4a5 5 0 0 0-4.546 2.916 5.98 5.98 0 0 0 8.902 0A5 5 0 0 0 10 11z" clipRule="evenodd" /></svg>
                    View Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;