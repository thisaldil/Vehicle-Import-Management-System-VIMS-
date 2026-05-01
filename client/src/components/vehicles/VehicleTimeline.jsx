import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function VehicleTimeline({ vehicle }) {
  const getEventIcon = (type) => {
    if (type === "status_update") return "✓";
    if (type === "document_upload") return "📄";
    if (type === "note_added") return "📝";
    return "○";
  };

  const getEventColor = (stage) => {
    const colors = {
      shipment: "border-blue-500 bg-blue-50 dark:bg-blue-900",
      customs: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900",
      rmv_registration: "border-purple-500 bg-purple-50 dark:bg-purple-900",
      delivery: "border-green-500 bg-green-50 dark:bg-green-900"
    };
    return colors[stage] || "border-gray-500 bg-gray-50 dark:bg-gray-900";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-xl font-bold mb-6">Activity Timeline</h3>

      {vehicle.events && vehicle.events.length > 0 ? (
        <div className="space-y-4">
          {[...vehicle.events].reverse().map((event, idx) => (
            <div
              key={idx}
              className={`border-l-4 p-4 rounded ${getEventColor(event.stage)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <p className="text-sm mt-1">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="ml-4 text-lg">{getEventIcon(event.type)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No activities yet
        </div>
      )}

      {vehicle.statusHistory && vehicle.statusHistory.length > 0 && (
        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <h4 className="font-bold mb-4">Status History</h4>
          <div className="space-y-2 text-sm">
            {[...vehicle.statusHistory].reverse().slice(0, 10).map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span>
                  <span className="font-medium">{entry.stage}</span>: {entry.previousStatus} → {entry.newStatus}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(entry.changedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
