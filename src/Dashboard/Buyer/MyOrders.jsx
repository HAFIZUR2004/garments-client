import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ConfirmModal from "../../components/orders/ConfirmModal";
import OrderTimeline from "../../components/orders/OrderTimeline";
import { toast } from "react-hot-toast";

// --- React Icons Import ---
import { AiOutlineCloseCircle, AiOutlineEye } from 'react-icons/ai'; // Cancel, View
import { FaSpinner } from 'react-icons/fa'; // Loading spinner for Cancel button

// আইকন ও কালার ম্যাপিং
const statusColor = {
    Pending: { class: "badge-warning", icon: "🕒" },
    Approved: { class: "badge-success", icon: "✅" },
    Rejected: { class: "badge-error", icon: "❌" },
    Cancelled: { class: "badge-ghost", icon: "🛑" },
    Processing: { class: "badge-info", icon: "⚙️" }, 
};

const MyOrders = () => {
    const { firebaseUser } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelId, setCancelId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null); 

    // ডেটা লোড করার ফাংশন
    const fetchOrders = async () => {
        if (!firebaseUser) return;
        setLoading(true);
        try {
            const token = await firebaseUser.getIdToken();
            const res = await axiosSecure.get("/api/orders/my-orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your orders");
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook
    useEffect(() => {
        if (firebaseUser) {
            fetchOrders();
        } else {
            setLoading(false);
            setOrders([]);
        }
    }, [firebaseUser]);

    // অর্ডার ক্যানসেল ফাংশন
    const cancelOrder = async () => {
        if (!cancelId) return;
        setCancelLoading(true);
        const toastId = toast.loading("Cancelling order...");
        try {
            const token = await firebaseUser.getIdToken();
            await axiosSecure.patch(
                `/api/orders/cancel/${cancelId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order cancelled successfully", { id: toastId });
            setCancelId(null);
            fetchOrders(); 
        } catch (err) {
            console.error(err);
            toast.error("Unable to cancel order", { id: toastId });
        } finally {
            setCancelLoading(false);
        }
    };

    // ডেট ফরম্যাট ফাংশন
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };


    // --- লোডিং ও খালি স্টেট ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <span className="loading loading-ring loading-lg text-blue-500"></span>
                    <p className="mt-3 text-lg font-medium text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="text-center py-20  rounded-xl shadow-lg m-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-2xl font-bold mt-4 text-gray-800">No Orders Found</h3>
                <p className="text-gray-500 mt-2">
                    It looks like you haven't placed any orders yet. Start shopping now!
                </p>
            </div>
        );
    }

    // --- মূল কম্পোনেন্ট রেন্ডার ---
    return (
        <div className="p-4 md:p-8  min-h-screen">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">📦 My Orders ({orders.length})</h2>

            {/* --- ডেস্কটপ টেবিল ভিউ --- */}
            <div className="hidden lg:block  shadow-xl rounded-xl overflow-hidden">
                <table className="table w-full">
                    {/* Table Head */}
                    <thead className="bg-gray-800 text-white sticky top-0">
                        <tr>
                            <th className="p-4 text-sm font-semibold">Order ID</th>
                            <th className="p-4 text-sm font-semibold">Date</th>
                            <th className="p-4 text-sm font-semibold">Product</th>
                            <th className="p-4 text-sm font-semibold text-center">Qty</th>
                            <th className="p-4 text-sm font-semibold text-center">Status</th>
                            <th className="p-4 text-sm font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id} className="border-b hover:bg-blue-50/50 transition duration-150">
                                <td className="p-4 text-sm font-mono text-gray-700">
                                    <span className="font-bold text-blue-600">#</span>{o._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {formatDate(o.createdAt)}
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-900">{o.productName}</td>
                                <td className="p-4 text-sm text-center font-bold text-gray-700">{o.quantity}</td>
                                <td className="p-4 text-center">
                                    <div className={`badge ${statusColor[o.status]?.class || 'badge-neutral'} font-semibold text-xs`}>
                                        {statusColor[o.status]?.icon} {o.status}
                                    </div>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                    {/* --- Details Button (View Icon) --- */}
                                    <button
                                        className="btn btn-sm btn-info text-white bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 transition duration-150 tooltip"
                                        data-tip="View Details"
                                        onClick={() => setSelectedOrder(o)}
                                    >
                                        <AiOutlineEye className="w-5 h-5" />
                                    </button>

                                    {/* --- Cancel Button (Close Icon) --- */}
                                    {o.status === "Pending" && (
                                        <button
                                            className="btn btn-sm btn-error text-white bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 transition duration-150 tooltip"
                                            data-tip="Cancel Order"
                                            onClick={() => setCancelId(o._id)}
                                            disabled={cancelLoading}
                                        >
                                            {/* ক্যানসেল লোডিং হলে স্পিনার দেখাবে */}
                                            {cancelLoading && cancelId === o._id ? (
                                                <FaSpinner className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <AiOutlineCloseCircle className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- মোবাইল কার্ড ভিউ (Accordion) --- */}
            <div className="lg:hidden space-y-4">
                {orders.map((o) => (
                    <div key={o._id} className="collapse collapse-arrow  shadow-md rounded-lg">
                        <input 
                            type="radio" 
                            name="my-accordion-2" 
                            checked={expandedOrderId === o._id} 
                            onChange={() => setExpandedOrderId(o._id === expandedOrderId ? null : o._id)}
                        /> 
                        <div className="collapse-title text-lg font-bold flex justify-between items-center pr-10">
                            <div>
                                <span className="text-blue-600">Order #{o._id.slice(-6).toUpperCase()}</span>
                                <p className="text-sm font-normal text-gray-500 mt-0.5">{o.productName}</p>
                            </div>
                            <div className={`badge ${statusColor[o.status]?.class || 'badge-neutral'} font-semibold text-xs`}>
                                {statusColor[o.status]?.icon} {o.status}
                            </div>
                        </div>
                        <div className="collapse-content  border-t pt-4">
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><strong>Date:</strong> {formatDate(o.createdAt)}</li>
                                <li><strong>Quantity:</strong> {o.quantity}</li>
                                <li><strong>Payment:</strong> {o.paymentMethod || "Cash on Delivery"}</li>
                            </ul>
                            <div className="mt-4 flex justify-end space-x-2">
                                {/* --- Details Button (View Icon) --- */}
                                <button
                                    className="btn btn-sm btn-info text-white bg-blue-500 hover:bg-blue-600 border-blue-500"
                                    onClick={() => {
                                        setSelectedOrder(o);
                                        setExpandedOrderId(null);
                                    }}
                                >
                                    <AiOutlineEye className="w-5 h-5" />
                                </button>
                                
                                {/* --- Cancel Button (Close Icon) --- */}
                                {o.status === "Pending" && (
                                    <button
                                        className="btn btn-sm btn-error text-white bg-red-500 hover:bg-red-600 border-red-500"
                                        onClick={() => {
                                            setCancelId(o._id);
                                            setExpandedOrderId(null);
                                        }}
                                        disabled={cancelLoading}
                                    >
                                        {cancelLoading && cancelId === o._id ? (
                                            <FaSpinner className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <AiOutlineCloseCircle className="w-5 h-5" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* --- Modals (কোনো পরিবর্তন করা হয়নি) --- */}
            
            {/* Order Timeline Modal */}
            {selectedOrder && (
                <OrderTimeline
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {/* Cancel Confirmation Modal */}
            {cancelId && (
                <ConfirmModal
                    title="Confirm Cancellation"
                    description={`Are you sure you want to cancel Order #${cancelId.slice(-6).toUpperCase()}? This action cannot be undone.`}
                    confirmText={cancelLoading ? "Cancelling..." : "Yes, Cancel It"}
                    loading={cancelLoading}
                    onConfirm={cancelOrder}
                    onCancel={() => setCancelId(null)}
                />
            )}
        </div>
    );
};

export default MyOrders;