import { useEffect, useState } from "react";
import axios from "axios";

const useUserRole = (email) => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  console.log(role)
  useEffect(() => {
    if (!email) return;

    setRoleLoading(true);

    axios
      .get(`http://localhost:5000/api/users/role/${email}`)
      .then((res) => {
        setRole(res.data.role);
      })
      .catch((err) => {
        console.error(err);
        setRole(null);
      })
      .finally(() => {
        setRoleLoading(false);
      });
  }, [email]);

  return { role, roleLoading };
};

export default useUserRole;
