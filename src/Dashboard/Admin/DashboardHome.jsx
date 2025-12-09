// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/orders"),
        ]);

        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-2 transition-colors duration-300"
      : "text-gray-700 hover:bg-blue-100 px-4 py-2 rounded flex items-center gap-2 mb-2 transition-colors duration-300";

  const menuItems = [
    { to: "/dashboard", name: "Dashboard Home", icon: "M3 12l2-2m0 0l7-7 7 7M13 5v6h6" },
    { to: "/dashboard/all-products", name: "All Products", icon: "M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6" },
    { to: "/dashboard/all-orders", name: "All Orders", icon: "M9 17v-6h6v6" },
    { to: "/dashboard/add-product", name: "Add Product", icon: "M12 4v16m8-8H4" },
    { to: "/dashboard/my-orders", name: "My Orders", icon: "M5 13l4 4L19 7" },
  ];

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="px-4 text-lg font-semibold">Admin Dashboard</div>
        </nav>

        {/* Page content */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="p-4 bg-white rounded shadow">
                  <h3 className="font-bold">{p.name}</h3>
                  <p>Price: ${p.price?.toFixed(2)}</p>
                  <p>Category: {p.category}</p>
                  <p>Quantity: {p.quantity}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((o) => (
                <div key={o._id} className="p-4 bg-white rounded shadow">
                  <p>Product ID: {o.productId}</p>
                  <p>User ID: {o.userId}</p>
                  <p>Quantity: {o.quantity}</p>
                  <p>Price: ${o.price?.toFixed(2)}</p>
                  <p>Status: {o.status}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="flex flex-col min-h-screen bg-base-200 w-64 transition-all duration-300">
          <div className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Dashboard Menu</h2>
            <ul className="menu w-full grow">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end className={linkClass} title={item.name}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
