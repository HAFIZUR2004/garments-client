import { useEffect, useState } from "react";
import { FaUsers, FaBox, FaShoppingCart, FaUserTie } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    users: 0,
    managers: 0,
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    axiosSecure.get("/api/admin/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" count={stats.users} icon={<FaUsers />} />
        <StatCard title="Total Managers" count={stats.managers} icon={<FaUserTie />} />
        <StatCard title="Total Products" count={stats.products} icon={<FaBox />} />
        <StatCard title="Total Orders" count={stats.orders} icon={<FaShoppingCart />} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="bg-indigo-600 text-white p-5 rounded-lg flex justify-between items-center">
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm">{title}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default AdminDashboardHome;
