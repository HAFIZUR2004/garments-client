import React from "react";
import AdminDashboardHome from "./Admin/AdminDashboardHome";
import ManagerDashboardHome from "./Manager/ManagerDashboardHome";
import BuyerDashboardHome from "./Buyer/BuyerDashboardHome";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardHome = () => {
  const { firebaseUser } = useAuth();
  const { role, roleLoading } = useUserRole(firebaseUser?.email);

  // লোডিং অবস্থায় আপনার কাস্টম স্পিনারটি দেখাবে
  if (roleLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // রোল অনুযায়ী ড্যাশবোর্ড রিটার্ন
  if (role === "admin") return <AdminDashboardHome />;
  if (role === "manager") return <ManagerDashboardHome />;
  if (role === "buyer") return <BuyerDashboardHome />;

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold text-red-500">No role found</h2>
      <p className="text-gray-500">Please contact support if you think this is an error.</p>
    </div>
  );
};

export default DashboardHome;