import React, { useState, useEffect } from "react";
import axios from "axios";

const RMVStatusTimeline = ({ vehicleId }) => {
  const [rmvStatus, setRmvStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRMVStatus();
  }, [vehicleId]);

  const fetchRMVStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rmv/${vehicleId}/status`);
      setRmvStatus(response.data.data);
    } catch (err) {
      console.error("Error fetching RMV status:", err);
      setError("Failed to load RMV status");
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step) => {
    const icons = {
      documents_upload: "📄",
      payment_pending: "💳",
      inspection_booking: "🔍",
      inspection_completed: "✓",
      application_submitted: "📤",
      registration_approved: "🎉",
    };
    return icons[step] || "•";
  };

  const getStepLabel = (step) => {
    const labels = {
      documents_upload: "Documents Upload",
      payment_pending: "Payment",
      inspection_booking: "Inspection Booking",
      inspection_completed: "Inspection Results",
      application_submitted: "Application Submitted",
      registration_approved: "Registration Approved",
    };
    return labels[step] || step;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700",
      pending: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
      in_progress: "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
      failed: "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700",
    };
    return colors[status] || colors.pending;
  };

  const getStatusTextColor = (status) => {
    const colors = {
      completed: "text-green-800 dark:text-green-300",
      pending: "text-yellow-800 dark:text-yellow-300",
      in_progress: "text-blue-800 dark:text-blue-300",
      failed: "text-red-800 dark:text-red-300",
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!rmvStatus) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-500 dark:text-gray-400">No RMV registration found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registration Status</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Step: {getStepLabel(rmvStatus.currentStep)}</p>
      </div>

      {/* Validations Summary */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${rmvStatus.validations?.documentsComplete ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}>
            <div className="text-2xl mb-1">{rmvStatus.validations?.documentsComplete ? "✓" : "○"}</div>
            <p className={`text-sm font-medium ${rmvStatus.validations?.documentsComplete ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
              Documents
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${rmvStatus.validations?.feesPaid ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}>
            <div className="text-2xl mb-1">{rmvStatus.validations?.feesPaid ? "✓" : "○"}</div>
            <p className={`text-sm font-medium ${rmvStatus.validations?.feesPaid ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
              Fees Paid
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${rmvStatus.validations?.inspectionPassed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}>
            <div className="text-2xl mb-1">{rmvStatus.validations?.inspectionPassed ? "✓" : "○"}</div>
            <p className={`text-sm font-medium ${rmvStatus.validations?.inspectionPassed ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
              Inspection
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${rmvStatus.validations?.applicationSubmitted ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}>
            <div className="text-2xl mb-1">{rmvStatus.validations?.applicationSubmitted ? "✓" : "○"}</div>
            <p className={`text-sm font-medium ${rmvStatus.validations?.applicationSubmitted ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
              Application
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${rmvStatus.validations?.finalApproved ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}>
            <div className="text-2xl mb-1">{rmvStatus.validations?.finalApproved ? "✓" : "○"}</div>
            <p className={`text-sm font-medium ${rmvStatus.validations?.finalApproved ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
              Approved
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Timeline</h3>
        <div className="space-y-6">
          {rmvStatus.timeline && rmvStatus.timeline.length > 0 ? (
            rmvStatus.timeline.map((entry, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      entry.status === "completed"
                        ? "bg-green-500 text-white"
                        : entry.status === "in_progress"
                          ? "bg-blue-500 text-white"
                          : entry.status === "failed"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {entry.status === "completed" ? "✓" : entry.status === "failed" ? "✗" : "•"}
                  </div>
                  {idx < rmvStatus.timeline.length - 1 && (
                    <div className="w-1 h-12 bg-gray-200 dark:bg-gray-700 my-2"></div>
                  )}
                </div>

                {/* Timeline content */}
                <div className="flex-1 pb-2">
                  <div className={`p-4 rounded-lg border ${getStatusColor(entry.status)}`}>
                    <p className={`font-semibold ${getStatusTextColor(entry.status)}`}>{entry.action}</p>
                    <p className={`text-sm mt-1 ${getStatusTextColor(entry.status)}`}>
                      {getStepLabel(entry.step)}
                    </p>
                    {entry.notes && (
                      <p className={`text-sm mt-2 ${getStatusTextColor(entry.status)}`}>
                        <span className="font-medium">Note:</span> {entry.notes}
                      </p>
                    )}
                    <p className={`text-xs mt-2 opacity-75 ${getStatusTextColor(entry.status)}`}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No timeline events yet</p>
          )}
        </div>
      </div>

      {/* Fee Information */}
      {rmvStatus.fees && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Fee Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {rmvStatus.fees.totalFees && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Fees</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${rmvStatus.fees.totalFees.toFixed(2)}
                </p>
              </div>
            )}
            {rmvStatus.fees.paymentStatus && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{rmvStatus.fees.paymentStatus}</p>
              </div>
            )}
            {rmvStatus.fees.paymentMethod && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{rmvStatus.fees.paymentMethod.replace(/_/g, " ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inspection Information */}
      {rmvStatus.inspection && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Inspection Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{rmvStatus.inspection.status}</p>
            </div>
            {rmvStatus.inspection.scheduledDate && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Scheduled Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(rmvStatus.inspection.scheduledDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {rmvStatus.inspection.odometer && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Odometer</p>
                <p className="font-semibold text-gray-900 dark:text-white">{rmvStatus.inspection.odometer} miles</p>
              </div>
            )}
            <div>
              <p className="text-gray-600 dark:text-gray-400">Safety Check</p>
              <p className={`font-semibold ${rmvStatus.inspection.safetyCheckPassed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {rmvStatus.inspection.safetyCheckPassed ? "Passed" : "Failed"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Emissions Test</p>
              <p className={`font-semibold ${rmvStatus.inspection.emissionsTestPassed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {rmvStatus.inspection.emissionsTestPassed ? "Passed" : "Failed"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Information */}
      {rmvStatus.application && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Application Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Application Number</p>
              <p className="font-mono text-gray-900 dark:text-white text-xs">{rmvStatus.application.applicationNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{rmvStatus.application.applicationStatus}</p>
            </div>
            {rmvStatus.application.submissionDate && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Submission Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(rmvStatus.application.submissionDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {rmvStatus.application.estimatedCompletionDate && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Estimated Completion</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(rmvStatus.application.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registration Information */}
      {rmvStatus.registration && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/10">
          <h3 className="font-semibold text-green-900 dark:text-green-200 mb-4">Registration Approved!</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700 dark:text-green-300">Registration Number</p>
              <p className="font-semibold text-green-900 dark:text-green-200">{rmvStatus.registration.registrationNumber}</p>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300">Plate Number</p>
              <p className="font-semibold text-green-900 dark:text-green-200">{rmvStatus.registration.plateNumber}</p>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300">Valid From</p>
              <p className="font-semibold text-green-900 dark:text-green-200">
                {new Date(rmvStatus.registration.validFrom).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300">Valid Until</p>
              <p className="font-semibold text-green-900 dark:text-green-200">
                {new Date(rmvStatus.registration.validUntil).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RMVStatusTimeline;
