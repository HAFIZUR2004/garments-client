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
        const res = await axios.get(
          "https://garments-server-omega.vercel.app/api/products/all"
        );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800"
        >
          Explore Our Products
        </motion.h2>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-500">
            No products available right now
          </p>
        )}

        {/* Products */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-200 cursor-pointer flex flex-col"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/400"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Price */}
                  <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold shadow-lg">
                    ${Number(product.price || 0).toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="text-sm text-gray-400 mb-4 space-y-1">
                    <p>Category: {product.category || "N/A"}</p>
                    {product.quantity !== undefined && (
                      <p>Stock: {product.quantity}</p>
                    )}
                  </div>

                  <button
                    className="mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold tracking-wide
                    hover:from-indigo-600 hover:to-blue-600 transition-all shadow-md"
                  >
                    View Details →
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
