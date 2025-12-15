import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BookingPage = () => {
  const { firebaseUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [firstName, setFirstName] = useState(userProfile?.name || "");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return <p>Product not found!</p>;
  if (!firebaseUser) return <p>Please login to continue.</p>;

  const handleSubmit = async () => {
    if (quantity < product.minOrder) return alert(`Minimum order is ${product.minOrder}`);
    if (quantity > product.availableQuantity) return alert(`Maximum available is ${product.availableQuantity}`);

    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.post(
        "http://localhost:5000/api/orders/book",
        {
          productId: product._id,
          productName: product.name,
          quantity,
          orderPrice: product.price * quantity,
          firstName,
          lastName,
          contact,
          address,
          notes,
          paymentMethod: product.paymentOption || "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`Booking successful! Order ID: ${res.data.orderId}`);
        navigate("/dashboard/my-orders");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to place booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Book: {product.name}</h2>

      <div className="mb-2">
        <label className="block">Quantity:</label>
        <input
          type="number"
          value={quantity}
          min={product.minOrder}
          max={product.availableQuantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block">First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block">Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block">Contact Number:</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block">Delivery Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block">Additional Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default BookingPage;
