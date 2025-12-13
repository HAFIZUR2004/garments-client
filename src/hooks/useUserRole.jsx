import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = (email) => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!email) return;

    axiosSecure
      .get(`/api/users/role/${email}`)
      .then((res) => setRole(res.data.role))
      .catch(() => setRole(null))
      .finally(() => setRoleLoading(false));
  }, [email]);

  return { role, roleLoading };
};

export default useUserRole;
