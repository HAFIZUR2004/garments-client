// src/components/EditProductModal.jsx
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const EditProductModal = ({ product, onClose, refresh }) => {
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: product?.name,
      description: product?.description,
      price: product?.price,
      category: product?.category,
      images: product?.images?.join(", ") || "",
      moq: product?.moq || 1,
      quantity: product?.quantity || 0,
      demoVideo: product?.demoVideo || "",
      paymentOption: product?.paymentOption || "COD",
      showHome: product?.showHome || false,
    },
  });

  const onSubmit = async (data) => {
    const cleanImages = data.images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 5);

    const payload = {
      ...data,
      price: Number(data.price),
      moq: Number(data.moq),
      quantity: Number(data.quantity),
      images: cleanImages,
      showHome: !!data.showHome,
    };

    try {
      await axiosSecure.put(`/api/products/${product._id}`, payload);

      Swal.fire({
        icon: "success",
        title: "Product Updated!",
        text: "Changes saved successfully.",
        confirmButtonColor: "#6366F1", // Tailwind Indigo-500
      }).then(() => {
        onClose();
        refresh?.();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to update product.",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative border border-gray-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition"
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <input
            {...register("name")}
            className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Product Name"
          />

          <textarea
            {...register("description")}
            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Product Description"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              {...register("price")}
              className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Price"
            />
            <input
              type="number"
              {...register("quantity")}
              className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Quantity"
            />
            <input
              type="number"
              {...register("moq")}
              className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="MOQ"
            />
          </div>

          <input
            {...register("category")}
            className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Category"
          />

          <input
            {...register("images")}
            className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Image URLs (comma separated)"
          />

          <input
            {...register("demoVideo")}
            className="input input-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Demo Video URL"
          />

          <select
            {...register("paymentOption")}
            className="select select-bordered w-full focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="PayFirst">Pay First</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("showHome")} className="accent-indigo-500" />
            <span className="text-gray-700 font-medium">Show on Home</span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-lg border bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
