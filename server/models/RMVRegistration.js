const mongoose = require("mongoose");
const { Schema } = mongoose;

const RMVRegistrationSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========== PROCESS STEPS ==========
    currentStep: {
      type: String,
      enum: [
        "documents_upload",
        "inspection_booking",
        "inspection_completed",
        "application_submitted",
        "payment_pending",
        "registration_approved",
        "completed",
      ],
      default: "documents_upload",
    },

    // ========== STEP 1: DOCUMENTS UPLOAD ==========
    documents: {
      title: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      proofOfInsurance: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      governmentId: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      billOfSale: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      addressProof: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      customsClearance: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        notes: String,
      },
      vehiclePhotos: [
        {
          fileName: String,
          fileUrl: String,
          uploadedAt: Date,
          description: String,
        },
      ],
      additionalDocuments: [
        {
          name: String,
          fileName: String,
          fileUrl: String,
          uploadedAt: Date,
          description: String,
        },
      ],
    },

    // ========== STEP 2: VEHICLE INSPECTION ==========
    inspection: {
      status: {
        type: String,
        enum: ["not_scheduled", "scheduled", "completed", "passed", "failed"],
        default: "not_scheduled",
      },
      scheduledDate: Date,
      scheduledLocation: String,
      completedDate: Date,
      inspectionCenter: String,
      inspectorName: String,
      inspectionReportUrl: String,
      safetyCheckPassed: Boolean,
      emissionsTestPassed: Boolean,
      odometer: Number,
      odometherProofUrl: String,
      failureReasons: [String],
      inspectionNotes: String,
      retestScheduled: Boolean,
      retestDate: Date,
    },

    // ========== STEP 3: FEES & TAXES ==========
    fees: {
      registrationFee: { type: Number, default: 0 },
      titleTransferFee: { type: Number, default: 0 },
      inspectionFee: { type: Number, default: 0 },
      salesTax: { type: Number, default: 0 },
      weightBasedFee: { type: Number, default: 0 },
      ageBasedFee: { type: Number, default: 0 },
      environmentalFee: { type: Number, default: 0 },
      processingFee: { type: Number, default: 0 },
      totalFees: { type: Number, default: 0 },
      paymentStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      paymentMethod: String,
      paymentDate: Date,
      paymentConfirmationUrl: String,
      invoiceUrl: String,
    },

    // ========== STEP 4: APPLICATION ==========
    application: {
      applicationNumber: String,
      submissionDate: Date,
      registrationOffice: String,
      estimatedCompletionDate: Date,
      applicationStatus: {
        type: String,
        enum: ["draft", "submitted", "under_review", "approved", "rejected"],
        default: "draft",
      },
      rejectionReason: String,
      approvalDate: Date,
    },

    // ========== REGISTRATION RESULT ==========
    registration: {
      registrationNumber: String,
      registrationCertificateUrl: String,
      plateNumber: String,
      plateImageUrl: String,
      validFrom: Date,
      validUntil: Date,
      renewalDueDate: Date,
    },

    // ========== RENEWAL TRACKING ==========
    renewal: {
      lastRenewalDate: Date,
      nextRenewalDueDate: Date,
      renewalStatus: {
        type: String,
        enum: ["not_applicable", "pending", "completed", "overdue"],
        default: "not_applicable",
      },
      renewalReminderSent: Boolean,
      renewalReminderSentAt: Date,
    },

    // ========== TIMELINE & HISTORY ==========
    timeline: [
      {
        step: String,
        action: String,
        status: String,
        timestamp: Date,
        notes: String,
        performedBy: Schema.Types.ObjectId,
      },
    ],

    // ========== VALIDATION & CHECKS ==========
    validations: {
      documentsComplete: { type: Boolean, default: false },
      inspectionPassed: { type: Boolean, default: false },
      feesPaid: { type: Boolean, default: false },
      applicationSubmitted: { type: Boolean, default: false },
      finalApproved: { type: Boolean, default: false },
    },

    // ========== METADATA ==========
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

// Indexes for faster queries
RMVRegistrationSchema.index({ vehicleId: 1, userId: 1 });
RMVRegistrationSchema.index({ customerId: 1, currentStep: 1 });
RMVRegistrationSchema.index({ "application.applicationNumber": 1 });
RMVRegistrationSchema.index({ "registration.registrationNumber": 1 });
RMVRegistrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("RMVRegistration", RMVRegistrationSchema);
