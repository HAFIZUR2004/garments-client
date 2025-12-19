import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const API_BASE_URL = "http://localhost:5000/api/orders";
const BKASH_MERCHANT_NUMBER = "017XXXXXXXX";

const BookingPage = () => {
  const { firebaseUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  // ✅ suspended status
  const { isSuspended } = useUserRole(firebaseUser?.email);

  /* ---------- Guards ---------- */
  if (loading) return <p className="text-center mt-10">Loading user data...</p>;
  if (!firebaseUser) return <p className="text-center mt-10">Please login first</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  if (userProfile?.role === "admin" || userProfile?.role === "manager") {
    return <p className="text-center mt-10">You are not allowed to place orders.</p>;
  }

  /* ---------- State ---------- */
  const [quantity, setQuantity] = useState(product.minOrder || 1);
  const [firstName, setFirstName] = useState(userProfile?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    userProfile?.name?.split(" ").slice(1).join(" ") || ""
  );
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const initialPaymentMethod =
    product.paymentOption === "PayFirst" ? "PayFirst" : "Cash on Delivery";
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState(initialPaymentMethod);

  const [bKashTxnId, setBKashTxnId] = useState("");
  const [bKashNumber, setBKashNumber] = useState("");

  const orderPrice = quantity * product.price;

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 suspended check
    if (isSuspended) {
      return Swal.fire({
        icon: "error",
        title: "Account Suspended",
        text: "Your account is suspended. You cannot place orders.",
      });
    }

    if (quantity < product.minOrder) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: `Minimum order is ${product.minOrder}`,
      });
    }

    if (quantity > product.availableQuantity) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Quantity exceeds available stock",
      });
    }

    if (
      selectedPaymentMethod === "bKash" &&
      (!bKashTxnId || !bKashNumber)
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter bKash number & transaction ID",
      });
    }

    try {
      setSubmitting(true);
      const token = await firebaseUser.getIdToken();

      const finalNotes =
        selectedPaymentMethod === "bKash"
          ? `bKash Number: ${bKashNumber}, TrxID: ${bKashTxnId}. ${notes || ""}`
          : notes;

      const orderData = {
        productId: product._id,
        productName: product.name,
        quantity,
        orderPrice: orderPrice.toFixed(2),
        firstName,
        lastName,
        contactNumber,
        address,
        sellerEmail: product.sellerEmail || product.managerEmail,
        notes: finalNotes,
        paymentMethod: selectedPaymentMethod,
      };

      // 🔹 Pay First
      if (selectedPaymentMethod === "PayFirst") {
        const res = await axios.post(
          `${API_BASE_URL}/create-checkout-session`,
          { orderData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = res.data.url;
        return;
      }

      // 🔹 COD / bKash
      const res = await axios.post(
        `${API_BASE_URL}/buy-now`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: `Order ID: ${res.data.orderId}`,
        });
        navigate("/dashboard/my-orders");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      if (selectedPaymentMethod !== "PayFirst") {
        setSubmitting(false);
      }
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        Complete Your Booking: {product.name}
      </h2>

      {/* 🚫 Suspended Warning */}
      {isSuspended && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
          🚫 Your account is suspended. You cannot place any orders.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={firebaseUser.email}
          readOnly
          className="p-3 border rounded w-full bg-gray-100 mb-3"
        />

        <input
          type="number"
          min={product.minOrder}
          max={product.availableQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="p-3 border rounded w-full mb-3"
        />

        <input
          value={`$${orderPrice.toFixed(2)}`}
          readOnly
          className="p-3 border rounded w-full mb-3 bg-indigo-50 font-bold"
        />

        <input
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="p-3 border rounded w-full mb-3"
          required
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="p-3 border rounded w-full mb-3"
          required
        />

        <button
          type="submit"
          disabled={isSuspended || submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSuspended
            ? "Account Suspended"
            : submitting
            ? "Processing..."
            : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
