import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only pending orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/orders/manager/pending-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/api/orders/update-status/${id}`, {
        status: "Approved",
      });
      toast.success("Order Approved");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Approve Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/api/orders/update-status/${id}`, {
        status: "Rejected",
      });
      toast.success("Order Rejected");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Reject Failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 Custom Loading Spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Pending Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border rounded-lg shadow-md bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-gray-800">#</th>
              <th className="px-4 py-2 text-gray-800">Email</th>
              <th className="px-4 py-2 text-gray-800">Product</th>
              <th className="px-4 py-2 text-gray-800">Qty</th>
              <th className="px-4 py-2 text-gray-800">Total</th>
              <th className="px-4 py-2 text-gray-800">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No pending orders
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-700">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {order.email}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {order.productName}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {order.quantity}
                  </td>
                  <td className="px-4 py-2 text-green-700 font-semibold">
                    ${order.orderPrice}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleApprove(order._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(order._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrders;
