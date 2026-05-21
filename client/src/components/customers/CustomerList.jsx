import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import api from "../../utils/axios";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/customers", {
        params: { page, limit: 10, search }
      });
      setCustomers(res.data.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/customers/${customerId}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
        <button
          onClick={() => navigate("/dashboard/customers/new")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          <Plus size={20} /> New Customer
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-x-auto shadow">
          <table className="min-w-[720px] w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left sm:px-6">Name</th>
                <th className="px-4 py-3 text-left sm:px-6">Email</th>
                <th className="px-4 py-3 text-left sm:px-6">Phone</th>
                <th className="px-4 py-3 text-left sm:px-6">Vehicles</th>
                <th className="px-4 py-3 text-left sm:px-6">Status</th>
                <th className="px-4 py-3 text-left sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-4 font-medium sm:px-6">{customer.name}</td>
                  <td className="px-4 py-4 sm:px-6">{customer.email}</td>
                  <td className="px-4 py-4 sm:px-6">{customer.phone}</td>
                  <td className="px-4 py-4 sm:px-6">{customer.vehicleCount || 0}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2 sm:px-6">
                    <button
                      onClick={() => navigate(`/dashboard/customers/${customer._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
