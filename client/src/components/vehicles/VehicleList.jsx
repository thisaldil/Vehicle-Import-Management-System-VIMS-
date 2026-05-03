import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Trash2 } from "lucide-react";
import api from "../../utils/axios";

const stageColors = {
  shipment: "bg-blue-100 text-blue-800",
  customs: "bg-yellow-100 text-yellow-800",
  rmv_registration: "bg-purple-100 text-purple-800",
  delivery: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800"
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ stage: "", search: "" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, [page, filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(filters.stage && { status: filters.stage }),
        ...(filters.search && { search: filters.search })
      };
      const res = await api.get("/api/vehicles", { params });
      setVehicles(res.data.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/api/vehicles/${vehicleId}`);
      fetchVehicles();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <button
          onClick={() => navigate("/dashboard/vehicles/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> New Vehicle
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by VIN, make, or model..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
        />
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">All Stages</option>
          <option value="shipment">Shipment</option>
          <option value="customs">Customs</option>
          <option value="rmv_registration">RMV Registration</option>
          <option value="delivery">Delivery</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No vehicles found</p>
        </div>
      ) : (
        <div>
          <div className="grid gap-4 mb-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {vehicle.specifications?.year} {vehicle.specifications?.make} {vehicle.specifications?.model}
                    </h3>
                    <p className="text-sm text-gray-500">VIN: {vehicle.specifications?.vin || "N/A"}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${stageColors[vehicle.status?.currentStage] || "bg-gray-100"}`}>
                        {vehicle.status?.currentStage || "unknown"}
                      </span>
                      <span className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-800">
                        {vehicle.customerInfo?.customerName || "Unknown Customer"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/vehicles/${vehicle._id}`);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(vehicle._id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
