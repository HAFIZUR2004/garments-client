import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = (email) => {
   const [userInfo, setUserInfo] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!email) return;

  axiosSecure
      .get(`/api/users/by-email/${email}`)
      .then((res) => setUserInfo(res.data))
      .catch(() => setUserInfo(null))
      .finally(() => setRoleLoading(false));
  }, [email]);

   return {
    role: userInfo?.role,
    status: userInfo?.status,
    isSuspended: userInfo?.status === "suspended",
    roleLoading,
    suspendReason: userInfo?.suspendReason,
  };
};

export default useUserRole;
