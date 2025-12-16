import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:5000/api/orders"; 
// 🚨 আপনার বক্যাশ মার্চেন্ট নম্বরটি এখানে দিন
const BKASH_MERCHANT_NUMBER = "017XXXXXXXX"; 

const BookingPage = () => {
    const { firebaseUser, userProfile, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    // --- প্রাথমিক ভ্যালিডেশন ---
    if (loading) return <p className="text-center mt-10">Loading user data...</p>;
    if (!firebaseUser) return <p className="text-center mt-10">Please login first</p>;
    if (!product) return <p className="text-center mt-10">Product not found</p>;

    if (userProfile?.role === "admin" || userProfile?.role === "manager") {
        return <p className="text-center mt-10">You are not allowed to place orders.</p>;
    }

    // --- স্টেট ইনিশিয়ালাইজেশন ---
    const [quantity, setQuantity] = useState(product.minOrder || 1);
    const [firstName, setFirstName] = useState(userProfile?.name?.split(' ')[0] || "");
    const [lastName, setLastName] = useState(userProfile?.name?.split(' ').slice(1).join(' ') || "");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ✅ নতুন স্টেট: ইউজার সিলেক্টেড পেমেন্ট মেথড
    const initialPaymentMethod = product.paymentOption === 'PayFirst' ? "PayFirst" : "Cash on Delivery";
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialPaymentMethod);
    
    // ✅ নতুন স্টেট: বিকাশ ইনপুট
    const [bKashTxnId, setBKashTxnId] = useState("");
    const [bKashNumber, setBKashNumber] = useState("");

    const orderPrice = quantity * product.price;

    // --- ফর্ম সাবমিট হ্যান্ডলার ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (quantity < product.minOrder) return Swal.fire({ icon: 'error', title: 'Error', text: `Minimum order is ${product.minOrder}` });
        if (quantity > product.availableQuantity) return Swal.fire({ icon: 'error', title: 'Error', text: "Quantity exceeds available stock" });
        if (selectedPaymentMethod === "bKash" && (!bKashTxnId || !bKashNumber)) return Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter bKash Transaction ID and Mobile Number.' });


        try {
            setSubmitting(true);
            const token = await firebaseUser.getIdToken();

            // ✅ বক্যাশ নোট হ্যান্ডলিং লজিক
            const finalNotes = selectedPaymentMethod === "bKash" 
                ? `bKash Info: Number - ${bKashNumber}, Trx ID - ${bKashTxnId}. Additional notes: ${notes || ""}` 
                : notes;

            const orderData = {
                productId: product._id,
                productName: product.name,
                quantity,
                orderPrice: orderPrice.toFixed(2), // টু-ফিক্সড ব্যবহার করা হলো
                firstName,
                lastName,
                contactNumber,
                address,
                notes: finalNotes, // ✅ সংশোধিত নোট
                paymentMethod: selectedPaymentMethod, // ✅ ইউজার সিলেক্টেড মেথড
            };

            // 🔹 PAY FIRST (Stripe/Online Payment)
            if (selectedPaymentMethod === "PayFirst") {
                Swal.fire({ title: 'Redirecting...', text: 'You will be redirected to the secure payment page.', timer: 1500, timerProgressBar: true, showConfirmButton: false });
                
                const res = await axios.post(
                    `${API_BASE_URL}/create-checkout-session`,
                    { orderData },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                window.location.href = res.data.url;
                return; // রিডাইরেক্ট করা হয়েছে, তাই এখানেই শেষ
            }

            // 🔹 COD / bKash (Manual Order Placement)
            const res = await axios.post(
                `${API_BASE_URL}/buy-now`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: `Order ID: ${res.data.orderId}. Your order is pending verification.`,
                });
                navigate("/dashboard/my-orders");
            }
        } catch (err) {
            console.error("Order failed:", err);
            const errorMessage = err.response?.data?.error || "Order failed";
            Swal.fire({ icon: 'error', title: 'Order Failed', text: errorMessage });
        } finally {
            // PayFirst এর ক্ষেত্রে যেহেতু রিডাইরেক্ট হয়, তাই এখানে সেট করার দরকার নেই।
            if (selectedPaymentMethod !== "PayFirst") {
                setSubmitting(false);
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6  shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Complete Your Booking: {product.name}</h2>
            
            <form onSubmit={handleSubmit}>

                {/* --- Input Fields --- */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        value={userProfile?.email || firebaseUser?.email || ""}
                        readOnly
                        className="p-3 border rounded bg-gray-100 text-gray-600"
                    />
                    <input 
                        value={product.name} 
                        readOnly 
                        className="p-3 border rounded bg-gray-100 text-gray-600" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity (Min: {product.minOrder}, Max: {product.availableQuantity})</label>
                        <input
                            type="number"
                            min={product.minOrder}
                            max={product.availableQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="p-3 border rounded w-full mt-1"
                        />
                    </div>
                    {/* Total Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Price</label>
                        <input
                            value={`$${orderPrice.toFixed(2)}`}
                            readOnly
                            className="p-3 border rounded w-full mt-1 font-bold text-indigo-600 bg-indigo-50"
                        />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="p-3 border rounded w-full"
                        required
                    />
                    <input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="p-3 border rounded w-full"
                        required
                    />
                </div>

                <input
                    placeholder="Contact Number (Required)"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="p-3 border rounded w-full mt-4"
                    required
                />

                <textarea
                    placeholder="Delivery Address (Required)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-3 border rounded w-full mt-4"
                    rows="3"
                    required
                />

                <textarea
                    placeholder="Additional Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-3 border rounded w-full mt-4"
                    rows="2"
                />

                {/* --- Payment Method Selection --- */}
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="font-semibold mb-3">Choose Payment Method</h3>
                    
                    <div className="space-y-3">
                        {/* Option 1: PayFirst (Stripe) */}
                        {product.paymentOption === "PayFirst" && (
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="payment_option"
                                    value="PayFirst"
                                    checked={selectedPaymentMethod === "PayFirst"}
                                    onChange={() => setSelectedPaymentMethod("PayFirst")}
                                    className="form-radio text-green-600 h-5 w-5"
                                />
                                <span className="font-medium text-green-700">PayFirst (Credit/Debit Card)</span>
                            </label>
                        )}

                        {/* Option 2: Cash on Delivery */}
                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="payment_option"
                                value="Cash on Delivery"
                                checked={selectedPaymentMethod === "Cash on Delivery"}
                                onChange={() => setSelectedPaymentMethod("Cash on Delivery")}
                                className="form-radio text-orange-600 h-5 w-5"
                            />
                            <span className="font-medium text-orange-700">Cash on Delivery (COD)</span>
                        </label>

                        {/* Option 3: bKash */}
                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="payment_option"
                                value="bKash"
                                checked={selectedPaymentMethod === "bKash"}
                                onChange={() => setSelectedPaymentMethod("bKash")}
                                className="form-radio text-pink-600 h-5 w-5"
                            />
                            <span className="font-medium text-pink-700">bKash (Manual Transfer)</span>
                        </label>
                    </div>

                    {/* ✅ বক্যাশ ইনপুট ফিল্ড (শর্তাধীন) */}
                    {selectedPaymentMethod === "bKash" && (
                        <div className="mt-4 p-4 border border-pink-400 rounded-lg bg-pink-100/50 space-y-3">
                            <p className="font-semibold text-pink-800 text-sm">
                                🚨 Please send **${orderPrice.toFixed(2)}** to our bKash merchant number: **{BKASH_MERCHANT_NUMBER}**
                            </p>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your bKash Mobile Number:</label>
                                <input
                                    type="text"
                                    value={bKashNumber}
                                    onChange={(e) => setBKashNumber(e.target.value)}
                                    className="border border-pink-300 p-2 rounded-lg w-full"
                                    placeholder="01XXXXXXXXX"
                                    required={selectedPaymentMethod === "bKash"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">bKash Transaction ID (TrxID):</label>
                                <input
                                    type="text"
                                    value={bKashTxnId}
                                    onChange={(e) => setBKashTxnId(e.target.value)}
                                    className="border border-pink-300 p-2 rounded-lg w-full"
                                    placeholder="Trx ID"
                                    required={selectedPaymentMethod === "bKash"}
                                />
                            </div>
                        </div>
                    )}
                </div>


                {/* --- Submit Button --- */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting
                        ? "Processing..."
                        : selectedPaymentMethod === "PayFirst"
                        ? `Proceed to Pay $${orderPrice.toFixed(2)}`
                        : `Confirm Order (${selectedPaymentMethod})`}
                </button>
            </form>
        </div>
    );
};

export default BookingPage;