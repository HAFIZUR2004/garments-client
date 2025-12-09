import React from "react";

const DashboardNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-base-300 px-4 py-3 shadow-md">
      {/* Sidebar Toggle Button */}
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Navbar Title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* User/Avatar */}
      <div className="flex items-center gap-4">
        <span className="hidden md:inline">Admin</span>
        <img
          src="https://via.placeholder.com/32"
          alt="User"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </nav>
  );
};

export default DashboardNavbar;
