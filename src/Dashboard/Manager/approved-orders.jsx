import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch approved orders
  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/orders/manager/approved-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load approved orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  // 🔥 Custom Loading Spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Approved Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border rounded-lg shadow-md bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-gray-800">#</th>
              <th className="px-4 py-2 text-gray-800">Seller Email</th>
              <th className="px-4 py-2 text-gray-800">Product</th>
              <th className="px-4 py-2 text-gray-800">Qty</th>
              <th className="px-4 py-2 text-gray-800">Total</th>
              <th className="px-4 py-2 text-gray-800">Approved At</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No approved orders
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
                    {order.sellerEmail}
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
                  <td className="px-4 py-2 text-gray-700">
                    {order.approvedAt
                      ? new Date(order.approvedAt).toLocaleString()
                      : "N/A"}
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

export default ApprovedOrders;
