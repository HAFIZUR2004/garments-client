import React from "react";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";

const steps = ["Pending", "Packed", "Shipped", "Delivered"];

const OrderTimeline = ({ order, onClose }) => {
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Order Tracking</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✖
          </button>
        </div>

        {/* Stepper */}
        <div className="flex flex-col space-y-6 relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step} className="flex items-center">
                {/* Step Indicator */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"}`}
                  >
                    {isCompleted ? <AiOutlineCheckCircle size={20} /> : index + 1}
                  </div>
                  {/* Connector line */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`w-1 h-full mt-1 ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                  )}
                </div>

                {/* Step Text */}
                <div className="ml-4">
                  <h4
                    className={`font-semibold ${
                      isCompleted || isCurrent ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </h4>
                  {isCurrent && (
                    <p className="text-xs text-blue-600 mt-1">In progress</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default OrderTimeline;
