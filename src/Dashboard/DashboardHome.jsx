
import AdminDashboardHome from "./Admin/AdminDashboardHome";
import ManagerDashboardHome from "./Manager/ManagerDashboardHome";
import BuyerDashboardHome from "./Buyer/BuyerDashboardHome";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const DashboardHome = () => {
  const { firebaseUser } = useAuth();
  const { role, roleLoading } = useUserRole(firebaseUser?.email);

  if (roleLoading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  if (role === "admin") return <AdminDashboardHome />;
  if (role === "manager") return <ManagerDashboardHome />;
  if (role === "buyer") return <BuyerDashboardHome />;

  return <div className="p-10 text-center">No role found</div>;
};

export default DashboardHome;
