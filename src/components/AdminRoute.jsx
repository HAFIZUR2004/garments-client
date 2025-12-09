import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole(user?.email);
  const location = useLocation();

  if (loading || roleLoading) return <p className="text-center mt-12">Loading...</p>;

  if (!user || role !== "admin") return <Navigate to="/" state={{ from: location }} replace />;

  return children;
};

export default AdminRoute;
