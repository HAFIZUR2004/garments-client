import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ১. ফিডব্যাক ডাটা
  const feedbacks = [
    { msg: "Great quality products!", name: "Alice" },
    { msg: "Fast delivery and excellent service.", name: "Bob" },
    { msg: "Highly recommend this store.", name: "Carol" },
    { msg: "The fabric quality is outstanding!", name: "David" },
    { msg: "Best price for bulk orders.", name: "Eva" },
    { msg: "Impressive customer support team.", name: "Fahim" },
    { msg: "Their finishing is top-notch.", name: "Grace" },
    { msg: "A reliable partner for garments business.", name: "Hasan" },
  ];

  // ২. ব্রেকিং নিউজ এনিমেশন লজিক
  const marqueeVariants = {
    animate: {
      x: [0, -1500],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://garments-server-omega.vercel.app/api/products");
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
    <div className="bg-white -mb-15 text-gray-900 overflow-x-hidden">
      <Hero />

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl font-bold text-center">Featured Products</h2>
          <div className="w-24 h-1 bg-blue-600 mt-3 rounded-full"></div>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-500">No featured products available.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {!loading && products.slice(0, 8).map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-blue-600 font-bold text-sm shadow-sm">
                  ${Number(product.price || 0).toFixed(2)}
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{product.category}</span>
                <h3 className="text-lg font-bold mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS (Modernized) ================= */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { title: "Choose Product", desc: "Select from our premium collection", icon: "01" },
              { title: "Place Order", desc: "Easy and secure checkout process", icon: "02" },
              { title: "Fast Delivery", desc: "Get products at your doorstep", icon: "03" }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="relative bg-white p-10 rounded-3xl shadow-lg">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-blue-200 shadow-xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK (Infinite Marquee) ================= */}
      <section className="py-20 bg-white overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Clients Say</h2>
        
        <div className="relative flex">
          <motion.div
            className="flex gap-6 whitespace-nowrap"
            variants={marqueeVariants}
            animate="animate"
            style={{ display: "flex", width: "fit-content" }}
          >
            {/* ৩ বার ম্যাপ করা হয়েছে যাতে কোনো গ্যাপ না থাকে */}
            {[...feedbacks, ...feedbacks, ...feedbacks].map((item, i) => (
              <div
                key={i}
                className="min-w-[350px] bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-300 transition-colors"
              >
                <div className="flex text-yellow-400 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="text-gray-700 italic text-lg whitespace-normal leading-relaxed">
                  “{item.msg}”
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA (Newsletter) ================= */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-blue-600 rounded-[2rem] p-12 text-center text-white shadow-2xl shadow-blue-200">
          <h2 className="text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">Subscribe to get notified about new arrivals and exclusive garment industry insights.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input type="email" placeholder="Enter your email" className="px-6 py-4 rounded-xl text-gray-900 flex-1 outline-none" />
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-gray-950 py-16 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4 italic text-blue-500">GarmentsPro</h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Leading the way in premium garment manufacturing and wholesale solutions worldwide.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;