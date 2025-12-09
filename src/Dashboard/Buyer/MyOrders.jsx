import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const MyOrders = () => {
  const { user } = useAuth(); // Logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/my-orders/${user.uid}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="text-center mt-12">No orders found</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((o) => (
          <div key={o._id} className="p-4 border rounded shadow">
            <p><strong>Order ID:</strong> {o._id}</p>
            <p><strong>Product ID:</strong> {o.productId}</p>
            <p><strong>Quantity:</strong> {o.quantity}</p>
            <p><strong>Price:</strong> ${o.price?.toFixed(2)}</p>
            <p><strong>Status:</strong> {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
