import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";

const Profile = () => {
  const { firebaseUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/users/${firebaseUser?.uid}`);
        setUser(data);
      } catch (error) {
        toast.error("Failed to fetch profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [firebaseUser]);

  if (loading) return <LoadingSpinner />;

  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">
        User not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.reload();
          }}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
