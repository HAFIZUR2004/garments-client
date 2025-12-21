import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("https://garments-server-omega.vercel.app/api/products/all");
        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">All Products</h2>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* No products */}
        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-500">No products available</p>
        )}

        {/* Products Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            products.length > 0 &&
            products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Main Image */}
               <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-yellow-400 px-3 py-1 rounded shadow-lg text-black font-bold">
                    ${Number(product.price || 0).toFixed(2)}
                  </div>
                </div>

                {/* Product Info (moved slightly below) */}
                <div className="p-5 flex flex-col flex-1 mt-4">
                  <h3 className="text-lg font-semibold line-clamp-1 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-sm text-gray-400 mb-2">Category: {product.category || "N/A"}</p>
                  {product.quantity !== undefined && (
                    <p className="text-sm text-gray-500 mb-4">Stock: {product.quantity}</p>
                  )}

                  <button
                    className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 rounded-lg font-medium hover:from-indigo-500 hover:to-blue-500 transition shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
