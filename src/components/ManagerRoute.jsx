import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import { useAuth } from "../hooks/useAuth";

const ManagerRoute = ({ children, blockOnSuspend = false }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading, isSuspended } = useUserRole(user?.email);
  const location = useLocation();

  if (loading || roleLoading) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  // ✅ manager OR admin allowed
  if (!user || (role !== "manager" && role !== "admin")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 🔴 Suspend check
  // blockOnSuspend = true হলে শুধুমাত্র restricted actions block হবে
 if (isSuspended && blockOnSuspend) {
  return (
    <Navigate
      to="/dashboard/profile"
      state={{ message: "Account suspended" }}
      replace
    />
  );
}


  return children;
};

export default ManagerRoute;
