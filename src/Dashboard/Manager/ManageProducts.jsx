import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import EditProductModal from "../Admin/EditProductModal";
import { useAuth } from "../../hooks/useAuth";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await axiosSecure.get(`/api/products/managed?email=${user.email}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching managed products:", err);
      toast.error("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email) {
      fetchProducts();
    }
  }, [user, authLoading]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await axiosSecure.delete(`/api/products/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return <p className="p-6 text-center text-gray-500">Checking Authentication...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Manage My Products</h2>
        <span className="text-sm bg-blue-200 text-blue-900 px-3 py-1 rounded-full shadow-sm font-medium">
          Owner: {user?.email}
        </span>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search your products..."
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-md bg-white">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-gray-800">Image</th>
                <th className="px-4 py-3 text-gray-800">Product Name</th>
                <th className="px-4 py-3 text-gray-800">Price</th>
                <th className="px-4 py-3 text-gray-800">Stock</th>
                <th className="px-4 py-3 text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border shadow-sm">
                      <img
                        src={item.images?.[0] || item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-2 text-green-700 font-semibold">${item.price}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.stock > 0
                          ? "bg-green-100 text-green-900"
                          : "bg-red-100 text-red-900"
                      }`}
                    >
                      {item.stock || item.quantity || 0}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
                      onClick={() => setEditProduct(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-700 text-white rounded-lg text-sm hover:bg-red-800 transition"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No products found for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          close={() => setEditProduct(null)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
};

export default ManageProducts;
