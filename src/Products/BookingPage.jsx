import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BookingPage = () => {
  const { firebaseUser, user, loading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);

  // Fetch product
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setOrderPrice(res.data.price);
        setLoadingProduct(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setLoadingProduct(false);
      });
  }, [id]);

  // Update price
  useEffect(() => {
    if (product) setOrderPrice(quantity * product.price);
  }, [quantity, product]);

  if (loading) return <p>Checking login...</p>;
  if (!user)
    return (
      <div className="text-center mt-20">
        <p>Please login to book.</p>
        <button onClick={() => navigate("/login")} className="bg-amber-500 px-4 py-2 rounded">
          Go to Login
        </button>
      </div>
    );

  if (loadingProduct) return <p>Loading product...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 1 || quantity > product.quantity) {
      return alert(`Quantity must be between 1 and ${product.quantity}`);
    }

    const order = { firstName, lastName, contact, address, notes, productId: product._id, productName: product.name, quantity, orderPrice };

    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.post("http://localhost:5000/api/orders/book", order, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("Order placed successfully!");
        navigate("/dashboard/my-orders");
      } else {
        alert(res.data.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err.response || err.message);
      alert(err.response?.data?.error || "Failed to place order");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <p className="mb-4">{product.description}</p>
      <p className="font-bold mb-4">Price: ${product.price}</p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input type="email" value={user.email} readOnly className="border p-2 w-full" />
        <input type="text" value={product.name} readOnly className="border p-2 w-full" />
        <input type="text" value={`$${orderPrice.toFixed(2)}`} readOnly className="border p-2 w-full" />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border p-2 w-full" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border p-2 w-full" />
        <input type="number" min="1" max={product.quantity} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required className="border p-2 w-full" />
        <input type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} required className="border p-2 w-full" />
        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required className="border p-2 w-full" />
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Place Order</button>
      </form>
    </div>
  );
};

export default BookingPage;
