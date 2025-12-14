// src/pages/dashboard/AdminAllProducts.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import EditProductModal from "./EditProductModal";

const AdminAllProducts = () => {
  const axiosSecure = useAxiosSecure();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // ================= FETCH ALL PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/products/all");
      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      const res = await axiosSecure.delete(`/api/products/${id}`);
      if (res.status === 200) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ================= TOGGLE SHOW HOME =================
  const toggleShowHome = async (id, current) => {
    try {
      await axiosSecure.patch(`/api/products/${id}/home`, {
        showHome: !current,
      });
      toast.success("Updated show on home");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Products (Admin)</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Show Home</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    No products found
                  </td>
                </tr>
              )}

              {products.map((p) => (
                <tr key={p._id}>
                  <td className="w-24">
                    <img
                      src={
                        p.images?.[0] ||
                        p.image ||
                        "https://via.placeholder.com/80"
                      }
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.createdBy || "—"}</td>

                  <td>
                    <input
                      type="checkbox"
                      checked={!!p.showHome}
                      onChange={() =>
                        toggleShowHome(p._id, !!p.showHome)
                      }
                    />
                  </td>

                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => setEditingProduct(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default AdminAllProducts;
