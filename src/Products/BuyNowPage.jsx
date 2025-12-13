import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BuyNowPage = () => {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product; // Product from navigate

  const [loading, setLoading] = useState(false);

  if (!product) return <p>Product not found!</p>;

  const handleBuyNow = async () => {
    if (!firebaseUser) return alert("Please login to buy");

    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.post(
        "http://localhost:5000/api/orders/buy-now",
        {
          productId: product._id,
          productName: product.name,
          quantity: 1,
          orderPrice: product.price,
          address: "Default Address",
          notes: "",
          paymentMethod: "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`Order placed successfully! Order ID: ${res.data.orderId}`);
        navigate("/dashboard/my-orders"); // redirect after success
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Buy Now: {product.name}</h2>
      <p className="mb-4">Price: ${product.price}</p>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default BuyNowPage;
