// BuyNowPage.jsx (bKash এবং PayFirst/Stripe সমর্থন করার জন্য সংশোধিত কোড)

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Swal from 'sweetalert2';

const API_BASE_URL = "https://garments-server-omega.vercel.app/api/orders";

const BuyNowPage = () => {
    const { firebaseUser, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const product = location.state?.product;

    // স্টেট ইনিশিয়ালাইজেশন
    const [quantity, setQuantity] = useState(product?.minimumOrder || 1);
    const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || "");
    const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') || "");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ নতুন স্টেট: পেমেন্ট মেথড এখন ব্যবহারকারী নির্বাচন করবে
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
        product?.paymentOption === 'PayFirst' ? "PayFirst" : "Cash on Delivery"
    );
    // ✅ বিকাশ ইনপুটের জন্য নতুন স্টেট
    const [bKashTxnId, setBKashTxnId] = useState("");
    const [bKashNumber, setBKashNumber] = useState("");


    // প্রাথমিক রিকোয়ারমেন্ট চেক
    if (!product) return <p className="text-red-500 container mx-auto px-6 py-12">Product not found! Please select a product from the All Products page.</p>;
    if (!firebaseUser) return <p className="text-red-500 container mx-auto px-6 py-12">Please login to continue.</p>;

    const orderPrice = product.price * quantity;


    // Quantity হ্যান্ডলার (কোনো পরিবর্তন নেই, এটি ঠিক আছে)
    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
        if (newQuantity < product.minimumOrder) {
            Swal.fire({ icon: 'error', title: 'Invalid Quantity', text: `Order quantity cannot be less than Minimum Order Quantity (${product.minimumOrder})` });
            setQuantity(product.minimumOrder);
            return;
        }
        if (newQuantity > product.availableQuantity) {
            Swal.fire({ icon: 'error', title: 'Invalid Quantity', text: `Order quantity cannot be larger than Available Quantity (${product.availableQuantity})` });
            setQuantity(product.availableQuantity);
            return;
        }
        setQuantity(newQuantity);
    };

    // COD/bKash অর্ডার প্লেস করার ফাংশন
    const handlePlaceOrder = async (orderData) => {
        const token = await firebaseUser.getIdToken();
        try {
            const res = await axios.post(
                `${API_BASE_URL}/buy-now`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: `Order ID: ${res.data.orderId}. Your order is pending approval.`,
                    confirmButtonText: 'Go to My Orders'
                }).then(() => {
                    navigate("/dashboard/my-orders");
                });
            }
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Failed to place order";
            throw new Error(errorMessage);
        }
    }

    const handleBuyNow = async (e) => {
        e.preventDefault();
        setLoading(true);

        // ক্লায়েন্ট সাইড ভ্যালিডেশন
        if (!firstName || !lastName || !address || !contactNumber || quantity < product.minimumOrder || quantity > product.availableQuantity) {
            Swal.fire({ icon: 'error', title: 'Validation Failed', text: 'Please fill out all required fields and ensure quantity is valid.' });
            setLoading(false);
            return;
        }

        // ✅ বিকাশ ভ্যালিডেশন
        if (selectedPaymentMethod === "bKash" && (!bKashTxnId || !bKashNumber)) {
            Swal.fire({ icon: 'error', title: 'Validation Failed', text: 'Please enter bKash Transaction ID and Mobile Number.' });
            setLoading(false);
            return;
        }

        try {
            const token = await firebaseUser.getIdToken();

            // অর্ডার ডেটা তৈরি
            const orderData = {
                productId: product._id,
                productName: product.name,
                quantity,
                orderPrice: orderPrice.toFixed(2),
                firstName,
                lastName,
                contactNumber,
                address,
                // ✅ notes ফিল্ডে bKash তথ্য যোগ করা হলো
                sellerEmail: product.managerEmail || product.addedBy?.email,

                notes: selectedPaymentMethod === "bKash"
                    ? `bKash Info: Number - ${bKashNumber}, Txn ID - ${bKashTxnId}. Additional notes: ${notes || ""}`
                    : notes,

                paymentMethod: selectedPaymentMethod,
            };

            // 🎯 STEP 1: PayFirst (Online Payment via Stripe)
            if (selectedPaymentMethod === "PayFirst") {
                Swal.fire({ title: 'Redirecting...', text: 'You will be redirected to the payment gateway.', timer: 1500, timerProgressBar: true, showConfirmButton: false });

                const paymentRes = await axios.post(
                    `${API_BASE_URL}/create-checkout-session`,
                    { orderData: { ...orderData, sellerEmail: orderData.sellerEmail } },
                    { headers: { Authorization: `Bearer ${token}` } }
                );


                if (paymentRes.data.url) {
                    window.location.href = paymentRes.data.url;
                } else {
                    throw new Error("Failed to get payment URL.");
                }
            }
            // 🎯 STEP 2: Cash on Delivery (COD) বা bKash - সরাসরি অর্ডার প্লেস
            else if (selectedPaymentMethod === "Cash on Delivery" || selectedPaymentMethod === "bKash") {
                await handlePlaceOrder(orderData);
            }
            else {
                throw new Error("Invalid payment method selected.");
            }

        } catch (err) {
            console.error(err);
            const errorMessage = err.message || err.response?.data?.error || "An unknown error occurred.";
            Swal.fire({ icon: 'error', title: 'Order Failed', text: errorMessage });
        } finally {
            if (selectedPaymentMethod !== "PayFirst") {
                setLoading(false);
            }
        }
    };

    // UI কোড
    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Complete Your Order: {product.name}</h2>

            <form onSubmit={handleBuyNow} className="bg-amber-400 text-black shadow-lg rounded-lg p-6 space-y-4">

                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-2">Buyer Information</h3>
                    <p><strong>Email:</strong> {firebaseUser.email} (Read-Only)</p>
                    <p><strong>Name:</strong> {user?.name || 'Loading...'}</p>
                </div>

                {/* Product Details */}
                <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-2">Product Details</h3>
                    <p><strong>Product Title:</strong> {product.name} (Read-Only)</p>
                    <p><strong>Unit Price:</strong> ${product.price} (Read-Only)</p>
                    <p><strong>Min. Order:</strong> {product.minimumOrder}</p>
                    <p><strong>Available:</strong> {product.availableQuantity}</p>

                    <p className={`font-bold mt-2 ${selectedPaymentMethod === 'PayFirst' ? 'text-green-600' : selectedPaymentMethod === 'bKash' ? 'text-pink-600' : 'text-orange-600'}`}>
                        Current Payment Method: {selectedPaymentMethod}
                    </p>
                </div>

                {/* --------------------- পেমেন্ট মেথড সিলেক্ট করার সেকশন --------------------- */}
                <div className="bg-white p-4 rounded-md border border-gray-300">
                    <h3 className="text-xl font-semibold mb-3">Select Payment Method</h3>
                    <div className="flex flex-wrap gap-4">

                        {/* 1. PayFirst (Stripe) */}
                        {product.paymentOption === 'PayFirst' && (
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="PayFirst"
                                    checked={selectedPaymentMethod === "PayFirst"}
                                    onChange={() => setSelectedPaymentMethod("PayFirst")}
                                    className="form-radio text-green-600 h-4 w-4"
                                />
                                <span>PayFirst (Credit/Debit Card)</span>
                            </label>
                        )}

                        {/* 2. Cash on Delivery */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="payment_method"
                                value="Cash on Delivery"
                                checked={selectedPaymentMethod === "Cash on Delivery"}
                                onChange={() => setSelectedPaymentMethod("Cash on Delivery")}
                                className="form-radio text-orange-600 h-4 w-4"
                            />
                            <span>Cash on Delivery (COD)</span>
                        </label>

                        {/* 3. bKash */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="payment_method"
                                value="bKash"
                                checked={selectedPaymentMethod === "bKash"}
                                onChange={() => setSelectedPaymentMethod("bKash")}
                                className="form-radio text-pink-600 h-4 w-4"
                            />
                            <span className="font-bold text-pink-700">bKash (Mobile Payment)</span>
                        </label>
                    </div>

                    {/* ✅ বিকাশ ইনপুট ফিল্ড (যদি বিকাশ সিলেক্ট করা থাকে) */}
                    {selectedPaymentMethod === "bKash" && (
                        <div className="mt-4 p-3 border border-pink-300 rounded-md bg-pink-50 space-y-3">
                            <p className="font-semibold text-pink-700">Please send **${orderPrice.toFixed(2)}** to our bKash merchant number (e.g., **01XXXXXXXXX**)</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your bKash Mobile Number:</label>
                                <input
                                    type="text"
                                    value={bKashNumber}
                                    onChange={(e) => setBKashNumber(e.target.value)}
                                    className="border border-pink-300 p-3 rounded-lg w-full focus:ring-pink-500 focus:border-pink-500 transition duration-150"
                                    placeholder="e.g. 01XXXXXXXXX"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">bKash Transaction ID (TrxID):</label>
                                <input
                                    type="text"
                                    value={bKashTxnId}
                                    onChange={(e) => setBKashTxnId(e.target.value)}
                                    className="border border-pink-300 p-3 rounded-lg w-full focus:ring-pink-500 focus:border-pink-500 transition duration-150"
                                    placeholder="e.g. 8C0Y3L5A"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* -------------------------------------------------------------------------- */}

                {/* First Name এবং Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            required
                        />
                    </div>
                </div>

                {/* Order Form Fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        min={product.minimumOrder}
                        max={product.availableQuantity}
                        onChange={handleQuantityChange}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Order must be between {product.minimumOrder} and {product.availableQuantity}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number:</label>
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Order Price (Auto-Calculated):</label>
                        <input
                            type="text"
                            value={`$${orderPrice.toFixed(2)}`}
                            readOnly
                            className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 font-semibold"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address:</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes / Instructions (excluding bKash info):</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        rows="2"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        quantity < product.minimumOrder ||
                        quantity > product.availableQuantity ||
                        !firstName ||
                        !lastName ||
                        !address ||
                        !contactNumber ||
                        // বিকাশ সিলেক্ট করা থাকলে, তার ফিল্ডগুলোও চেক করতে হবে
                        (selectedPaymentMethod === "bKash" && (!bKashTxnId || !bKashNumber))
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : `Confirm Order - $${orderPrice.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};

export default BuyNowPage;
