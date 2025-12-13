import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <DashboardNavbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <main className="flex-1 p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
