// PaymentSuccessPage.jsx (সংশোধিত কোড)

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Swal from 'sweetalert2';

// ✅ আপনার API Base URL সেট করুন
const API_BASE_URL = "http://localhost:5000/api/orders";

const PaymentSuccessPage = () => {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [error, setError] = useState(null);

  // ✅ URL query parameters থেকে sessionId নেওয়া
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  useEffect(() => {
    // 1. If not logged in or no session_id, redirect
    if (!firebaseUser || !sessionId) {
      if (!sessionId) {
        navigate("/dashboard/my-orders", { replace: true });
      }
      return;
    }

    const processPayment = async () => {
      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();

        // 2. Send session_id to backend for final order processing
        const res = await axios.post(
          `${API_BASE_URL}/payment-success`, // আপনার ব্যাকএন্ড রুট
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setOrderId(res.data.orderId);
          // ✅ এখন সার্ভার থেকে orderPrice আসছে
          setAmount(res.data.orderPrice);

          Swal.fire({
            icon: 'success',
            title: 'Payment Confirmed!',
            text: `Your order (ID: ${res.data.orderId}) has been successfully placed.`,
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          setError(res.data.error || "Order finalization failed.");
        }
      } catch (err) {
        console.error("Payment Success Error:", err);
        setError(err.response?.data?.error || "Could not verify payment session. Please check your network and server logs.");
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: 'There was an issue confirming your payment. Please check My Orders.',
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [firebaseUser, sessionId, navigate]);

  // Loading State UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-700">Verifying payment and placing order...</p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Verification Failed!</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  // Success State UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-700 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-700 mb-2">
          <strong>Order ID:</strong> {orderId || 'N/A'}
        </p>
        {amount && (
          <p className="text-gray-700 mb-4">
            <strong>Amount Paid:</strong> ${Number(amount).toFixed(2)}
          </p>
        )}
        <button
          onClick={() => navigate("/dashboard/my-orders")}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold transition duration-200"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 ml-3 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-semibold transition duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;