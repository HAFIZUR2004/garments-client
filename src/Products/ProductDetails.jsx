import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ useNavigate import
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ navigate declare
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full md:w-1/2 rounded object-cover"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-bold mb-4">${product.price?.toFixed(2)}</p>

          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mr-4"
            onClick={() => navigate(`/book/${product._id}`)} // ✅ navigate to BookingPage
          >
            Book Now
          </button>

          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
