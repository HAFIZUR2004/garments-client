import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiPlayCircle } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white min-h-[90vh] flex items-center overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (বড় হালকা নীল সার্কেল) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 relative z-10">
        
        {/* বাম পাশ: টেক্সট কন্টেন্ট */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full"
          >
            Next-Gen Garments Solution
          </motion.span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Smart Way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Track Production
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
            Revolutionize your garment factory workflow. Manage orders, monitor every production stage in real-time, and guarantee precision delivery.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/allproducts")}
              className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              View All Products
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/about")}
              className="flex items-center gap-2 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              <FiPlayCircle size={22} className="text-blue-600" />
              How it works
            </button>
          </div>

          {/* ট্রাস্ট ব্যাজ বা স্ট্যাটাস */}
          <div className="mt-12 flex items-center gap-6 border-t border-gray-100 pt-8">
            <div>
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-500">Trusted Partners</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
              <p className="text-sm text-gray-500">Quality Check</p>
            </div>
          </div>
        </motion.div>

        {/* ডান পাশ: ইমেজ উইথ ফ্লোটিং এনিমেশন */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* ইমেজের পেছনে ডেকোরেটিভ বক্স */}
          <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 scale-95 opacity-10"></div>
          
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <img
              src="https://i.ibb.co.com/N2SfR4RV/img1.jpg"
              alt="Hero Banner"
              className="w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border-8 border-white"
            />
            
            {/* ফ্লোটিং কার্ড ১ */}
            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hidden lg:flex"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <FiArrowRight />
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Status</p>
                <p className="font-bold text-gray-800">100% On Time</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;