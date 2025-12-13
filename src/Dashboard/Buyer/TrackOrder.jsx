// src/pages/dashboard/TrackOrder.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const TrackOrder = () => {
  const { orderId } = useParams();
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axiosSecure.get(
          `/api/orders/track/${orderId}`
        );

        // sort steps by date + time (chronological)
        const sortedSteps = (data.trackingSteps || []).sort(
          (a, b) =>
            new Date(`${a.date} ${a.time}`) -
            new Date(`${b.date} ${b.time}`)
        );

        setOrder({ ...data, trackingSteps: sortedSteps });
      } catch (error) {
        toast.error("Failed to load tracking info");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, axiosSecure]);

  if (loading) {
    return <p className="text-center mt-10">Loading tracking info...</p>;
  }

  if (!order) {
    return <p className="text-center mt-10">Order not found</p>;
  }

  const lastIndex = order.trackingSteps.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">
        Track Order #{order._id}
      </h2>

      <p className="mb-6 text-gray-600">
        Product: <span className="font-medium">{order.productTitle}</span>
      </p>

      {/* ===== Timeline ===== */}
      <div className="relative border-l-2 border-gray-300 pl-6">
        {order.trackingSteps.map((step, index) => {
          const isLatest = index === lastIndex;

          return (
            <div key={index} className="mb-8 relative">
              {/* Dot */}
              <span
                className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full 
                ${
                  isLatest
                    ? "bg-green-600 ring-4 ring-green-200"
                    : "bg-gray-400"
                }`}
              ></span>

              {/* Content */}
              <div
                className={`p-4 rounded-md shadow 
                ${
                  isLatest
                    ? "border border-green-500 bg-green-50"
                    : "bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold">
                  {step.status}
                </h3>

                <p className="text-sm text-gray-500">
                  📅 {step.date} ⏰ {step.time}
                </p>

                <p className="text-sm mt-1">
                  📍 Location:{" "}
                  <span className="font-medium">{step.location}</span>
                </p>

                {step.notes && (
                  <p className="text-sm mt-2 text-gray-700">
                    📝 {step.notes}
                  </p>
                )}

                {step.image && (
                  <img
                    src={step.image}
                    alt="tracking"
                    className="mt-3 w-40 rounded"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Current Location ===== */}
      {order.currentLocation && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-300 rounded">
          <h4 className="font-semibold mb-1">📍 Current Location</h4>
          <p>{order.currentLocation}</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
