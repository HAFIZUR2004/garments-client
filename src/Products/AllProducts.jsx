import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/all-products"); // all products
        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">All Products</h2>

        {loading && <p className="text-center text-gray-700">Loading products...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">No products available</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-1">Category: {product.category}</p>
              <p className="text-gray-700 font-bold mb-2">${product.price?.toFixed(2)}</p>
              {product.quantity !== undefined && (
                <p className="text-gray-500 mb-4">Available: {product.quantity}</p>
              )}
              <button
                onClick={() => navigate(`/product/${product._id}`)}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
