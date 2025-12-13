import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AdminAllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Orders (Admin)</h2>

      <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.email}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>${order.orderPrice}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "Approved"
                        ? "badge-success"
                        : order.status === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllOrders;
