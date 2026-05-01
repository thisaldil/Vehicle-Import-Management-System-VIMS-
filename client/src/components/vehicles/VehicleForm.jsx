import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../utils/axios";

export default function VehicleForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    customerId: customerId || "",
    specifications: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      vin: "",
      engineCC: "",
      fuelType: "petrol",
      transmission: "automatic",
      mileage: "",
      color: "",
      bodyType: "sedan"
    },
    purchaseInfo: {
      purchaseDate: new Date().toISOString().split("T")[0],
      purchasePrice: "",
      currency: "USD",
      supplier: "",
      importCountry: ""
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post("/api/vehicles", formData);
      alert("Vehicle created successfully");
      navigate("/dashboard/vehicles");
    } catch (err) {
      console.error("Error creating vehicle:", err);
      alert("Error creating vehicle");
    } finally {
      setSaving(false);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/vehicles")}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">New Vehicle</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Specifications */}
          <div>
            <h3 className="text-lg font-bold mb-4">Specifications</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Make *</label>
                <input
                  type="text"
                  required
                  value={formData.specifications.make}
                  onChange={(e) => handleNestedChange("specifications", "make", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.specifications.model}
                  onChange={(e) => handleNestedChange("specifications", "model", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year *</label>
                <input
                  type="number"
                  required
                  value={formData.specifications.year}
                  onChange={(e) => handleNestedChange("specifications", "year", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">VIN *</label>
                <input
                  type="text"
                  required
                  value={formData.specifications.vin}
                  onChange={(e) => handleNestedChange("specifications", "vin", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Engine CC</label>
                <input
                  type="number"
                  value={formData.specifications.engineCC}
                  onChange={(e) => handleNestedChange("specifications", "engineCC", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  value={formData.specifications.color}
                  onChange={(e) => handleNestedChange("specifications", "color", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  value={formData.specifications.fuelType}
                  onChange={(e) => handleNestedChange("specifications", "fuelType", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transmission</label>
                <select
                  value={formData.specifications.transmission}
                  onChange={(e) => handleNestedChange("specifications", "transmission", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mileage</label>
                <input
                  type="number"
                  value={formData.specifications.mileage}
                  onChange={(e) => handleNestedChange("specifications", "mileage", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Purchase Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Purchase Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseInfo.purchaseDate}
                  onChange={(e) => handleNestedChange("purchaseInfo", "purchaseDate", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Purchase Price *</label>
                <input
                  type="number"
                  required
                  value={formData.purchaseInfo.purchasePrice}
                  onChange={(e) => handleNestedChange("purchaseInfo", "purchasePrice", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={formData.purchaseInfo.currency}
                  onChange={(e) => handleNestedChange("purchaseInfo", "currency", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="LKR">LKR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Import Country *</label>
                <input
                  type="text"
                  required
                  value={formData.purchaseInfo.importCountry}
                  onChange={(e) => handleNestedChange("purchaseInfo", "importCountry", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Supplier</label>
                <input
                  type="text"
                  value={formData.purchaseInfo.supplier}
                  onChange={(e) => handleNestedChange("purchaseInfo", "supplier", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <Save size={20} /> {saving ? "Creating..." : "Create Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}
