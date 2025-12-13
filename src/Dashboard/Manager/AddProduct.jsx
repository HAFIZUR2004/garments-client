import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddProduct = () => {
  const { firebaseUser } = useAuth(); // ✅ FIX
  const axiosSecure = useAxiosSecure();

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

    const product = {
      name: data.name,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
      moq: Number(data.moq),
      images: data.images
        .split(",")
        .map((img) => img.trim()),
      demoVideo: data.demoVideo || "",
      paymentOption: data.paymentOption,
      showHome: data.showHome || false,

      // 🔥 MOST IMPORTANT (Manager Dashboard Dynamic)
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name */}
        <input
          {...register("name", { required: "Product name is required" })}
          placeholder="Product Name"
          className="input input-bordered w-full"
        />

        {/* Category */}
        <select
          {...register("category", { required: "Category is required" })}
          className="select select-bordered w-full"
        >
          <option value="">Select Category</option>
          <option value="Shirt">Shirt</option>
          <option value="Pant">Pant</option>
          <option value="Jacket">Jacket</option>
          <option value="Accessories">Accessories</option>
        </select>

        {/* Price */}
        <input
          type="number"
          {...register("price", { required: true })}
          placeholder="Price"
          className="input input-bordered w-full"
        />

        {/* Quantity */}
        <input
          type="number"
          {...register("quantity", { required: true })}
          placeholder="Quantity"
          className="input input-bordered w-full"
        />

        {/* MOQ */}
        <input
          type="number"
          {...register("moq", { required: true })}
          placeholder="Minimum Order Quantity (MOQ)"
          className="input input-bordered w-full"
        />

        {/* Payment Option */}
        <select
          {...register("paymentOption", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Payment Option</option>
          <option value="COD">Cash on Delivery</option>
          <option value="PayFirst">Pay First</option>
        </select>

        {/* Images */}
        <input
          {...register("images", { required: true })}
          placeholder="Image URLs (comma separated)"
          className="input input-bordered w-full md:col-span-2"
        />

        {/* Description */}
        <textarea
          {...register("description", { required: true })}
          placeholder="Product Description"
          className="textarea textarea-bordered w-full md:col-span-2"
        />

        <button className="btn btn-primary md:col-span-2">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
