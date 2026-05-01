import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../utils/axios";

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/customers/${customerId}`);
      setCustomer(res.data.customer);
    } catch (err) {
      console.error("Error fetching customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/customers/${customerId}`, customer);
      alert("Customer updated successfully");
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Error updating customer");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setCustomer({
        ...customer,
        [parent]: { ...customer[parent], [child]: value }
      });
    } else {
      setCustomer({ ...customer, [field]: value });
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!customer) return <div className="text-center py-8">Customer not found</div>;

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/customers")}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold mb-6">Customer Details</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={customer.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={customer.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={customer.address?.country || ""}
              onChange={(e) => handleChange("address.country", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input
              type="text"
              value={customer.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={customer.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={customer.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
        >
          <Save size={20} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-xl font-bold mb-4">Vehicles</h3>
        <button
          onClick={() => navigate(`/dashboard/vehicles/new?customerId=${customerId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Vehicle
        </button>
      </div>
    </div>
  );
}
