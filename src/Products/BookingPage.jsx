import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BookingPage = () => {
  const { firebaseUser, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) return <p>Product not found</p>;

  // ❌ Admin / Manager cannot order
  if (userProfile?.role === "admin" || userProfile?.role === "manager") {
    return <p>You are not allowed to place orders.</p>;
  }

  const [quantity, setQuantity] = useState(product.minOrder);
  const [firstName, setFirstName] = useState(userProfile?.name || "");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const orderPrice = quantity * product.price;

  const handleSubmit = async () => {
    if (quantity < product.minOrder) {
      return alert(`Minimum order is ${product.minOrder}`);
    }
    if (quantity > product.availableQuantity) {
      return alert("Quantity exceeds available stock");
    }

    try {
      setLoading(true);
      const token = await firebaseUser.getIdToken();

      const orderData = {
        productId: product._id,
        productName: product.name,
        quantity,
        orderPrice,
        firstName,
        lastName,
        contactNumber,
        address,
        notes,
        paymentMethod: product.paymentOption,
      };

      // 🔹 PAY FIRST (Stripe)
      if (product.paymentOption === "PayFirst") {
        const res = await axios.post(
          "http://localhost:5000/api/orders/create-checkout-session",
          { orderData },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        window.location.href = res.data.url;
        return;
      }

      // 🔹 CASH ON DELIVERY / bKash
      const res = await axios.post(
        "http://localhost:5000/api/orders/buy-now",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Order placed successfully");
        navigate("/dashboard/my-orders");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

      <p className="text-sm mb-2">
        Payment Method: <strong>{product.paymentOption}</strong>
      </p>

      <input value={userProfile.email} readOnly className="input w-full" />

      <input value={product.name} readOnly className="input w-full mt-2" />

      <input
        type="number"
        min={product.minOrder}
        max={product.availableQuantity}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="input w-full mt-2"
      />

      <input
        value={`Total Price: $${orderPrice}`}
        readOnly
        className="input w-full mt-2"
      />

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="input w-full mt-2"
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="input w-full mt-2"
      />

      <input
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        className="input w-full mt-2"
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input w-full mt-2"
      />

      <textarea
        placeholder="Additional Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="input w-full mt-2"
      />

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded"
      >
        {loading
          ? "Processing..."
          : product.paymentOption === "PayFirst"
          ? "Proceed to Payment"
          : "Confirm Order"}
      </button>
    </div>
  );
};

export default BookingPage;
