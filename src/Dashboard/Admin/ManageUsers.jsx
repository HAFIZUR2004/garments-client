import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  // ✅ Approve User
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/status`, {
        status: "active",
      });
      Swal.fire("Approved!", "User approved successfully", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to approve user", "error");
    }
  };

  // ✅ Suspend User with Reason
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
        console.error(err);
        Swal.fire("Error", "Failed to suspend user", "error");
      }
    }
  };

  // ✅ Role Change (Dropdown)
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, {
        role: newRole,
      });
      Swal.fire("Updated!", "User role updated", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // ✅ Make Admin Button (status stays pending)
  const makeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, {
        role: "admin",
      });
      Swal.fire("Success!", "User is now Admin (status pending)", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

      {/* 🔍 Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="table w-full text-center">
          <thead className="bg-gray-200 text-gray-800">
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
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="text-black">{index + 1}</td>

                {/* Name */}
                <td className="font-semibold text-black">
                  {user.name || "No Name"}
                </td>

                {/* Email */}
                <td className="text-black">{user.email || "No Email"}</td>

                {/* Role Dropdown */}
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="select select-bordered select-sm text-white"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`badge px-4 py-2 text-white ${
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

                {/* Actions */}
                <td className="flex justify-center gap-2 py-2">
                  {user.status === "pending" && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                  )}

                  {user.status !== "suspended" && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleSuspend(user._id)}
                    >
                      Suspend
                    </button>
                  )}

                  {user.role !== "admin" && (
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => makeAdmin(user._id)}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
