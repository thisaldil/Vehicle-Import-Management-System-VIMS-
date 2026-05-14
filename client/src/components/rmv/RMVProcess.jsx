import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const RMVProcess = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const cloudinaryCloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Main state
  const [currentStep, setCurrentStep] = useState(1);
  const [rmvData, setRmvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Documents
  const [documents, setDocuments] = useState({
    title: null,
    proofOfInsurance: null,
    governmentId: null,
    billOfSale: null,
    addressProof: null,
    customsClearance: null,
    vehiclePhotos: [],
  });

  // Step 2: Fees
  const [vehicleValue, setVehicleValue] = useState("");
  const [vehicleWeight, setVehicleWeight] = useState("");
  const [vehicleAge, setVehicleAge] = useState("");
  const [calculatedFees, setCalculatedFees] = useState(null);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentConfirmation, setPaymentConfirmation] = useState("");

  // Step 4: Inspection
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState("");
  const [inspectionCenter, setInspectionCenter] = useState("");

  // Step 5: Inspection Results
  const [inspectionResults, setInspectionResults] = useState({
    safetyCheckPassed: true,
    emissionsTestPassed: true,
    odometer: "",
    inspectionReportUrl: "",
    inspectionNotes: "",
  });

  // Step 6: Application Review
  const [registrationOffice, setRegistrationOffice] = useState("");

  // Step 7: Registration
  const [registrationInfo, setRegistrationInfo] = useState(null);

  // Guide state
  const [showGuide, setShowGuide] = useState(false);

  // ========== INITIALIZE ==========
  useEffect(() => {
    fetchRMVData();
  }, [vehicleId]);

  const fetchRMVData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rmv/${vehicleId}`);
      setRmvData(response.data.data);
    } catch (err) {
      console.error("Error fetching RMV data:", err);
      setError("Failed to load RMV registration data");
    } finally {
      setLoading(false);
    }
  };

  // ========== CLOUDINARY UPLOAD ==========
  const uploadToCloudinary = async (file) => {
    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      throw new Error("Cloudinary configuration missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryUploadPreset);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`, formData);
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw new Error("Failed to upload file");
    }
  };

  // ========== STEP 1: UPLOAD DOCUMENTS ==========
  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileUrl = await uploadToCloudinary(file);

      const uploadResponse = await axios.post("/api/rmv/document/upload", {
        vehicleId,
        documentType: docType,
        fileName: file.name,
        fileUrl,
        description: `${docType} uploaded by user`,
      });

      setRmvData(uploadResponse.data.data);
      setDocuments((prev) => ({
        ...prev,
        [docType]: { fileName: file.name, fileUrl },
      }));

      setSuccessMessage(`${docType} uploaded successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVehiclePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);
      for (const file of files) {
        const fileUrl = await uploadToCloudinary(file);

        const uploadResponse = await axios.post("/api/rmv/document/upload", {
          vehicleId,
          documentType: "vehiclePhotos",
          fileName: file.name,
          fileUrl,
          description: "Vehicle photo",
        });

        setRmvData(uploadResponse.data.data);
      }

      setSuccessMessage("Vehicle photos uploaded successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Photo upload error:", err);
      setError(err.response?.data?.error || "Photo upload failed");
    } finally {
      setLoading(false);
    }
  };

  const proceedToFees = () => {
    // Check if all required documents are uploaded
    const requiredDocs = [
      "title",
      "proofOfInsurance",
      "governmentId",
      "billOfSale",
      "addressProof",
      "customsClearance",
    ];
    const allUploaded = requiredDocs.every((doc) => rmvData?.documents?.[doc]?.fileUrl);

    if (!allUploaded) {
      setError("Please upload all required documents");
      return;
    }

    setCurrentStep(2);
    setError(null);
  };

  // ========== STEP 2: CALCULATE FEES ==========
  const handleCalculateFees = async () => {
    if (!vehicleValue || !vehicleWeight || !vehicleAge) {
      setError("Please fill in all vehicle information");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/rmv/fees/calculate", {
        vehicleId,
        vehicleValue: parseFloat(vehicleValue),
        vehicleWeight: parseFloat(vehicleWeight),
        vehicleAge: parseInt(vehicleAge),
      });

      setCalculatedFees(response.data.data.fees);
      setRmvData(response.data.data.rmvRegistration);
      setSuccessMessage("Fees calculated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Fee calculation error:", err);
      setError(err.response?.data?.error || "Failed to calculate fees");
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (!calculatedFees) {
      setError("Please calculate fees first");
      return;
    }
    setCurrentStep(3);
    setError(null);
  };

  // ========== STEP 3: PROCESS PAYMENT ==========
  const handleProcessPayment = async () => {
    if (!paymentConfirmation) {
      setError("Please upload payment confirmation");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/rmv/payment/process", {
        vehicleId,
        paymentMethod,
        paymentConfirmationUrl: paymentConfirmation,
      });

      setRmvData(response.data.data);
      setSuccessMessage("Payment processed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setCurrentStep(4);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.error || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmationUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileUrl = await uploadToCloudinary(file);
      setPaymentConfirmation(fileUrl);
      setSuccessMessage("Payment confirmation uploaded");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload payment confirmation");
    } finally {
      setLoading(false);
    }
  };

  // ========== STEP 4: BOOK INSPECTION ==========
  const handleBookInspection = async () => {
    if (!inspectionDate || !inspectionLocation) {
      setError("Please fill in inspection details");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/rmv/inspection/book", {
        vehicleId,
        inspectionDate,
        inspectionLocation,
        inspectionCenter,
      });

      setRmvData(response.data.data);
      setSuccessMessage("Inspection scheduled successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setCurrentStep(5);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.error || "Failed to book inspection");
    } finally {
      setLoading(false);
    }
  };

  // ========== STEP 5: INSPECTION RESULTS ==========
  const handleSubmitInspectionResults = async () => {
    if (!inspectionResults.odometer || !inspectionResults.inspectionReportUrl) {
      setError("Please complete all inspection fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/rmv/inspection/results", {
        vehicleId,
        ...inspectionResults,
      });

      setRmvData(response.data.data);
      setSuccessMessage("Inspection results submitted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setCurrentStep(6);
    } catch (err) {
      console.error("Inspection submission error:", err);
      setError(err.response?.data?.error || "Failed to submit inspection results");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectionReportUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileUrl = await uploadToCloudinary(file);
      setInspectionResults((prev) => ({
        ...prev,
        inspectionReportUrl: fileUrl,
      }));
      setSuccessMessage("Inspection report uploaded");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload inspection report");
    } finally {
      setLoading(false);
    }
  };

  // ========== STEP 6: SUBMIT APPLICATION ==========
  const handleSubmitApplication = async () => {
    if (!registrationOffice) {
      setError("Please select registration office");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/rmv/application/submit", {
        vehicleId,
        registrationOffice,
      });

      setRmvData(response.data.data);
      setSuccessMessage("Application submitted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setCurrentStep(7);
    } catch (err) {
      console.error("Application submission error:", err);
      setError(err.response?.data?.error || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  // ========== UI COMPONENTS ==========
  const DocumentUploadField = ({ label, docType }) => {
    const isUploaded = rmvData?.documents?.[docType]?.fileUrl;

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => handleDocumentUpload(e, docType)}
          disabled={loading}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
        />
        {isUploaded && (
          <div className="mt-2 text-green-600 dark:text-green-400 flex items-center">
            <span className="mr-2">✓</span>
            <a href={isUploaded} target="_blank" rel="noopener noreferrer" className="underline">
              View uploaded file
            </a>
          </div>
        )}
      </div>
    );
  };

  const StepIndicator = () => (
    <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        {[
          "Documents",
          "Fees",
          "Payment",
          "Inspection",
          "Results",
          "Application",
          "Complete",
        ].map((label, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center ${idx + 1 <= currentStep ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                idx + 1 <= currentStep
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-xs text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Main render
  if (loading && !rmvData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading RMV registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vehicle Registration Process
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete all steps to register your imported vehicle
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator />

        {/* Step 1: Upload Documents */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 1: Upload Required Documents</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <DocumentUploadField label="Vehicle Title/Ownership Certificate" docType="title" />
              <DocumentUploadField label="Proof of Insurance" docType="proofOfInsurance" />
              <DocumentUploadField label="Government-issued ID" docType="governmentId" />
              <DocumentUploadField label="Bill of Sale" docType="billOfSale" />
              <DocumentUploadField label="Address Proof (Utility Bill)" docType="addressProof" />
              <DocumentUploadField label="Customs Clearance" docType="customsClearance" />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Photos</label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleVehiclePhotoUpload}
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Upload multiple photos from different angles</p>
            </div>

            <button
              onClick={proceedToFees}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              Proceed to Fees
            </button>
          </div>
        )}

        {/* Step 2: Calculate Fees */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 2: Fee Calculation</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Value ($)
                </label>
                <input
                  type="number"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Weight (lbs)
                </label>
                <input
                  type="number"
                  value={vehicleWeight}
                  onChange={(e) => setVehicleWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 3500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Age (years)
                </label>
                <input
                  type="number"
                  value={vehicleAge}
                  onChange={(e) => setVehicleAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            {calculatedFees && (
              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Registration Fee</span>
                    <span>${calculatedFees.registrationFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Title Transfer Fee</span>
                    <span>${calculatedFees.titleTransferFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Inspection Fee</span>
                    <span>${calculatedFees.inspectionFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Sales Tax (6%)</span>
                    <span>${calculatedFees.salesTax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Weight-based Fee</span>
                    <span>${calculatedFees.weightBasedFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Age-based Fee</span>
                    <span>${calculatedFees.ageBasedFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Environmental Fee</span>
                    <span>${calculatedFees.environmentalFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Processing Fee</span>
                    <span>${calculatedFees.processingFee?.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total Fees</span>
                    <span>${calculatedFees.totalFees?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleCalculateFees}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
              >
                {loading ? "Calculating..." : "Calculate Fees"}
              </button>
              <button
                onClick={proceedToPayment}
                disabled={loading || !calculatedFees}
                className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Process Payment */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 3: Payment</h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
              <p className="text-blue-900 dark:text-blue-200">
                Total Amount Due: <span className="font-bold text-lg">${calculatedFees?.totalFees?.toFixed(2)}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Confirmation/Receipt
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handlePaymentConfirmationUpload}
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              />
              {paymentConfirmation && (
                <div className="mt-2 text-green-600 dark:text-green-400">✓ Receipt uploaded</div>
              )}
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={loading || !paymentConfirmation}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        )}

        {/* Step 4: Book Inspection */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 4: Schedule Inspection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inspection Date
                </label>
                <input
                  type="datetime-local"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inspection Location
                </label>
                <input
                  type="text"
                  value={inspectionLocation}
                  onChange={(e) => setInspectionLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., State DMV Office"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inspection Center
              </label>
              <input
                type="text"
                value={inspectionCenter}
                onChange={(e) => setInspectionCenter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Main Street DMV"
              />
            </div>

            <button
              onClick={handleBookInspection}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Booking..." : "Book Inspection"}
            </button>
          </div>
        )}

        {/* Step 5: Submit Inspection Results */}
        {currentStep === 5 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 5: Inspection Results</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={inspectionResults.safetyCheckPassed}
                  onChange={(e) =>
                    setInspectionResults((prev) => ({
                      ...prev,
                      safetyCheckPassed: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-gray-600 rounded"
                />
                <label className="ml-3 text-gray-700 dark:text-gray-300">Safety Check Passed</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={inspectionResults.emissionsTestPassed}
                  onChange={(e) =>
                    setInspectionResults((prev) => ({
                      ...prev,
                      emissionsTestPassed: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-gray-600 rounded"
                />
                <label className="ml-3 text-gray-700 dark:text-gray-300">Emissions Test Passed</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Odometer Reading (miles)
                </label>
                <input
                  type="number"
                  value={inspectionResults.odometer}
                  onChange={(e) =>
                    setInspectionResults((prev) => ({
                      ...prev,
                      odometer: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inspection Report
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleInspectionReportUpload}
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                />
                {inspectionResults.inspectionReportUrl && (
                  <div className="mt-2 text-green-600 dark:text-green-400">✓ Report uploaded</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={inspectionResults.inspectionNotes}
                  onChange={(e) =>
                    setInspectionResults((prev) => ({
                      ...prev,
                      inspectionNotes: e.target.value,
                    }))
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Any additional inspection notes..."
                />
              </div>
            </div>

            <button
              onClick={handleSubmitInspectionResults}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Submitting..." : "Submit Results"}
            </button>
          </div>
        )}

        {/* Step 6: Submit Application */}
        {currentStep === 6 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 6: Submit Application</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Registration Office
              </label>
              <select
                value={registrationOffice}
                onChange={(e) => setRegistrationOffice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select an office</option>
                <option value="main_office">Main DMV Office</option>
                <option value="branch_1">Branch Office 1</option>
                <option value="branch_2">Branch Office 2</option>
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Application Summary</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Your application will be submitted for review. The RMV office will process your application and notify
                you of the status within 5-7 business days.
              </p>
            </div>

            <button
              onClick={handleSubmitApplication}
              disabled={loading || !registrationOffice}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        )}

        {/* Step 7: Complete */}
        {currentStep === 7 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your vehicle registration application has been successfully submitted to the RMV office.
            </p>

            {rmvData?.application && (
              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Application Number:</span> {rmvData.application.applicationNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Submitted Date:</span>{" "}
                  {new Date(rmvData.application.submissionDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Estimated Completion:</span>{" "}
                  {new Date(rmvData.application.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We will notify you via email and SMS when your registration is approved and your documents are ready for pickup.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/vehicles")}
                className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              >
                Back to Vehicles
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                Print Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RMVProcess;
