// src/components/EditProductModal.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const EditProductModal = ({ product, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: (product.images || product.image ? (product.images || [product.image]).join(",") : ""),
      moq: product.moq || 1,
      quantity: product.quantity || 0,
      demoVideo: product.demoVideo || "",
      paymentOption: product.paymentOption || "COD",
      showHome: product.showHome || false,
    }
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      images: data.images.split(",").map(i => i.trim()),
      moq: Number(data.moq),
      quantity: Number(data.quantity),
      demoVideo: data.demoVideo,
      paymentOption: data.paymentOption,
      showHome: !!data.showHome,
    };

    try {
      await axiosSecure.put(`/api/products/${product._id}`, payload);
      toast.success("Product updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
          <input {...register("name")} className="input input-bordered" />
          <input {...register("category")} className="input input-bordered" />
          <input type="number" {...register("price")} className="input input-bordered" />
          <input type="number" {...register("quantity")} className="input input-bordered" />
          <input type="number" {...register("moq")} className="input input-bordered" />
          <input {...register("images")} placeholder="comma separated image urls" className="input input-bordered" />
          <input {...register("demoVideo")} placeholder="demo video url" className="input input-bordered" />
          <select {...register("paymentOption")} className="select select-bordered">
            <option value="COD">COD</option>
            <option value="PayFirst">PayFirst</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("showHome")} />
            Show on Home
          </label>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
