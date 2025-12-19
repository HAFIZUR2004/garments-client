import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner"; // ✅ spinner import

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true); // ✅ start loading
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/status`, {
        status: "active",
      });
      Swal.fire("Approved!", "User approved successfully", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to approve user", "error");
    }
  };

  const handleSuspend = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Suspend Reason",
      input: "textarea",
      inputLabel: "Why are you suspending this user?",
      showCancelButton: true,
    });

    if (reason) {
      try {
        await axios.put(`http://localhost:5000/api/users/${id}/status`, {
          status: "suspended",
          suspendReason: reason,
        });
        Swal.fire("Suspended!", "User suspended successfully", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", "Failed to suspend user", "error");
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, {
        role: newRole,
      });
      Swal.fire("Updated!", "User role updated", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  const makeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, {
        role: "admin",
      });
      Swal.fire("Success!", "User is now Admin (status pending)", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ ONLY spinner render
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gradient-to-r text-black from-purple-50 via-pink-50 to-yellow-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-900">
        Manage Users
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
        <table className="table w-full text-center">
          <thead className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {filteredUsers.map((user, index) => (
              <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>{index + 1}</td>
                <td>{user.name || "No Name"}</td>
                <td>{user.email}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="select select-bordered select-sm"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      user.status === "active"
                        ? "bg-green-500"
                        : user.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="flex gap-2 justify-center">
                  {user.status === "pending" && (
                    <button
                      className="btn btn-success btn-xs"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                  )}

                  {user.status !== "suspended" && (
                    <button
                      className="btn btn-error btn-xs"
                      onClick={() => handleSuspend(user._id)}
                    >
                      Suspend
                    </button>
                  )}

                  {user.role !== "admin" && (
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => makeAdmin(user._id)}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
