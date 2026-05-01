const mongoose = require("mongoose");
const { Schema } = mongoose;

const VehicleSchema = new Schema(
  {
    // Owner Reference
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: "Customer", 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // ========== VEHICLE SPECIFICATIONS ==========
    specifications: {
      make: { 
        type: String, 
        required: true, 
        trim: true 
      }, // Toyota, Honda, etc.
      model: { 
        type: String, 
        required: true, 
        trim: true 
      }, // Camry, Civic, etc.
      year: { 
        type: Number, 
        required: true 
      },
      vin: { 
        type: String, 
        unique: true, 
        index: true,
        sparse: true, 
        uppercase: true 
      }, // Vehicle Identification Number
      bodyType: { 
        type: String, 
        enum: ["sedan", "suv", "truck", "van", "hatchback", "convertible", "other"],
        required: true 
      },
      engineCC: Number,
      engineCapacity: String,
      fuelType: { 
        type: String, 
        enum: ["petrol", "diesel", "hybrid", "electric"],
        required: true 
      },
      transmission: { 
        type: String, 
        enum: ["manual", "automatic"] 
      },
      mileage: Number, // In kilometers
      color: String,
      seats: Number,
      registrationNumber: String // Original country registration
    },

    // ========== PURCHASE INFORMATION ==========
    purchaseInfo: {
      purchaseDate: { 
        type: Date, 
        required: true 
      },
      purchasePrice: { 
        type: Number, 
        required: true 
      },
      currency: { 
        type: String, 
        default: "JPY" 
      }, // If imported from Japan
      supplier: String, // Auction house, dealer name
      invoiceId: { 
        type: Schema.Types.ObjectId, 
        ref: "Invoice" 
      }, // Link to original purchase invoice
      importCountry: { 
        type: String, 
        required: true 
      }, // Japan, Singapore, UK, etc.
      importPort: String, // Port where vehicle arrives
      supplierContact: String,
      purchaseNotes: String
    },

    // ========== LIFECYCLE STATUS (CRITICAL) ==========
    status: {
      currentStage: {
        type: String,
        enum: ["shipment", "customs", "rmv_registration", "delivery", "completed", "on_hold"],
        default: "shipment",
        required: true
      },

      // ===== STAGE 1: SHIPMENT =====
      stages: {
        shipment: {
          status: {
            type: String,
            enum: ["pending", "in_transit", "completed", "delayed"],
            default: "pending"
          },
          startDate: Date,
          estimatedArrival: Date,
          actualArrival: Date,
          carrier: String, // Shipping company
          trackingNumber: String,
          containerNumber: String,
          documents: [
            {
              type: { 
                type: String, 
                enum: ["shipping_receipt", "bill_of_lading", "tracking_confirmation", "photos", "other"]
              },
              url: String,
              uploadedAt: Date,
              description: String
            }
          ],
          notes: String
        },

        // ===== STAGE 2: CUSTOMS CLEARANCE =====
        customs: {
          status: {
            type: String,
            enum: ["pending", "under_clearance", "cleared", "on_hold", "rejected"],
            default: "pending"
          },
          startDate: Date,
          estimatedClearanceDate: Date,
          actualClearanceDate: Date,
          clearanceNumber: String,
          customsAgent: String, // Name of customs agent
          customsPort: String,

          // Duty Breakdown
          duties: {
            vehicleValue: Number,
            customsDuty: Number,
            customsDutyPercent: { type: Number, default: 0 },
            vat: Number,
            vatPercent: { type: Number, default: 0 },
            surcharge: Number,
            surchargePercent: { type: Number, default: 0 },
            luxuryTax: Number,
            luxuryTaxPercent: { type: Number, default: 0 },
            environmentalCharge: Number,
            otherCharges: Number,
            totalDuty: Number // Sum of all
          },

          documents: [
            {
              type: { 
                type: String, 
                enum: ["clearance_certificate", "duty_breakdown", "customs_declaration", "inspection_report", "photos", "other"]
              },
              url: String,
              uploadedAt: Date,
              description: String
            }
          ],
          notes: String,
          holdReason: String // If on_hold
        },

        // ===== STAGE 3: RMV REGISTRATION =====
        rmv_registration: {
          status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "rejected", "resubmission_needed"],
            default: "pending"
          },
          startDate: Date,
          estimatedCompletionDate: Date,
          actualCompletionDate: Date,
          registrationNumber: String, // New country registration
          plateNumber: String,

          // RMV Application Details
          registrationOffice: String,
          applicationNumber: String,
          inspectionDate: Date,
          inspectionLocation: String,
          inspectionPassed: Boolean,
          inspectionNotes: String,

          documents: [
            {
              type: { 
                type: String, 
                enum: ["registration_certificate", "inspection_report", "customs_clearance", "proof_of_ownership", "customer_id", "address_proof", "photos", "other"]
              },
              url: String,
              uploadedAt: Date,
              description: String
            }
          ],
          notes: String,
          rejectionReason: String // If rejected
        },

        // ===== STAGE 4: DELIVERY =====
        delivery: {
          status: {
            type: String,
            enum: ["pending", "ready", "scheduled", "in_transit", "delivered", "cancelled"],
            default: "pending"
          },
          readyDate: Date,
          deliveryDate: Date,
          scheduledDeliveryDate: Date,

          // Delivery Details
          deliveryLocation: String,
          deliveryAddress: String,
          deliveryInstructions: String,
          recipientName: String,
          recipientPhone: String,

          // Proof of Delivery
          deliveryProof: String, // Photo URL
          recipientSignature: String, // Photo of signature
          deliveryNotes: String,

          finalInvoiceId: { 
            type: Schema.Types.ObjectId, 
            ref: "Invoice" 
          }, // Final delivery invoice

          documents: [
            {
              type: { 
                type: String, 
                enum: ["delivery_receipt", "customer_signature", "delivery_photos", "final_invoice", "odometer_proof", "other"]
              },
              url: String,
              uploadedAt: Date,
              description: String
            }
          ],

          cancellationReason: String // If cancelled
        }
      }
    },

    // ========== STATUS HISTORY (Audit Trail) ==========
    statusHistory: [
      {
        stage: {
          type: String,
          enum: ["shipment", "customs", "rmv_registration", "delivery"],
          required: true
        },
        previousStatus: String,
        newStatus: String,
        changedBy: { 
          type: Schema.Types.ObjectId, 
          ref: "User" 
        },
        changedAt: { 
          type: Date, 
          default: Date.now 
        },
        notes: String,
        documentAdded: String, // Document URL if added with this change
        metadata: Schema.Types.Mixed // Any additional data
      }
    ],

    // ========== TIMELINE EVENTS (Dashboard visualization) ==========
    events: [
      {
        type: {
          type: String,
          enum: ["status_change", "document_upload", "note_added", "email_sent", "notification_sent", "inspection", "approval", "other"],
          required: true
        },
        stage: String,
        title: String, // Brief title
        message: String, // Detailed message
        timestamp: { 
          type: Date, 
          default: Date.now 
        },
        relatedDocument: String, // URL if applicable
        metadata: Schema.Types.Mixed
      }
    ],

    // ========== MEDIA & DOCUMENTS ==========
    media: {
      photos: [
        {
          url: String, // Cloudinary URL
          caption: String,
          uploadedAt: Date,
          stage: String // Which stage photo was taken
        }
      ],
      videos: [
        {
          url: String,
          caption: String,
          uploadedAt: Date
        }
      ],
      documents: [
        {
          type: {
            type: String,
            enum: ["purchase_invoice", "shipping_doc", "customs_doc", "registration", "delivery_doc", "inspection", "other"]
          },
          url: String,
          fileName: String,
          uploadedAt: Date,
          uploadedBy: { 
            type: Schema.Types.ObjectId, 
            ref: "User" 
          }
        }
      ]
    },

    // ========== CUSTOMER-FACING INFO ==========
    customerInfo: {
      customerId: { 
        type: Schema.Types.ObjectId, 
        ref: "Customer" 
      },
      customerName: String,
      customerEmail: String,
      customerPhone: String
    },

    // ========== FINANCIAL INFO ==========
    financials: {
      totalInvoicesLinked: { type: Number, default: 0 },
      totalCost: Number, // Purchase + duties + registration
      finalCost: Number, // What customer paid
      taxApplied: Number,
      profitMargin: Number
    },

    // ========== METADATA ==========
    notes: String, // General notes about vehicle
    internalComments: String, // Admin-only notes
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal"
    },
    tags: [String], // For custom categorization

    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
    completedAt: Date, // When status = completed
    archivedAt: Date // When archived
  },
  { 
    timestamps: true,
    collection: "vehicles" 
  }
);

// ========== INDEXES (Critical for performance) ==========
VehicleSchema.index({ customerId: 1, status: 1 }); // By customer & status
VehicleSchema.index({ userId: 1, createdAt: -1 }); // User's vehicles timeline
VehicleSchema.index({ "status.currentStage": 1 }); // Dashboard filtering
VehicleSchema.index({ "status.stages.shipment.trackingNumber": 1 }); // Tracking search
VehicleSchema.index({ "statusHistory.changedAt": -1 }); // Recent activity
VehicleSchema.index({ "purchaseInfo.purchaseDate": -1 }); // Timeline analysis
VehicleSchema.index({ userId: 1, "status.currentStage": 1 }); // Dashboard combo

module.exports = mongoose.model("Vehicle", VehicleSchema);
