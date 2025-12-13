import { useEffect, useState } from "react";
import { FaBox, FaClock, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManagerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosSecure.get("/api/manager/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Products" count={stats.products} icon={<FaBox />} />
        <StatCard title="Pending Orders" count={stats.pending} icon={<FaClock />} />
        <StatCard title="Approved Orders" count={stats.approved} icon={<FaCheckCircle />} />
        <StatCard title="Total Orders" count={stats.totalOrders} icon={<FaShoppingBag />} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="bg-emerald-600 text-white p-5 rounded-lg flex justify-between items-center">
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm">{title}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default ManagerDashboardHome;
