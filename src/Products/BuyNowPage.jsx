import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
// Toast/SweetAlert ব্যবহার করতে পারেন
import Swal from 'sweetalert2'; 

const BuyNowPage = () => {
  const { firebaseUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // এখানে Product Details Page থেকে Order Form-এর ডেটা আসতে পারে, তাই state থেকে product ডেটা নিচ্ছি
  const product = location.state?.product; 

  const [quantity, setQuantity] = useState(product?.minimumOrder || 1); // minOrder-এর বদলে minimumOrder ব্যবহার করছি
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("Default Delivery Address"); // ফর্মে Address ফিল্ড নেই, তাই ডামি অ্যাড্রেস ব্যবহার করছি
  const [contactNumber, setContactNumber] = useState("01XXXXXXXXX"); // ফর্মে Contact Number ফিল্ড নেই
  const [notes, setNotes] = useState(""); // ফর্মে Notes ফিল্ড নেই

  if (!product) return <p className="text-red-500">Product not found! Please select a product from the All Products page.</p>;
  if (!firebaseUser) return <p>Please login to continue.</p>;
  
  // অর্ডার প্রাইস অটো-ক্যালকুলেশন
  const orderPrice = product.price * quantity;

  // ফর্মে Quantity পরিবর্তন করার হ্যান্ডলার
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


  const handlePlaceOrder = async (orderData) => {
      const token = await firebaseUser.getIdToken();
      
      const res = await axios.post(
          "http://localhost:5000/api/orders/buy-now",
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
      return res.data; // যদি কোনো অতিরিক্ত ডেটা লাগে
  }

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      if (quantity < product.minimumOrder) return Swal.fire({ icon: 'error', title: 'Error', text: `Minimum order is ${product.minimumOrder}` });
      if (quantity > product.availableQuantity) return Swal.fire({ icon: 'error', title: 'Error', text: `Maximum available is ${product.availableQuantity}` });
      
      const token = await firebaseUser.getIdToken();
      const paymentMethod = product.paymentOption || "Cash on Delivery"; // 'COD' এর বদলে 'Cash on Delivery' ব্যবহার করা হলো 

      const orderData = {
          productId: product._id,
          productName: product.name,
          quantity,
          orderPrice: orderPrice.toFixed(2), // 2 decimal places পর্যন্ত রাখলাম
          contactNumber,
          address,
          notes,
          paymentMethod,
      };

      // 🎯 STEP 1: If payment is PayFirst, create a checkout session
      if (paymentMethod === "PayFirst") {
          Swal.fire({ title: 'Redirecting...', text: 'You will be redirected to the payment gateway.', timer: 1500, timerProgressBar: true, showConfirmButton: false });

          // সার্ভার থেকে পেমেন্ট সেশন URL আনতে হবে
          const paymentRes = await axios.post(
              "http://localhost:5000/api/orders/create-checkout-session",
              { orderData },
              { headers: { Authorization: `Bearer ${token}` } }
          );

          if (paymentRes.data.url) {
              // পেমেন্ট URL পেলে ইউজারকে রিডাইরেক্ট করা হবে
              window.location.href = paymentRes.data.url; 
              // এখানে সার্ভারে order entry করার দরকার নেই, কারণ পেমেন্ট সফল হওয়ার পর webhook/success route-এ হবে।
              // তবে, পরীক্ষার জন্য আপনি অর্ডার স্ট্যাটাস 'Payment Pending' সেট করে এখানে সেভ করতে পারেন।
              
          } else {
              throw new Error("Failed to get payment URL.");
          }
      } 
      // STEP 2: If payment is Cash on Delivery, place the order directly
      else if (paymentMethod === "Cash on Delivery") {
          await handlePlaceOrder(orderData);
      } else {
          throw new Error("Invalid payment method.");
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to place order";
      Swal.fire({ icon: 'error', title: 'Order Failed', text: errorMessage });
    } finally {
      // যদি PayFirst হয়, তবে setLoading(false) এখানে কল হবে না, কারণ ইউজার অন্য পেজে চলে যাবে।
      // যদি COD হয়, তবে handlePlaceOrder-এর পর navigate হবে, তাই এখানে শুধু নিশ্চিত করতে হবে যে loading অফ হয়।
      setLoading(false);
    }
  };
  
  // UI কোড...
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Complete Your Order: {product.name}</h2>

      <div className="bg-amber-400 text-black shadow-lg rounded-lg p-6 space-y-4">
          
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
              <p className={`font-bold ${product.paymentOption === 'PayFirst' ? 'text-green-600' : 'text-orange-600'}`}>
                Payment Method: {product.paymentOption || "Cash on Delivery"}
              </p>
          </div>

          {/* Order Form Fields (Quantity & Address/Contact - যা ফর্মে থাকা উচিত) */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Quantity:</label>
              <input
                  type="number"
                  value={quantity}
                  min={product.minimumOrder}
                  max={product.availableQuantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
              <p className="text-sm text-gray-500 mt-1">Order must be between {product.minimumOrder} and {product.availableQuantity}</p>
          </div>
          
          {/* ... বাকি ফর্মে থাকা আবশ্যকীয় ফিল্ডগুলি এখানে যুক্ত করুন (First Name, Last Name, Address, Contact Number, Notes) */}
          
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address:</label>
              <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  rows="3"
              ></textarea>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number:</label>
              <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Price (Auto-Calculated):</label>
              <input
                  type="text"
                  value={`$${orderPrice.toFixed(2)}`}
                  readOnly
                  className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 font-semibold"
              />
          </div>


          <button
              onClick={handleBuyNow}
              disabled={loading || quantity < product.minimumOrder || quantity > product.availableQuantity}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 disabled:bg-gray-400"
          >
              {loading ? "Processing..." : `Confirm Order - $${orderPrice.toFixed(2)}`}
          </button>
      </div>
    </div>
  );
};

export default BuyNowPage;