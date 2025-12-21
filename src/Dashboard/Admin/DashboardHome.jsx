import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaBox, FaClipboardList, FaShoppingCart } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  const [chartData, setChartData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRes = await axios.get("https://garments-server-omega.vercel.app/api/users");
      const productsRes = await axios.get("https://garments-server-omega.vercel.app/api/products");
      const ordersRes = await axios.get("https://garments-server-omega.vercel.app/api/orders");

      const users = usersRes.data || [];
      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
      });

      // Example: set chart with orders per day (assuming orders have createdAt)
      const orderCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
      orders.forEach((o) => {
        const day = new Date(o.createdAt).getDay(); // 0 = Sun, 1 = Mon ...
        const index = day === 0 ? 6 : day - 1; // convert Sun=0 to last index
        orderCounts[index]++;
      });

      setChartData((prev) => ({
        ...prev,
        datasets: [{ ...prev.datasets[0], data: orderCounts }],
      }));
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{stats.totalUsers}</p>
            <p className="text-sm">Total Users</p>
          </div>
          <FaUsers className="text-3xl text-white" />
        </div>
        <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{stats.totalProducts}</p>
            <p className="text-sm">Total Products</p>
          </div>
          <FaBox className="text-3xl text-white" />
        </div>
        <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{stats.totalOrders}</p>
            <p className="text-sm">Total Orders</p>
          </div>
          <FaShoppingCart className="text-3xl text-white" />
        </div>
        <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{stats.pendingOrders}</p>
            <p className="text-sm">Pending Orders</p>
          </div>
          <FaClipboardList className="text-3xl text-white" />
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <Line data={chartData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 text-black rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border border-gray-300">Order ID</th>
                <th className="p-3 border border-gray-300">User</th>
                <th className="p-3 border border-gray-300">Product</th>
                <th className="p-3 border border-gray-300">Quantity</th>
                <th className="p-3 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.totalOrders === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                // optionally map orders here if you want to show them
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    {/* Map real orders if you fetch them */}
                    {/* Example: orders.map(...) */}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
