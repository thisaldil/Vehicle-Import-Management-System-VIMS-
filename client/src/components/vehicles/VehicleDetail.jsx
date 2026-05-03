import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText } from "lucide-react";
import api from "../../utils/axios";
import VehicleTimeline from "./VehicleTimeline";

const stageLabels = {
  shipment: "Shipment",
  customs: "Customs Clearance",
  rmv_registration: "RMV Registration",
  delivery: "Delivery"
};

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/vehicles/${vehicleId}`);
      setVehicle(res.data.vehicle);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (stage, newStatus) => {
    try {
      setSaving(true);
      const res = await api.patch(`/api/vehicles/${vehicleId}/status`, {
        stage,
        status: newStatus
      });
      setVehicle(res.data.vehicle);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!vehicle) return <div className="text-center py-8">Vehicle not found</div>;

  const currentStageData = vehicle.status.stages[vehicle.status.currentStage];

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/vehicles")}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {vehicle.specifications.year} {vehicle.specifications.make} {vehicle.specifications.model}
        </h1>
        <p className="text-gray-500">VIN: {vehicle.specifications.vin}</p>
        <p className="text-sm text-gray-400 mt-1">ID: {vehicle._id}</p>
      </div>

      <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
        {["details", "timeline", "stages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Specifications</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Make</label>
                <p className="font-medium">{vehicle.specifications.make}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Model</label>
                <p className="font-medium">{vehicle.specifications.model}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Year</label>
                <p className="font-medium">{vehicle.specifications.year}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Engine CC</label>
                <p className="font-medium">{vehicle.specifications.engineCC}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Fuel Type</label>
                <p className="font-medium">{vehicle.specifications.fuelType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Color</label>
                <p className="font-medium">{vehicle.specifications.color}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4">Purchase Info</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Purchase Date</label>
                <p className="font-medium">
                  {new Date(vehicle.purchaseInfo.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Purchase Price</label>
                <p className="font-medium">
                  {vehicle.purchaseInfo.currency} {vehicle.purchaseInfo.purchasePrice}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Supplier</label>
                <p className="font-medium">{vehicle.purchaseInfo.supplier}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Import Country</label>
                <p className="font-medium">{vehicle.purchaseInfo.importCountry}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "timeline" && <VehicleTimeline vehicle={vehicle} />}

      {activeTab === "stages" && (
        <div className="space-y-4">
          {Object.entries(stageLabels).map(([stageKey, stageLabel]) => {
            const stageData = vehicle.status.stages[stageKey];
            const stageStatusOptions = {
              shipment: ["pending", "in_transit", "completed", "delayed"],
              customs: ["pending", "under_clearance", "cleared", "on_hold", "rejected"],
              rmv_registration: ["pending", "in_progress", "completed", "rejected", "resubmission_needed"],
              delivery: ["pending", "ready", "scheduled", "in_transit", "delivered", "cancelled"]
            };
            
            return (
              <div key={stageKey} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{stageLabel}</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    stageData.status === "completed" || stageData.status === "cleared" || stageData.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : stageData.status === "in_transit" || stageData.status === "under_clearance" || stageData.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {stageData.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  {stageData.startDate && (
                    <p><span className="text-gray-500">Start Date:</span> {new Date(stageData.startDate).toLocaleDateString()}</p>
                  )}
                  {stageKey === "shipment" && stageData.estimatedArrival && (
                    <p><span className="text-gray-500">Est. Arrival:</span> {new Date(stageData.estimatedArrival).toLocaleDateString()}</p>
                  )}
                  {stageKey === "customs" && stageData.estimatedClearanceDate && (
                    <p><span className="text-gray-500">Est. Clearance:</span> {new Date(stageData.estimatedClearanceDate).toLocaleDateString()}</p>
                  )}
                  {stageKey === "rmv_registration" && stageData.estimatedCompletionDate && (
                    <p><span className="text-gray-500">Est. Completion:</span> {new Date(stageData.estimatedCompletionDate).toLocaleDateString()}</p>
                  )}
                  {stageKey === "delivery" && stageData.scheduledDeliveryDate && (
                    <p><span className="text-gray-500">Scheduled Delivery:</span> {new Date(stageData.scheduledDeliveryDate).toLocaleDateString()}</p>
                  )}
                </div>
                <select
                  value={stageData.status}
                  onChange={(e) => handleStatusUpdate(stageKey, e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 mb-2"
                >
                  <option value="">-- Select Status --</option>
                  {(stageStatusOptions[stageKey] || []).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
