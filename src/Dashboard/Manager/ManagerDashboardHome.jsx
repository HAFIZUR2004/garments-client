import React, { useEffect, useState } from "react";
import { FaBox, FaClock, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../hooks/useAuth";

const ManagerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [productsCount, setProductsCount] = useState(0); // প্রোডাক্ট সংখ্যা রাখার জন্য
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      
      // ১. প্রোডাক্টের সংখ্যা পাওয়ার জন্য ManageProducts এর মতো কল
      const productRes = await axiosSecure.get(`/api/products/managed?email=${user.email}`);
      setProductsCount(productRes.data?.length || 0);

      // ২. অন্যান্য স্ট্যাটাস (অর্ডার ইত্যাদি) পাওয়ার জন্য কল
      const statsRes = await axiosSecure.get(`/api/manager/stats?email=${user.email}`);
      setStats(statsRes.data);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  if (authLoading || loading)
    return <p className="p-6 text-center text-gray-500">Loading Dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* এখানে productsCount দেখানো হচ্ছে */}
        <StatCard title="My Products" count={productsCount} icon={<FaBox />} />
        
        <StatCard title="Pending Orders" count={stats.pending || 0} icon={<FaClock />} />
        <StatCard title="Approved Orders" count={stats.approved || 0} icon={<FaCheckCircle />} />
        <StatCard title="Total Orders" count={stats.totalOrders || 0} icon={<FaShoppingBag />} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="bg-emerald-600 text-white p-5 rounded-lg flex justify-between items-center shadow-md">
    <div>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm font-medium">{title}</p>
    </div>
    <div className="text-4xl opacity-80">{icon}</div>
  </div>
);

export default ManagerDashboardHome;