import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/manager/pending-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await axiosSecure.patch(`/api/manager/orders/${orderId}/approve`);
      toast.success("Order approved!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Approve failed");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axiosSecure.patch(`/api/manager/orders/${orderId}/reject`);
      toast.success("Order rejected!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Reject failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No pending orders
                </td>
              </tr>
            )}
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.email}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>${order.orderPrice}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(order._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleReject(order._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrders;
