import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; // ✅ correct auth hook

const BookingPage = () => {
  const { user, loading } = useAuth(); // ✅ auth context user
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);

  // ✅ Fetch product
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setOrderPrice(res.data.price);
        setDataLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setDataLoading(false);
      });
  }, [id]);

  // ✅ Update price on quantity change
  useEffect(() => {
    if (product) {
      setOrderPrice(quantity * product.price);
    }
  }, [quantity, product]);

  // ✅ Firebase loading state
  if (loading) {
    return <p className="text-center mt-10">Checking login...</p>;
  }

  // ✅ Not logged in
  if (!user) {
    return (
      <div className="text-center mt-20">
        <p className="mb-4">Please login to book.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ✅ Product loading
  if (dataLoading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  // ✅ Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantity < 1 || quantity > product.quantity) {
      return alert(`Quantity must be between 1 and ${product.quantity}`);
    }

    const order = {
      userId: user?.uid,
      email: user?.email,
      firstName,
      lastName,
      contact,
      productId: product._id,
      productName: product.name,
      quantity,
      orderPrice,
      address,
      notes,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/book-order", order);
      if (res.data.success) {
        alert("Order placed successfully!");
        navigate("/my-orders");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
      <p className="mb-4">{product.description}</p>
      <p className="font-bold mb-4">Price per unit: ${product.price}</p>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        {/* ✅ Read-only */}
        <div>
          <label>Email:</label>
          <input type="email" value={user.email} readOnly className="border p-2 w-full" />
        </div>

        <div>
          <label>Product Title:</label>
          <input type="text" value={product.name} readOnly className="border p-2 w-full" />
        </div>

        <div>
          <label>Total Price:</label>
          <input
            type="text"
            value={`$${orderPrice.toFixed(2)}`}
            readOnly
            className="border p-2 w-full"
          />
        </div>

        {/* ✅ Editable */}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Quantity (1 - {product.quantity}):</label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Additional Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
