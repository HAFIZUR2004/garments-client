// pages/manager/ApprovedOrders.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/manager/approved-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to load approved orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approved Orders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Approved At</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No approved orders
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
                <td>{new Date(order.approvedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedOrders;
