import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AdminAllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/api/orders"); // token auto attach হচ্ছে
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Orders load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders (Admin)</h2>
      <table className="table w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.email}</td>
              <td>{o.productName}</td>
              <td>{o.quantity}</td>
              <td>${o.orderPrice}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-6">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllOrders;
