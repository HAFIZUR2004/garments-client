import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { firebaseUser, userProfile } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center mt-10 text-gray-500">Product not found!</p>;

  const productWithManager = {
    ...product,
    managerEmail: product.managerEmail || product.addedBy?.email || "Not available",
  };

  const handleBook = () => {
    if (!firebaseUser) return alert("Please login to book");
    if (userProfile?.status === "suspended") return alert("Your account is suspended!");
    navigate(`/dashboard/book/${product._id}`, { state: { product: productWithManager } });
  };

  const handleBuyNow = () => {
    if (!firebaseUser) return alert("Please login to buy");
    if (userProfile?.status === "suspended") return alert("Your account is suspended!");
    navigate("/dashboard/buy-now", { state: { product: productWithManager } });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left: Main Image */}
        <div className="md:w-1/2 h-[400px] overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-full object-cover rounded-l-xl"
          />
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <p className="text-2xl font-bold text-green-600 mb-4">
              ${Number(product.price || 0).toFixed(2)}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Seller: <span className="font-medium text-gray-700">{productWithManager.managerEmail}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={handleBook}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Book Now
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Thumbnail Images */}
      {product.images?.length > 1 && (
        <div className="flex gap-4 mt-6 overflow-x-auto">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name}-${i}`}
              className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition transform"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
