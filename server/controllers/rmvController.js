const RMVRegistration = require("../models/RMVRegistration");
const Vehicle = require("../models/Vehicle");
const Customer = require("../models/Customer");

// ========== CREATE RMV REGISTRATION ==========
exports.createRMVRegistration = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    // Verify vehicle exists and belongs to user
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Check if RMV registration already exists
    const existingRMV = await RMVRegistration.findOne({ vehicleId });
    if (existingRMV) {
      return res.status(400).json({ error: "RMV registration already exists for this vehicle" });
    }

    const rmvRegistration = new RMVRegistration({
      vehicleId,
      customerId: vehicle.customerId,
      userId: req.userId,
      timeline: [
        {
          step: "documents_upload",
          action: "RMV registration initiated",
          status: "started",
          timestamp: new Date(),
          performedBy: req.userId,
        },
      ],
    });

    await rmvRegistration.save();

    res.status(201).json({
      success: true,
      message: "RMV registration started",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Create RMV registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== GET RMV REGISTRATION ==========
exports.getRMVRegistration = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId })
      .populate("customerId", "name email phone")
      .populate("userId", "name email");

    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    res.json({ success: true, data: rmvRegistration });
  } catch (err) {
    console.error("Get RMV registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== UPLOAD DOCUMENTS ==========
exports.uploadDocument = async (req, res) => {
  try {
    const { vehicleId, documentType, fileUrl, fileName, description } = req.body;

    if (!documentType || !fileUrl) {
      return res.status(400).json({ error: "Document type and file URL required" });
    }

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    // Handle different document types
    if (
      ["title", "proofOfInsurance", "governmentId", "billOfSale", "addressProof", "customsClearance"].includes(
        documentType
      )
    ) {
      rmvRegistration.documents[documentType] = {
        fileName,
        fileUrl,
        uploadedAt: new Date(),
        status: "pending",
      };
    } else if (documentType === "vehiclePhotos") {
      if (!rmvRegistration.documents.vehiclePhotos) {
        rmvRegistration.documents.vehiclePhotos = [];
      }
      rmvRegistration.documents.vehiclePhotos.push({
        fileName,
        fileUrl,
        uploadedAt: new Date(),
        description,
      });
    } else if (documentType === "additionalDocuments") {
      if (!rmvRegistration.documents.additionalDocuments) {
        rmvRegistration.documents.additionalDocuments = [];
      }
      rmvRegistration.documents.additionalDocuments.push({
        name: description,
        fileName,
        fileUrl,
        uploadedAt: new Date(),
        description,
      });
    }

    // Add timeline entry
    rmvRegistration.timeline.push({
      step: "documents_upload",
      action: `${documentType} uploaded`,
      status: "in_progress",
      timestamp: new Date(),
      notes: fileName,
      performedBy: req.userId,
    });

    // Check if all required documents are uploaded
    const requiredDocs = [
      "title",
      "proofOfInsurance",
      "governmentId",
      "billOfSale",
      "addressProof",
      "customsClearance",
    ];
    const allDocumentsUploaded = requiredDocs.every((doc) => rmvRegistration.documents[doc]?.fileUrl);

    if (allDocumentsUploaded) {
      rmvRegistration.validations.documentsComplete = true;
    }

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Document uploaded successfully",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Upload document error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== BOOK INSPECTION ==========
exports.bookInspection = async (req, res) => {
  try {
    const { vehicleId, inspectionDate, inspectionLocation, inspectionCenter } = req.body;

    if (!inspectionDate || !inspectionLocation) {
      return res.status(400).json({ error: "Inspection date and location required" });
    }

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    // Check if documents are complete
    if (!rmvRegistration.validations.documentsComplete) {
      return res.status(400).json({ error: "All required documents must be uploaded first" });
    }

    rmvRegistration.inspection = {
      status: "scheduled",
      scheduledDate: new Date(inspectionDate),
      scheduledLocation: inspectionLocation,
      inspectionCenter,
    };

    rmvRegistration.currentStep = "inspection_booking";

    rmvRegistration.timeline.push({
      step: "inspection_booking",
      action: "Inspection scheduled",
      status: "scheduled",
      timestamp: new Date(),
      notes: `Scheduled for ${inspectionDate}`,
      performedBy: req.userId,
    });

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Inspection scheduled successfully",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Book inspection error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== SUBMIT INSPECTION RESULTS ==========
exports.submitInspectionResults = async (req, res) => {
  try {
    const {
      vehicleId,
      safetyCheckPassed,
      emissionsTestPassed,
      odometer,
      inspectionReportUrl,
      odometherProofUrl,
      inspectionNotes,
    } = req.body;

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    rmvRegistration.inspection.completedDate = new Date();
    rmvRegistration.inspection.safetyCheckPassed = safetyCheckPassed;
    rmvRegistration.inspection.emissionsTestPassed = emissionsTestPassed;
    rmvRegistration.inspection.odometer = odometer;
    rmvRegistration.inspection.inspectionReportUrl = inspectionReportUrl;
    rmvRegistration.inspection.odometherProofUrl = odometherProofUrl;
    rmvRegistration.inspection.inspectionNotes = inspectionNotes;

    if (safetyCheckPassed && emissionsTestPassed) {
      rmvRegistration.inspection.status = "passed";
      rmvRegistration.validations.inspectionPassed = true;
      rmvRegistration.currentStep = "inspection_completed";
    } else {
      rmvRegistration.inspection.status = "failed";
      rmvRegistration.inspection.failureReasons = [];
      if (!safetyCheckPassed) rmvRegistration.inspection.failureReasons.push("Safety check failed");
      if (!emissionsTestPassed) rmvRegistration.inspection.failureReasons.push("Emissions test failed");
    }

    rmvRegistration.timeline.push({
      step: "inspection_completed",
      action: `Inspection ${rmvRegistration.inspection.status}`,
      status: rmvRegistration.inspection.status,
      timestamp: new Date(),
      notes: inspectionNotes,
      performedBy: req.userId,
    });

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Inspection results submitted",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Submit inspection results error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== CALCULATE FEES ==========
exports.calculateFees = async (req, res) => {
  try {
    const { vehicleId, vehicleValue, vehicleWeight, vehicleAge } = req.body;

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    // Base fees (adjust based on your jurisdiction)
    const fees = {
      registrationFee: 150,
      titleTransferFee: 75,
      inspectionFee: 50,
      salesTax: (vehicleValue || 0) * 0.06, // 6% sales tax
      weightBasedFee: (vehicleWeight || 0) * 0.5, // $0.50 per pound
      ageBasedFee: vehicleAge > 10 ? 25 : 0,
      environmentalFee: 25,
      processingFee: 35,
    };

    fees.totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0);

    rmvRegistration.fees = fees;
    rmvRegistration.currentStep = "payment_pending";

    rmvRegistration.timeline.push({
      step: "payment_pending",
      action: "Fees calculated",
      status: "pending",
      timestamp: new Date(),
      notes: `Total fees: $${fees.totalFees.toFixed(2)}`,
      performedBy: req.userId,
    });

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Fees calculated",
      data: {
        fees,
        rmvRegistration,
      },
    });
  } catch (err) {
    console.error("Calculate fees error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== PROCESS PAYMENT ==========
exports.processPayment = async (req, res) => {
  try {
    const { vehicleId, paymentMethod, paymentConfirmationUrl } = req.body;

    if (!paymentMethod || !paymentConfirmationUrl) {
      return res.status(400).json({ error: "Payment method and confirmation required" });
    }

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    rmvRegistration.fees.paymentStatus = "completed";
    rmvRegistration.fees.paymentMethod = paymentMethod;
    rmvRegistration.fees.paymentDate = new Date();
    rmvRegistration.fees.paymentConfirmationUrl = paymentConfirmationUrl;

    rmvRegistration.validations.feesPaid = true;

    rmvRegistration.timeline.push({
      step: "payment_pending",
      action: "Payment processed",
      status: "completed",
      timestamp: new Date(),
      notes: `Payment via ${paymentMethod}`,
      performedBy: req.userId,
    });

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Payment processed successfully",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Process payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== SUBMIT APPLICATION ==========
exports.submitApplication = async (req, res) => {
  try {
    const { vehicleId, registrationOffice } = req.body;

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    // Verify all prerequisites are met
    if (!rmvRegistration.validations.documentsComplete) {
      return res.status(400).json({ error: "All documents must be verified" });
    }
    if (!rmvRegistration.validations.inspectionPassed) {
      return res.status(400).json({ error: "Vehicle inspection must pass" });
    }
    if (!rmvRegistration.validations.feesPaid) {
      return res.status(400).json({ error: "Fees must be paid" });
    }

    rmvRegistration.application = {
      applicationNumber: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      submissionDate: new Date(),
      registrationOffice,
      estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      applicationStatus: "submitted",
    };

    rmvRegistration.currentStep = "application_submitted";
    rmvRegistration.validations.applicationSubmitted = true;

    rmvRegistration.timeline.push({
      step: "application_submitted",
      action: "Application submitted",
      status: "submitted",
      timestamp: new Date(),
      notes: rmvRegistration.application.applicationNumber,
      performedBy: req.userId,
    });

    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Application submitted successfully",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Submit application error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== APPROVE REGISTRATION ==========
exports.approveRegistration = async (req, res) => {
  try {
    const { vehicleId, registrationNumber, plateNumber, plateImageUrl } = req.body;

    if (!registrationNumber || !plateNumber) {
      return res.status(400).json({ error: "Registration number and plate number required" });
    }

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId });
    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    rmvRegistration.application.applicationStatus = "approved";
    rmvRegistration.application.approvalDate = new Date();

    rmvRegistration.registration = {
      registrationNumber,
      registrationCertificateUrl: `https://example.com/cert/${registrationNumber}`, // Update with real URL
      plateNumber,
      plateImageUrl,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      renewalDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    rmvRegistration.renewal = {
      lastRenewalDate: new Date(),
      nextRenewalDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      renewalStatus: "pending",
    };

    rmvRegistration.currentStep = "registration_approved";
    rmvRegistration.validations.finalApproved = true;

    // Update vehicle with registration info
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle) {
      vehicle.status.stages.rmv_registration.status = "completed";
      vehicle.status.stages.rmv_registration.registrationNumber = registrationNumber;
      vehicle.status.stages.rmv_registration.plateNumber = plateNumber;
      vehicle.status.stages.rmv_registration.actualCompletionDate = new Date();
      await vehicle.save();
    }

    rmvRegistration.timeline.push({
      step: "registration_approved",
      action: "Registration approved",
      status: "approved",
      timestamp: new Date(),
      notes: `Registration: ${registrationNumber}`,
      performedBy: req.userId,
    });

    rmvRegistration.completedAt = new Date();
    rmvRegistration.updatedAt = new Date();
    await rmvRegistration.save();

    res.json({
      success: true,
      message: "Registration approved",
      data: rmvRegistration,
    });
  } catch (err) {
    console.error("Approve registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== GET RMV STATUS ==========
exports.getRMVStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const rmvRegistration = await RMVRegistration.findOne({ vehicleId }).select(
      "currentStep validations inspection fees application registration timeline"
    );

    if (!rmvRegistration) {
      return res.status(404).json({ error: "RMV registration not found" });
    }

    res.json({ success: true, data: rmvRegistration });
  } catch (err) {
    console.error("Get RMV status error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== LIST ALL RMV REGISTRATIONS FOR USER ==========
exports.listRMVRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 20, currentStep, status } = req.query;

    let query = { userId: req.userId };
    if (currentStep) query.currentStep = currentStep;

    const registrations = await RMVRegistration.find(query)
      .populate("vehicleId", "specifications.make specifications.model specifications.vin")
      .populate("customerId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await RMVRegistration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("List RMV registrations error:", err);
    res.status(500).json({ error: err.message });
  }
};
