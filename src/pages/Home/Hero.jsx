import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-100 min-h-screen flex items-center">
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your Garments Production <br /> Seamlessly
          </h1>
          <p className="text-gray-700 mb-6">
            Manage orders, monitor production stages, and ensure timely delivery.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            View Products
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://i.ibb.co.com/N2SfR4RV/img1.jpg"
            alt="Hero Banner"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
