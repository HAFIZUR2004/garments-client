import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";

const AddProduct = () => {
  const { firebaseUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!firebaseUser?.email) {
      return toast.error("User not authenticated");
    }

    setLoading(true);

    const product = {
      name: data.name,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
      moq: Number(data.moq),
      images: data.images.split(",").map((img) => img.trim()),
      demoVideo: data.demoVideo || "",
      paymentOption: data.paymentOption,
      showHome: data.showHome || false,
      managerEmail: firebaseUser.email,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/api/products", product);
      if (res.data.insertedId) {
        toast.success("✅ Product added successfully");
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 p-8 rounded-xl shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Add New Product
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name */}
        <motion.input
          {...register("name", { required: "Product name is required" })}
          placeholder="Product Name"
          whileFocus={{ scale: 1.02 }}
          className="input input-bordered w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        {/* Category */}
        <motion.select
          {...register("category", { required: "Category is required" })}
          whileFocus={{ scale: 1.02 }}
          className="select select-bordered w-full"
        >
          <option value="">Select Category</option>
          <option value="Shirt">Shirt</option>
          <option value="Pant">Pant</option>
          <option value="Jacket">Jacket</option>
          <option value="Accessories">Accessories</option>
        </motion.select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}

        {/* Price */}
        <motion.input
          type="number"
          {...register("price", { required: "Price is required" })}
          placeholder="Price"
          whileFocus={{ scale: 1.02 }}
          className="input input-bordered w-full"
        />

        {/* Quantity */}
        <motion.input
          type="number"
          {...register("quantity", { required: "Quantity is required" })}
          placeholder="Quantity"
          whileFocus={{ scale: 1.02 }}
          className="input input-bordered w-full"
        />

        {/* MOQ */}
        <motion.input
          type="number"
          {...register("moq", { required: "MOQ is required" })}
          placeholder="Minimum Order Quantity"
          whileFocus={{ scale: 1.02 }}
          className="input input-bordered w-full"
        />

        {/* Payment Option */}
        <motion.select
          {...register("paymentOption", { required: "Payment option is required" })}
          whileFocus={{ scale: 1.02 }}
          className="select select-bordered w-full"
        >
          <option value="">Payment Option</option>
          <option value="COD">Cash on Delivery</option>
          <option value="PayFirst">Pay First</option>
        </motion.select>

        {/* Images */}
        <motion.input
          {...register("images", { required: "Images are required" })}
          placeholder="Image URLs (comma separated)"
          whileFocus={{ scale: 1.02 }}
          className="input input-bordered w-full md:col-span-2"
        />

        {/* Description */}
        <motion.textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Product Description"
          whileFocus={{ scale: 1.02 }}
          className="textarea textarea-bordered w-full md:col-span-2"
        />

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:col-span-2 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold rounded-lg shadow-lg flex justify-center items-center"
        >
          {loading ? (
            <div className="scale-50">
              <LoadingSpinner />
            </div>
          ) : (
            "Add Product"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddProduct;
