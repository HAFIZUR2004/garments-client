import React from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";

const ProfileDropdown = ({ userData, onClose }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    onClose(); // close dropdown
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-md z-50 border">
      {/* User Info */}
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

      {/* Actions */}
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
