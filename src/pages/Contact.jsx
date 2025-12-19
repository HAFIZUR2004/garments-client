import React, { useState } from "react";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show a toast. Later you can integrate API.
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
