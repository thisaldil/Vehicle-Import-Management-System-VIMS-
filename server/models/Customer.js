const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    // Owner
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // Contact Information
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true 
    },
    phone: { 
      type: String, 
      required: true 
    },

    // Address
    address: {
      street: String,
      city: String,
      province: String,
      country: { 
        type: String, 
        required: true 
      },
      postalCode: String
    },

    // Business Info
    companyName: String,
    companyType: { 
      type: String, 
      enum: ["individual", "dealer", "corporate"], 
      default: "individual" 
    },
    taxId: String,

    // Documents (ID proof, license, etc.)
    documents: [
      {
        type: { 
          type: String, 
          enum: ["id_proof", "license", "address_proof", "other"],
          required: true 
        },
        url: { 
          type: String, 
          required: true 
        }, // Cloudinary URL
        uploadedAt: { 
          type: Date, 
          default: Date.now 
        },
        description: String
      }
    ],

    // Statistics (Cached for dashboard)
    vehicleCount: { 
      type: Number, 
      default: 0 
    },
    totalSpent: { 
      type: Number, 
      default: 0 
    },
    totalVehicles: { 
      type: Number, 
      default: 0 
    },

    // Status
    status: { 
      type: String, 
      enum: ["active", "inactive", "archived"], 
      default: "active" 
    },

    // Additional Info
    notes: String,
    customFields: Schema.Types.Mixed, // For region-specific data
    preferredPaymentMethod: String,

    // Preferences
    preferences: {
      receiveUpdates: { type: Boolean, default: true },
      communicationChannel: { 
        type: String, 
        enum: ["email", "sms", "whatsapp"], 
        default: "email" 
      },
      preferredLanguage: { 
        type: String, 
        default: "en" 
      }
    },

    // Metadata
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
    lastActivityAt: Date,
    deactivatedAt: Date // When soft deleted
  },
  { 
    timestamps: true,
    collection: "customers" 
  }
);

// Indexes for performance
CustomerSchema.index({ userId: 1, email: 1 });
CustomerSchema.index({ userId: 1, status: 1 });
CustomerSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Customer", CustomerSchema);
