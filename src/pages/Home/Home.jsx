import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔥 This API returns only showHome = true products
        const res = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Hero />

      {/* ================= PRODUCTS SECTION ================= */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>

        {loading && (
          <p className="text-center text-gray-600">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            No featured products available
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.05 }}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <img
                src={
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/300"
                }
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />

              <h3 className="text-xl font-semibold mb-1">
                {product.name}
              </h3>

              <p className="text-gray-700 mb-2 line-clamp-2">
                {product.description}
              </p>

              <p className="font-bold mb-4 text-blue-600">
                ${Number(product.price).toFixed(2)}
              </p>

              <button
                onClick={() => navigate(`/product/${product._id}`)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Choose your product",
              "Place your order",
              "Receive your delivery",
            ].map((text, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded shadow text-center"
              >
                <h3 className="font-semibold mb-2 text-blue-600">
                  Step {i + 1}
                </h3>
                <p className="text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK ================= */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Customer Feedback
        </h2>

        <div className="flex overflow-x-auto gap-4">
          {[
            { msg: "Great quality products!", name: "Alice" },
            { msg: "Fast delivery and excellent service.", name: "Bob" },
            { msg: "Highly recommend this store.", name: "Carol" },
          ].map((item, i) => (
            <div
              key={i}
              className="min-w-[250px] bg-gray-100 rounded p-4 shadow"
            >
              <p className="text-gray-700">"{item.msg}"</p>
              <p className="mt-2 font-semibold text-blue-600">
                - {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXTRA ================= */}
      <section className="bg-blue-600 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Latest Updates
        </h2>
        <p>
          Stay updated with the newest products and offers.
        </p>
      </section>

      <section className="bg-gray-900 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Why Choose Us?
        </h2>
        <p>
          Quality products, fast delivery, and customer satisfaction guaranteed.
        </p>
      </section>
    </div>
  );
};

export default Home;
