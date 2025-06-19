import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import "../../pages/dashboard/Dashboard.css";
import { useAuthContext } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api/stocks";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newStock, setNewStock] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });
  const { user } = useAuthContext();
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStocks(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAdd = async () => {
    if (
      !newStock.name ||
      !newStock.category ||
      isNaN(newStock.quantity) ||
      isNaN(newStock.price)
    )
      return;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newStock,
        quantity: parseInt(newStock.quantity),
        price: parseFloat(newStock.price),
      }),
    });

    if (response.ok) {
      await fetchStocks();
      setNewStock({ name: "", category: "", quantity: "", price: "" });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const stock = stocks[index];
    setNewStock({ ...stock });
  };

  const handleSave = async () => {
    const stockToUpdate = stocks[editingIndex];
    const response = await fetch(`${API_URL}/${stockToUpdate._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newStock,
        quantity: parseInt(newStock.quantity),
        price: parseFloat(newStock.price),
      }),
    });

    if (response.ok) {
      await fetchStocks();
      setEditingIndex(null);
      setNewStock({ name: "", category: "", quantity: "", price: "" });
    }
  };

  const handleDelete = async (index) => {
    const stockToDelete = stocks[index];
    const response = await fetch(`${API_URL}/${stockToDelete._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchStocks();
    }
  };

  const getStatus = (qty) => (qty > 0 ? "In Stock" : "Out of Stock");

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f7ff] p-6">
        <div className="bg-white rounded-2xl shadow-mp p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Stock Management
          </h1>

          {isAdmin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  value={newStock.name}
                  onChange={handleChange}
                  placeholder="Item name"
                  className="input"
                />
                <input
                  type="text"
                  name="category"
                  value={newStock.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="input"
                />
                <input
                  type="number"
                  name="quantity"
                  value={newStock.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="input"
                />
                <input
                  type="number"
                  name="price"
                  value={newStock.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="input"
                />
              </div>
              <div className="mb-4">
                {editingIndex !== null ? (
                  <button className="btn btn-blue" onClick={handleSave}>
                    Save Changes
                  </button>
                ) : (
                  <button className="btn btn-green" onClick={handleAdd}>
                    Add Item
                  </button>
                )}
              </div>
            </>
          )}

          <div className="table-wrapper">
            <table className="appointments-table">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Price</th>
                  {isAdmin && <th className="px-4 py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {stocks.length > 0 ? (
                  stocks.map((item, index) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-sm">{item.category}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            item.quantity > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {getStatus(item.quantity)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">₱{item.price}</td>
                      {isAdmin && (
                        <td className="px-4 py-2 text-sm space-x-2">
                          <button
                            className="btn btn-yellow"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-red"
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? "6" : "5"}
                      className="text-center text-gray-400 py-6"
                    >
                      No stocks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StockManagement;
