import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import ConfirmModal from "../../components/orders/ConfirmModal";
import OrderTimeline from "../../components/orders/OrderTimeline";

const MyOrders = () => {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!firebaseUser) return;
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders/${firebaseUser.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [firebaseUser]);

  const cancelOrder = async () => {
    if (!cancelId) return;

    try {
      const token = await firebaseUser.getIdToken();
      await axios.patch(
        `http://localhost:5000/api/orders/cancel/${cancelId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCancelId(null);
      fetchOrders();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!orders.length) return <p className="text-center mt-10">No orders found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Payment</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="border p-2">{o._id}</td>
              <td className="border p-2">{o.productName}</td>
              <td className="border p-2">{o.quantity}</td>
              <td className="border p-2">{o.status}</td>
              <td className="border p-2">COD</td>
              <td className="border p-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => setSelectedOrder(o)}
                >
                  View
                </button>
                {o.status === "Pending" && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => setCancelId(o._id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderTimeline order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {cancelId && (
        <ConfirmModal onConfirm={cancelOrder} onCancel={() => setCancelId(null)} />
      )}
    </div>
  );
};

export default MyOrders;
