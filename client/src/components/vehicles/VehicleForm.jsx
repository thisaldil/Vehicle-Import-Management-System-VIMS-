import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../utils/axios";
import {
  VEHICLE_BODY_TYPES,
  VEHICLE_MAKES,
  VEHICLE_MODELS_BY_MAKE,
} from "./vehicleCatalog";

export default function VehicleForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [saving, setSaving] = useState(false);
  const [makeOptions, setMakeOptions] = useState(VEHICLE_MAKES);
  const [modelOptionsByMake, setModelOptionsByMake] = useState(
    VEHICLE_MODELS_BY_MAKE
  );
  const [showCustomMakeInput, setShowCustomMakeInput] = useState(false);
  const [showCustomModelInput, setShowCustomModelInput] = useState(false);
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");

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

  const selectedMake = formData.specifications.make;
  const selectedModel = formData.specifications.model;

  const availableModels = useMemo(() => {
    if (!selectedMake) return [];
    return modelOptionsByMake[selectedMake] || [];
  }, [modelOptionsByMake, selectedMake]);

  const makeSelectValue = showCustomMakeInput
    ? "__custom__"
    : makeOptions.includes(selectedMake)
      ? selectedMake
      : "";

  const modelSelectValue = showCustomModelInput
    ? "__custom__"
    : availableModels.includes(selectedModel)
      ? selectedModel
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validate customerId
      if (!formData.customerId) {
        alert("Please select a customer first. Go to Customers and create one, then add a vehicle from the customer page.");
        setSaving(false);
        return;
      }

      const pendingMake = showCustomMakeInput ? customMake.trim().toUpperCase() : "";
      const pendingModel = showCustomModelInput ? customModel.trim() : "";
      const payload = {
        ...formData,
        specifications: {
          ...formData.specifications,
          make: pendingMake || formData.specifications.make,
          model: pendingModel || formData.specifications.model,
        },
      };

      if (!payload.specifications.make || !payload.specifications.model) {
        alert("Please select or add both a make and model.");
        setSaving(false);
        return;
      }

      await api.post("/api/vehicles", payload);
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
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleMakeSelect = (value) => {
    if (value === "__custom__") {
      setShowCustomMakeInput(true);
      setCustomMake(selectedMake || "");
      setShowCustomModelInput(false);
      setCustomModel("");
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          make: "",
          model: "",
        },
      }));
      return;
    }

    setShowCustomMakeInput(false);
    setCustomMake("");
    setShowCustomModelInput(false);
    setCustomModel("");
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        make: value,
        model: "",
      },
    }));
  };

  const handleModelSelect = (value) => {
    if (value === "__custom__") {
      setShowCustomModelInput(true);
      setCustomModel(selectedModel || "");
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          model: "",
        },
      }));
      return;
    }

    setShowCustomModelInput(false);
    setCustomModel("");
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        model: value,
      },
    }));
  };

  const addCustomMake = () => {
    const make = customMake.trim().toUpperCase();
    if (!make) return;

    setMakeOptions((prev) => (prev.includes(make) ? prev : [...prev, make]));
    setModelOptionsByMake((prev) =>
      prev[make] ? prev : { ...prev, [make]: [] }
    );
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        make,
        model: "",
      },
    }));
    setShowCustomMakeInput(false);
    setCustomMake("");
    setShowCustomModelInput(false);
    setCustomModel("");
  };

  const addCustomModel = () => {
    const model = customModel.trim();
    if (!model || !selectedMake) return;

    setModelOptionsByMake((prev) => {
      const existingModels = prev[selectedMake] || [];
      if (existingModels.includes(model)) {
        return prev;
      }

      return {
        ...prev,
        [selectedMake]: [...existingModels, model],
      };
    });

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        model,
      },
    }));
    setShowCustomModelInput(false);
    setCustomModel("");
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Make *</label>
                <select
                  required
                  value={makeSelectValue}
                  onChange={(e) => handleMakeSelect(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">Select a make</option>
                  {makeOptions.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                  <option value="__custom__">+ Add custom make</option>
                </select>
                {showCustomMakeInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={customMake}
                      onChange={(e) => setCustomMake(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Type a new make"
                    />
                    <button
                      type="button"
                      onClick={addCustomMake}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model *</label>
                <select
                  required
                  value={modelSelectValue}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">Select a model</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                  <option value="__custom__">+ Add custom model</option>
                </select>
                {showCustomModelInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Type a new model"
                    />
                    <button
                      type="button"
                      onClick={addCustomModel}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
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
                <label className="block text-sm font-medium mb-2">Body Type *</label>
                <select
                  required
                  value={formData.specifications.bodyType}
                  onChange={(e) => handleNestedChange("specifications", "bodyType", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                >
                  {VEHICLE_BODY_TYPES.map((bodyType) => (
                    <option key={bodyType} value={bodyType}>
                      {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}
                    </option>
                  ))}
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
