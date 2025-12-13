import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AdminTrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingSteps, setTrackingSteps] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axiosSecure.get(`/api/orders/my-orders/${orderId}`);
        setOrder(data);
        setTrackingSteps(data.trackingSteps || []);
        setCurrentLocation(data.currentLocation || "");
      } catch (err) {
        toast.error("Failed to fetch order!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const addStep = () => {
    setTrackingSteps([...trackingSteps, { title: "", date: "", time: "", location: "", notes: "" }]);
  };

  const updateStep = (idx, key, value) => {
    const updated = [...trackingSteps];
    updated[idx][key] = value;
    setTrackingSteps(updated);
  };

  const removeStep = (idx) => {
    const updated = [...trackingSteps];
    updated.splice(idx, 1);
    setTrackingSteps(updated);
  };

  const saveSteps = async () => {
    try {
      await axiosSecure.patch(`/api/orders/track/${orderId}`, {
        trackingSteps,
        currentLocation,
      });
      toast.success("Tracking updated!");
    } catch (err) {
      toast.error("Failed to update tracking!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Track Order #{orderId}</h2>

      <div className="mb-4">
        <label className="font-semibold">Current Location:</label>
        <input
          type="text"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <h3 className="text-xl font-bold mb-2">Tracking Steps</h3>
      {trackingSteps.map((step, idx) => (
        <div key={idx} className="border p-3 mb-2 rounded">
          <input
            type="text"
            placeholder="Title"
            value={step.title}
            onChange={(e) => updateStep(idx, "title", e.target.value)}
            className="border p-1 w-full mb-1"
          />
          <input
            type="date"
            value={step.date}
            onChange={(e) => updateStep(idx, "date", e.target.value)}
            className="border p-1 w-full mb-1"
          />
          <input
            type="time"
            value={step.time}
            onChange={(e) => updateStep(idx, "time", e.target.value)}
            className="border p-1 w-full mb-1"
          />
          <input
            type="text"
            placeholder="Location"
            value={step.location}
            onChange={(e) => updateStep(idx, "location", e.target.value)}
            className="border p-1 w-full mb-1"
          />
          <input
            type="text"
            placeholder="Notes"
            value={step.notes}
            onChange={(e) => updateStep(idx, "notes", e.target.value)}
            className="border p-1 w-full mb-1"
          />
          <button onClick={() => removeStep(idx)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        </div>
      ))}

      <button onClick={addStep} className="bg-blue-500 text-white px-3 py-1 rounded mb-4">Add Step</button>
      <br />
      <button onClick={saveSteps} className="bg-green-500 text-white px-4 py-2 rounded">Save Tracking</button>
    </div>
  );
};

export default AdminTrackOrder;
