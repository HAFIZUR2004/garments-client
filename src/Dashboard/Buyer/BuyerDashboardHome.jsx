import { useEffect, useState } from "react";
import { FaShoppingCart, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BuyerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosSecure.get("/api/buyer/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Orders" count={stats.total} icon={<FaShoppingCart />} />
        <StatCard title="Pending" count={stats.pending} icon={<FaClock />} />
        <StatCard title="Approved" count={stats.approved} icon={<FaCheck />} />
        <StatCard title="Rejected" count={stats.rejected} icon={<FaTimes />} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="bg-sky-600 text-white p-5 rounded-lg flex justify-between items-center">
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm">{title}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default BuyerDashboardHome;
