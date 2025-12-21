import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { firebaseUser } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseUser) return;

    axios
      .get(`https://garments-server-omega.vercel.app/api/orders/track/${orderId}`, {
        headers: {
          Authorization: `Bearer ${firebaseUser.accessToken}`
        }
      })
      .then(res => setOrder(res.data))
      .catch(() => setError("Failed to load tracking info"))
      .finally(() => setLoading(false));
  }, [orderId, firebaseUser]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!order) return <p className="text-center">Order not found</p>;

  const steps = [...order.trackingSteps].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        📦 Track Order #{order._id}
      </h2>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-4">
          <strong>Current Status:</strong> {order.status}
        </p>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isLatest = index === steps.length - 1;

            return (
              <div
                key={index}
                className={`border-l-4 pl-4 py-3 ${
                  isLatest
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold text-lg">{step.status}</p>

                <p className="text-sm text-gray-500">
                  📍 {step.location}
                </p>

                <p className="text-sm text-gray-500">
                  📅 {new Date(step.date).toLocaleDateString()} •{" "}
                  {new Date(step.date).toLocaleTimeString()}
                </p>

                <p className="text-sm italic">{step.notes}</p>

                {isLatest && (
                  <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                    Latest Update
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
