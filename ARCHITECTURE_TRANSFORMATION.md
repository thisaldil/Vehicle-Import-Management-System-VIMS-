# Vehicle Import Management System (VIMS) - Architecture Transformation Plan

## Executive Summary

Your current system is a **point-of-sale invoice automation tool**. We're transforming it into an **enterprise vehicle lifecycle management platform** by:

1. Extending your data model (adding Customer, Vehicle, Status tracking)
2. Building workflow orchestration (shipment → customs → RMV → delivery)
3. Preserving all OCR, PDF, and email functionality
4. Adding dashboard and real-time status capabilities
5. Minimal disruption to existing features

**Key Principle**: Your Invoice system becomes a *module* within Vehicle Management. Current routes, auth, and OCR services remain untouched.

---

## 1. SYSTEM INTEGRATION PLAN

### Current System Architecture
```
User (Auth) 
  ├── Invoice (PDF Generation + OCR)
  └── Template (Design)
```

### New System Architecture
```
User (Auth - Unchanged)
  ├── Customer (NEW)
  │   ├── Contact Info
  │   ├── Vehicle Portfolio
  │   └── Shipment History
  │
  ├── Vehicle (NEW)
  │   ├── Specifications
  │   ├── Lifecycle Status (Shipment → Customs → RMV → Delivery)
  │   ├── Status History (Audit Trail)
  │   └── Associated Invoices (PDF + OCR)
  │
  ├── Invoice (EXTENDED)
  │   ├── Existing fields (preserved)
  │   ├── + vehicleId (new reference)
  │   ├── + invoiceType ("purchase", "customs", "registration")
  │   └── + workflowStage (which stage created this invoice)
  │
  ├── Template (Unchanged)
  │
  └── Workflow (NEW)
      ├── Status tracking
      ├── Timeline events
      └── Notifications
```

### How Current Features Fit Into New Workflow

| Current Feature | How It Fits |
|---|---|
| **OCR Pipeline** | Extracts data from purchase invoices, customs documents, RMV forms |
| **PDF Generation** | Creates invoice PDFs for each stage + final delivery document |
| **Email/WhatsApp** | Notifies customer of status changes and document availability |
| **Cloudinary** | Stores vehicle photos, shipping docs, customs clearance PDFs |
| **Authentication** | User (admin) controls customer access and permissions |

### What Remains Unchanged
- ✅ User authentication (JWT + Google OAuth)
- ✅ OCR service pipeline (Google DocAI, HuggingFace, Mindee)
- ✅ PDF generation with @react-pdf/renderer
- ✅ Cloudinary integration
- ✅ Email infrastructure
- ✅ Existing routes `/api/invoices/*`, `/api/auth/*`
- ✅ Template system

---

## 2. DATABASE DESIGN

### Core Models

#### **User Model** (Existing - No Changes)
```javascript
{
  _id: ObjectId,
  googleId: String,
  name: String,
  email: String,
  picture: String,
  token: String,
  passwordHash: String,
  authProvider: "google" | "local" | "both",
  createdAt: Date,
  updatedAt: Date
}
```

#### **Customer Model** (NEW)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),           // Admin who created this customer
  name: String,                            // Customer name
  email: String,                           // Customer email
  phone: String,                           // Contact phone
  address: {
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  vehicleCount: Number,                    // Cached count for dashboard
  totalSpent: Number,                      // Cumulative spending
  status: "active" | "inactive",
  notes: String,
  documents: [                             // ID proofs, licenses, etc.
    {
      type: String,                        // "id_proof", "license", "address"
      url: String,                         // Cloudinary URL
      uploadedAt: Date
    }
  ],
  customFields: Object,                    // Flexible for region-specific data
  createdAt: Date,
  updatedAt: Date
}
```

#### **Vehicle Model** (NEW - CORE OF NEW SYSTEM)
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: Customer),    // Which customer owns this vehicle
  userId: ObjectId (ref: User),            // Admin user managing this
  
  // Vehicle Specifications
  specifications: {
    make: String,                          // Toyota, Honda, etc.
    model: String,                         // Camry, Civic
    year: Number,
    vin: String,                           // Unique identifier
    engineCC: Number,
    fuelType: String,
    mileage: Number,
    color: String,
    transmission: String,
    bodyType: String
  },
  
  // Purchase Details
  purchaseInfo: {
    purchaseDate: Date,
    purchasePrice: Number,
    currency: String,
    supplier: String,
    invoiceId: ObjectId (ref: Invoice),   // Link to original invoice
    importCountry: String                 // Japan, Singapore, etc.
  },
  
  // Lifecycle Status (CRITICAL)
  status: {
    currentStage: "shipment" | "customs" | "rmv_registration" | "delivery" | "completed",
    
    // Detailed stage tracking
    stages: {
      shipment: {
        status: "pending" | "in_transit" | "completed",
        startDate: Date,
        estimatedArrival: Date,
        actualArrival: Date,
        carrier: String,
        trackingNumber: String,
        documents: [{ type: String, url: String }]
      },
      customs: {
        status: "pending" | "under_clearance" | "cleared" | "on_hold",
        startDate: Date,
        estimatedClearanceDate: Date,
        actualClearanceDate: Date,
        clearanceNumber: String,
        duties: {
          customsDuty: Number,
          vat: Number,
          surcharge: Number,
          luxuryTax: Number,
          total: Number
        },
        documents: [{ type: String, url: String }]  // Clearance cert, etc.
      },
      rmv_registration: {
        status: "pending" | "in_progress" | "completed" | "rejected",
        startDate: Date,
        estimatedCompletionDate: Date,
        actualCompletionDate: Date,
        registrationNumber: String,
        documentUrl: String,                         // Registration certificate
        documents: [{ type: String, url: String }]
      },
      delivery: {
        status: "pending" | "ready" | "delivered" | "cancelled",
        readyDate: Date,
        deliveryDate: Date,
        deliveryLocation: String,
        finalInvoiceId: ObjectId (ref: Invoice)     // Final delivery invoice
      }
    }
  },
  
  // Status History (Audit Trail)
  statusHistory: [
    {
      stage: String,
      previousStatus: String,
      newStatus: String,
      changedBy: ObjectId (ref: User),
      changedAt: Date,
      notes: String,
      documentAdded: String                        // If doc was uploaded
    }
  ],
  
  // Media & Documents
  media: {
    photos: [String],                              // Cloudinary URLs
    videos: [String],
    documents: [
      {
        type: "purchase_invoice" | "shipping_doc" | "customs_doc" | "registration",
        url: String,
        uploadedAt: Date
      }
    ]
  },
  
  // Timeline Events (for dashboard visualization)
  events: [
    {
      type: "status_change" | "document_upload" | "note_added" | "email_sent",
      stage: String,
      message: String,
      timestamp: Date,
      metadata: Object
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **Invoice Model** (EXTENDED - Backward Compatible)
```javascript
// Existing fields preserved, adding:
{
  // ... all existing fields ...
  
  // NEW: Lifecycle integration
  vehicleId: ObjectId (ref: Vehicle),              // NEW: Link to vehicle
  workflowStage: "purchase" | "customs" | "registration" | "delivery",
  
  // NEW: Invoice type classification
  invoiceCategory: {
    primary: "vehicle_purchase" | "customs_duty" | "registration_fee" | "shipping" | "delivery",
    secondary: [String]                           // Tags: "urgent", "discounted", etc.
  },
  
  // Track which vehicle state created this invoice
  createdDuringStage: {
    stage: String,
    stageStatus: String,
    stageTimestamp: Date
  },
  
  // NEW: Customer info (denormalized for quick access)
  customerInfo: {
    customerId: ObjectId,
    customerName: String,
    customerEmail: String
  }
}
```

#### **StatusLog Model** (NEW - Optional, for high-volume tracking)
```javascript
// For high-frequency status updates, maintain separate audit log
{
  _id: ObjectId,
  vehicleId: ObjectId (ref: Vehicle),
  stage: String,
  previousStatus: String,
  newStatus: String,
  changedBy: ObjectId (ref: User),
  changedAt: Date,
  notes: String,
  metadata: Object
}
```

### Database Relationships Diagram
```
User (1) ─────────────────┬──────────── Customer (N)
  │                       │
  │                       └────────────── Vehicle (N)
  │                                        │
  │                                        └─────── Status History (N)
  │                                        └─────── Events (N)
  │
  └──────────────────────── Invoice (N) ◄─────── Vehicle
```

### Migration Strategy (Critical for existing data)
```javascript
// 1. Create new models (Customer, Vehicle) without touching Invoice
// 2. Add optional vehicleId field to Invoice schema
// 3. Create "default customer" for all existing invoices
// 4. Backfill: invoices → vehicles (if applicable)
// 5. Enable new workflows alongside existing ones
```

---

## 3. BACKEND CHANGES (EXPRESS)

### New Controllers to Create

#### **A. customerController.js** (NEW)
```javascript
// Routes:
POST   /api/customers                    // Create customer
GET    /api/customers                    // List all (paginated)
GET    /api/customers/:customerId        // Get with vehicle count
PUT    /api/customers/:customerId        // Update customer
DELETE /api/customers/:customerId        // Soft delete
POST   /api/customers/:customerId/documents
GET    /api/customers/:customerId/vehicles
```

#### **B. vehicleController.js** (NEW - LARGEST CONTROLLER)
```javascript
// Core CRUD
POST   /api/vehicles                     // Create vehicle
GET    /api/vehicles                     // List (with filters: status, customer, etc.)
GET    /api/vehicles/:vehicleId          // Get full details + timeline
PUT    /api/vehicles/:vehicleId          // Update vehicle specs

// Status & Workflow Management
PATCH  /api/vehicles/:vehicleId/status  // Update current status
POST   /api/vehicles/:vehicleId/status-history  // Add status entry
GET    /api/vehicles/:vehicleId/timeline        // Get events timeline

// Stage-specific operations
PUT    /api/vehicles/:vehicleId/stages/shipment
PUT    /api/vehicles/:vehicleId/stages/customs
PUT    /api/vehicles/:vehicleId/stages/rmv_registration
PUT    /api/vehicles/:vehicleId/stages/delivery

// Document management
POST   /api/vehicles/:vehicleId/documents
GET    /api/vehicles/:vehicleId/documents
DELETE /api/vehicles/:vehicleId/documents/:docId

// Media
POST   /api/vehicles/:vehicleId/photos

// Utilities
GET    /api/vehicles/search?vin=ABC123   // Search by VIN, tracking number
POST   /api/vehicles/:vehicleId/resend-notification
```

#### **C. workflowController.js** (NEW)
```javascript
// High-level workflow orchestration
POST   /api/workflow/:vehicleId/advance-stage    // Move to next stage
POST   /api/workflow/:vehicleId/trigger-action   // Trigger workflow actions
GET    /api/workflow/stats                       // Dashboard stats
GET    /api/workflow/pending                     // All pending actions
```

#### **D. dashboardController.js** (NEW)
```javascript
// Analytics & Overview
GET    /api/dashboard/summary              // Vehicle counts by stage
GET    /api/dashboard/vehicles-by-stage
GET    /api/dashboard/recent-activities
GET    /api/dashboard/customer-metrics
GET    /api/dashboard/revenue-summary
```

### Modifications to Existing Controllers

#### **invoiceController.js** - Add:
```javascript
// Link invoice to vehicle during creation
exports.saveInvoiceDetails = async (req, res) => {
  const { vehicleId, workflowStage, ...existingFields } = req.body;
  
  // Existing logic preserved
  const invoice = new Invoice({
    ...existingFields,
    vehicleId,      // NEW
    workflowStage,  // NEW
    customerInfo: {
      // Denormalized from Vehicle → Customer
    }
  });
  
  // NEW: Update vehicle's associated invoice
  if (vehicleId) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $push: { purchaseInfo: { invoiceId: invoice._id } }
    });
  }
};
```

#### **New Routes File: vehicleRoutes.js**
```javascript
// server/routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const authRequired = require("../middlewares/authRequired");

// All routes require auth
router.use(authRequired);

// CRUD
router.post("/", vehicleController.createVehicle);
router.get("/", vehicleController.listVehicles);
router.get("/:vehicleId", vehicleController.getVehicleDetails);
router.put("/:vehicleId", vehicleController.updateVehicle);

// Status Management
router.patch("/:vehicleId/status", vehicleController.updateStatus);
router.get("/:vehicleId/timeline", vehicleController.getTimeline);

// Stage Operations
router.put("/:vehicleId/stages/shipment", vehicleController.updateShipment);
router.put("/:vehicleId/stages/customs", vehicleController.updateCustoms);
router.put("/:vehicleId/stages/rmv_registration", vehicleController.updateRmv);
router.put("/:vehicleId/stages/delivery", vehicleController.updateDelivery);

// Documents
router.post("/:vehicleId/documents", vehicleController.uploadDocument);
router.get("/:vehicleId/documents", vehicleController.getDocuments);

module.exports = router;
```

### Integration Points in server.js

```javascript
// server/api/server.js - Add these lines:

// Load all models
require("../models/User");
require("../models/Invoice");
require("../models/Template");
require("../models/Customer");    // NEW
require("../models/Vehicle");      // NEW
require("../models/StatusLog");    // NEW (optional)

// Connect routes
app.use("/api/invoices", require("../routes/invoiceRoutes"));
app.use("/api/customers", require("../routes/customerRoutes"));      // NEW
app.use("/api/vehicles", require("../routes/vehicleRoutes"));        // NEW
app.use("/api/workflow", require("../routes/workflowRoutes"));       // NEW
app.use("/api/dashboard", require("../routes/dashboardRoutes"));     // NEW
```

### Key Implementation Details

#### **Status Update Logic** (In vehicleController.js)
```javascript
exports.updateStatus = async (req, res) => {
  const { vehicleId } = req.params;
  const { stage, status, notes, documents } = req.body;
  
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
  
  // Get current status
  const previousStatus = vehicle.status.stages[stage].status;
  
  // Update stage status
  vehicle.status.stages[stage].status = status;
  
  // Add to history (for audit trail)
  vehicle.statusHistory.push({
    stage,
    previousStatus,
    newStatus: status,
    changedBy: req.userId,
    changedAt: new Date(),
    notes
  });
  
  // Add event to timeline
  vehicle.events.push({
    type: "status_change",
    stage,
    message: `Status changed from ${previousStatus} to ${status}`,
    timestamp: new Date(),
    metadata: { notes }
  });
  
  // Update main status if this is the current stage
  if (stage === vehicle.status.currentStage) {
    vehicle.status.currentStage = this.getNextStageIfComplete(stage, status);
  }
  
  await vehicle.save();
  
  // Trigger notifications
  await notifyCustomer(vehicleId, stage, status);
  
  res.json(vehicle);
};
```

#### **Pagination & Filtering** (In vehicleController.js)
```javascript
exports.listVehicles = async (req, res) => {
  const { page = 1, limit = 20, status, customerId, stage } = req.query;
  
  let query = { userId: req.userId };
  
  if (status) query["status.currentStage"] = status;
  if (customerId) query.customerId = customerId;
  if (stage) query[`status.stages.${stage}.status`] = { $exists: true };
  
  const vehicles = await Vehicle.find(query)
    .populate("customerId", "name email")
    .populate("purchaseInfo.invoiceId", "invoiceNo pdfUrl")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });
  
  const total = await Vehicle.countDocuments(query);
  
  res.json({
    data: vehicles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};
```

---

## 4. FRONTEND INTEGRATION (REACT)

### No Major UI Rebuild Required

Your existing components remain functional. We're adding new pages alongside them.

### New Pages/Components to Add

#### **A. Customer Management** (NEW SECTION)
```
/customers
  ├── CustomerList.jsx
  │   ├── Table with search, filter by status
  │   ├── Add customer button
  │   └── Bulk actions (export, message)
  │
  └── CustomerDetail.jsx
      ├── Customer info card (name, email, address)
      ├── Vehicle portfolio tab
      ├── Document uploads
      └── Notes/history
```

#### **B. Vehicle Management** (NEW CORE SECTION)
```
/vehicles
  ├── VehicleList.jsx
  │   ├── Grid/Table view
  │   ├── Filter by stage (Shipment, Customs, RMV, Delivery)
  │   ├── Search by VIN, tracking number
  │   ├── Bulk status update
  │   └── Quick stats (pending items, overdue)
  │
  └── VehicleDetail.jsx
      ├── Vehicle specs card
      ├── Timeline component (horizontal)
      │   ├── Shipment stage
      │   ├── Customs stage
      │   ├── RMV stage
      │   └── Delivery stage
      ├── Document gallery
      ├── Status update buttons
      ├── Activity log
      └── Associated invoices
```

#### **C. Vehicle Timeline Component** (KEY UI ELEMENT)
```jsx
// components/vehicle/VehicleTimeline.jsx

// Visual representation of vehicle lifecycle:
// 
// ◯ Shipment ──→ ◯ Customs ──→ ◯ RMV ──→ ◯ Delivery
// ✓ Completed     In Progress  Pending  Pending
//
// Each stage expandable to show:
// - Current status
// - Documents
// - Date ranges
// - Action buttons
```

#### **D. Dashboard** (NEW - EXTENDS EXISTING DASHBOARD)
```
/dashboard
  ├── Summary Cards (NEW additions)
  │   ├── Total vehicles
  │   ├── By stage breakdown
  │   ├── Pending actions count
  │   └── Revenue this month
  │
  ├── Stage Pipeline View (NEW)
  │   ├── Kanban-style: Shipment | Customs | RMV | Delivery
  │   ├── Drag-and-drop vehicle cards
  │   └── Quick status updates
  │
  ├── Recent Activities (NEW)
  │   ├── Last 10 status changes
  │   ├── New documents uploaded
  │   └── Pending approvals
  │
  └── Customer Metrics (NEW)
  │   ├── Top customers by volume
  │   ├── Average delivery time
  │   └── Customer health score
```

### Component Structure Plan

```
src/components/
├── customers/
│   ├── CustomerList.jsx       (NEW)
│   ├── CustomerDetail.jsx     (NEW)
│   ├── CustomerForm.jsx       (NEW)
│   └── DocumentUpload.jsx     (NEW)
│
├── vehicles/
│   ├── VehicleList.jsx        (NEW)
│   ├── VehicleDetail.jsx      (NEW)
│   ├── VehicleForm.jsx        (NEW)
│   ├── VehicleTimeline.jsx    (NEW - KEY COMPONENT)
│   ├── StageCard.jsx          (NEW)
│   └── DocumentGallery.jsx    (NEW)
│
├── dashboard/                 (EXTEND EXISTING)
│   ├── Dashboard.jsx          (MODIFY - add new cards)
│   ├── PipelineView.jsx       (NEW)
│   ├── ActivityFeed.jsx       (NEW)
│   └── MetricsCards.jsx       (NEW)
│
├── invoice/                   (EXISTING - MINIMAL CHANGES)
│   ├── CarInvoiceForm.jsx     (MODIFY - add vehicleId field)
│   ├── InvoicePreview.jsx     (UNCHANGED)
│   └── InvoiceUpload.jsx      (UNCHANGED)
│
└── Layout.jsx                 (MODIFY - add vehicle, customer routes)
```

### How to Connect CarInvoiceForm to Vehicle Data

#### **Current Flow (No Breaking Changes)**
```
CarInvoiceForm
  ├── Step 1: Select customer (NEW dropdown)
  ├── Step 2: Link to vehicle (NEW option to create/select)
  └── Step 3: Generate invoice (EXISTING - now with vehicleId)
```

#### **Implementation Example**
```jsx
// components/invoice/CarInvoiceForm.jsx - Add:

const [selectedCustomer, setSelectedCustomer] = useState(null);
const [linkedVehicle, setLinkedVehicle] = useState(null);

// When invoice saved:
const saveInvoice = async () => {
  const invoiceData = {
    ...existingInvoiceFields,
    customerId: selectedCustomer?._id,  // NEW
    vehicleId: linkedVehicle?._id,      // NEW
    workflowStage: "purchase",          // NEW
  };
  
  await api.post("/invoices", invoiceData);
  
  // NEW: Update vehicle status to "purchase_invoiced"
  if (linkedVehicle) {
    await api.patch(`/vehicles/${linkedVehicle._id}/status`, {
      stage: "shipment",
      status: "pending",
      notes: "Purchase invoice created"
    });
  }
};
```

### Navigation Updates (Layout.jsx)
```jsx
// Add to sidebar:
<nav>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/invoices">Invoices</Link>
  
  {/* NEW SECTIONS */}
  <Link to="/customers">Customers</Link>
  <Link to="/vehicles">Vehicles</Link>
  
  <Link to="/templates">Templates</Link>
</nav>
```

### Real-time Updates (Optional but Recommended)

```jsx
// Use WebSocket or polling for live status updates
// components/hooks/useVehicleUpdate.js

export const useVehicleUpdate = (vehicleId) => {
  const [vehicle, setVehicle] = useState(null);
  
  useEffect(() => {
    // Fetch initial
    api.get(`/vehicles/${vehicleId}`).then(setVehicle);
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      api.get(`/vehicles/${vehicleId}`).then(setVehicle);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [vehicleId]);
  
  return vehicle;
};
```

---

## 5. WORKFLOW DESIGN - VEHICLE LIFECYCLE

### Full Lifecycle Stages & Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    VEHICLE LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────┘

Stage 1: SHIPMENT
├─ Status Sequence: pending → in_transit → arrived
├─ Inputs:
│  ├─ Purchase invoice (OCR extracted)
│  ├─ Shipping details (carrier, tracking, ETA)
│  └─ Shipper documents (bill of lading, photos)
├─ Duration: 1-6 weeks
├─ Key Documents: Shipping receipt, tracking number, photos
└─ Triggers Next Stage: Arrival confirmation

Stage 2: CUSTOMS CLEARANCE
├─ Status Sequence: pending → under_clearance → cleared → on_hold (if issues)
├─ Inputs:
│  ├─ Vehicle arrival confirmation
│  ├─ Customs declaration (auto-generated from invoice)
│  └─ Supporting docs (invoice, shipper cert, VIN)
├─ Duration: 1-3 weeks
├─ Key Outputs:
│  ├─ Customs duty breakdown (calculated)
│  ├─ VAT, surcharge, luxury tax
│  └─ Clearance certificate
├─ OCR Use: Extract customs official stamp/signature
└─ Triggers Next Stage: Clearance received

Stage 3: RMV REGISTRATION
├─ Status Sequence: pending → in_progress → completed → rejected (if issues)
├─ Inputs:
│  ├─ Customs clearance document
│  ├─ Customer documents (ID, address proof)
│  └─ Vehicle inspection report (if required)
├─ Duration: 1-2 weeks
├─ Key Outputs: Registration number, RC (registration certificate)
├─ OCR Use: Extract registration details from RC
└─ Triggers Next Stage: RC received

Stage 4: DELIVERY
├─ Status Sequence: pending → ready → delivered
├─ Inputs:
│  ├─ Registration certificate
│  ├─ Delivery instructions (address, time)
│  └─ Final inspection
├─ Duration: 1-5 days
├─ Key Outputs:
│  ├─ Final delivery invoice
│  ├─ Delivery proof (signature, photos)
│  └─ Customer handover document
├─ Notification: SMS/Email with delivery details
└─ Completion: Status = completed
```

### Status Transition Rules (Business Logic)

```javascript
// server/utils/workflowRules.js

const TRANSITIONS = {
  shipment: {
    pending: {
      can_transition_to: ["in_transit"],
      requires: ["tracking_number", "carrier"],
      auto_timeout: "30 days"
    },
    in_transit: {
      can_transition_to: ["completed"],
      requires: ["arrival_confirmation"],
      triggers_action: "send_customs_docs"
    },
    completed: {
      auto_triggers: "move_to_customs"
    }
  },
  customs: {
    pending: {
      can_transition_to: ["under_clearance"],
      requires: ["customs_declaration"],
      auto_timeout: "7 days"
    },
    under_clearance: {
      can_transition_to: ["cleared", "on_hold"],
      awaits: "customs_approval"
    },
    cleared: {
      auto_triggers: "move_to_rmv_registration"
    },
    on_hold: {
      can_transition_to: ["under_clearance"], // Manual retry after issue resolution
      requires: ["resolution_notes"]
    }
  },
  rmv_registration: {
    pending: {
      can_transition_to: ["in_progress"],
      requires: ["customer_documents"],
      auto_timeout: "14 days"
    },
    in_progress: {
      can_transition_to: ["completed", "rejected"],
      awaits: "rmv_approval"
    },
    rejected: {
      can_transition_to: ["in_progress"],
      requires: ["resubmission_reason"],
      resets_customer_docs: true
    },
    completed: {
      auto_triggers: "move_to_delivery"
    }
  },
  delivery: {
    pending: {
      can_transition_to: ["ready"],
      requires: ["registration_certificate"],
      can_schedule: true
    },
    ready: {
      can_transition_to: ["delivered"],
      requires: ["delivery_date"]
    },
    delivered: {
      requires: ["delivery_proof", "customer_signature"]
    }
  }
};

// Usage in controller:
const canTransition = (currentStage, currentStatus, newStatus) => {
  const rules = TRANSITIONS[currentStage][currentStatus];
  return rules.can_transition_to.includes(newStatus);
};
```

### Automatic Workflow Triggers

```javascript
// server/services/workflowService.js

class WorkflowOrchestrator {
  
  // Auto-advance when conditions met
  async autoAdvanceStage(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    const currentStage = vehicle.status.currentStage;
    
    switch(currentStage) {
      case 'shipment':
        if (vehicle.status.stages.shipment.status === 'completed') {
          await this.transitionToStage(vehicleId, 'customs');
          await this.sendStatusEmail(vehicleId, 'Customs documentation sent');
        }
        break;
      
      case 'customs':
        if (vehicle.status.stages.customs.status === 'cleared') {
          await this.transitionToStage(vehicleId, 'rmv_registration');
          await this.sendStatusEmail(vehicleId, 'Please submit RMV registration documents');
        }
        break;
      
      case 'rmv_registration':
        if (vehicle.status.stages.rmv_registration.status === 'completed') {
          await this.transitionToStage(vehicleId, 'delivery');
          await this.sendStatusEmail(vehicleId, 'Vehicle ready for delivery');
        }
        break;
    }
  }
  
  // Timeout handling (mark as overdue)
  async checkForOverdueTasks() {
    const overdueTasks = await Vehicle.find({
      'statusHistory.changedAt': {
        $lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days
      }
    });
    
    for (const vehicle of overdueTasks) {
      await this.sendOverdueAlert(vehicle);
    }
  }
  
  // Notification routing
  async sendStatusEmail(vehicleId, message) {
    const vehicle = await Vehicle.findById(vehicleId)
      .populate('customerId');
    
    const customer = vehicle.customerId;
    
    // Send email to customer
    await sendEmail(customer.email, {
      subject: `Vehicle Update: ${vehicle.specifications.make}`,
      message: message,
      vehicleId: vehicleId
    });
    
    // Log event
    vehicle.events.push({
      type: 'email_sent',
      message: message,
      timestamp: new Date()
    });
    await vehicle.save();
  }
}
```

### Timeline Visualization Data

```javascript
// What frontend receives for timeline:
{
  vehicleId: "...",
  timeline: [
    {
      stage: "shipment",
      status: "completed",
      startDate: "2025-01-15",
      endDate: "2025-02-10",
      duration: "26 days",
      documents: ["shipping_receipt.pdf", "tracking_proof.jpg"],
      events: [
        { timestamp: "2025-01-15", type: "start", message: "Shipment initiated" },
        { timestamp: "2025-02-10", type: "complete", message: "Vehicle arrived" }
      ]
    },
    {
      stage: "customs",
      status: "in_progress",
      startDate: "2025-02-11",
      estimatedEndDate: "2025-02-25",
      daysElapsed: 5,
      daysRemaining: 9,
      documents: ["customs_declaration.pdf"],
      events: [...]
    },
    // ... rmv and delivery
  ]
}
```

---

## 6. REUSE STRATEGY

### What Stays Exactly As-Is ✅

#### **Authentication**
- User model (no changes)
- JWT + Google OAuth (unchanged)
- authRequired middleware (reuse for all new routes)

#### **OCR Pipeline**
- Google DocAI service (unchanged - still processes documents)
- HuggingFace service (unchanged)
- Mindee service (unchanged)
- Tesseract integration (unchanged)
- File upload handlers (reuse with slight path adjustment)

**New Use Cases for OCR:**
```
Document Type         → OCR Extraction
─────────────────────────────────────
Purchase Invoice      → Vehicle specs, price (existing)
Shipping Document     → Tracking number, carrier, ETA
Customs Certificate   → Clearance number, date, duty amounts
Registration Doc      → Registration number, issue date
```

#### **PDF Generation**
- @react-pdf/renderer setup (unchanged)
- Template system (unchanged)
- Invoice PDF creation (unchanged for invoices)

**New Use Cases:**
```
PDF Type              → Purpose
──────────────────────────────────
Purchase Invoice      → Existing (unchanged)
Customs Invoice       → Duty breakdown summary (new template)
Registration Cert     → Proof document (new template)
Delivery Slip         → Final handover document (new template)
Timeline Report       → Customer portal document (new template)
```

#### **File Storage (Cloudinary)**
- Existing integration (use as-is)
- Upload handlers (reuse)

**New Asset Types:**
```
Asset Type            → Storage Purpose
──────────────────────────────────────
Vehicle Photos        → Gallery in vehicle detail
Shipping Labels       → Document storage
Customs Stamps        → OCR verification proof
Registration Certs    → Legal document archive
Timeline Screenshots  → Customer communication
```

#### **Email System**
- Nodemailer configuration (unchanged)
- Email templates (extend, don't replace)

**New Email Workflows:**
```
Trigger              → Email Content
──────────────────────────────────────
Shipment started     → Tracking info, ETA
Customs cleared      → Certificate link, next steps
RMV approved         → Registration number, certificate
Ready for delivery   → Address confirmation, delivery time
Delivered            → Receipt, final invoice
```

#### **Existing Routes** (Keep working)
- POST `/api/invoices/upload` - still processes PDFs
- POST `/api/invoices/save` - still saves invoice details
- GET `/api/invoices` - still lists invoices
- All auth routes unchanged
- All template routes unchanged

### What's New (Build From Scratch)

1. **Customer Management** (10-15% new code)
   - Customer CRUD
   - Document upload for customers
   
2. **Vehicle Management** (40-50% new code) ← LARGEST EFFORT
   - Vehicle CRUD
   - Status update logic
   - Timeline tracking
   - Stage-specific operations
   
3. **Workflow Orchestration** (20-25% new code)
   - Status transition rules
   - Auto-advancement logic
   - Timeout handling
   - Notification triggering
   
4. **Dashboard Extensions** (10-15% new code)
   - New summary cards
   - Pipeline view
   - Activity feed
   - Metrics display

### Code Reuse Matrix

| Component | Reuse Level | Notes |
|-----------|-------------|-------|
| User Auth | 100% | Zero changes |
| JWT Middleware | 100% | Applied to new routes |
| OCR Services | 100% | Same endpoints, new document types |
| PDF Generation | 95% | Reuse renderer, add new templates |
| Cloudinary | 100% | Same integration |
| Email Service | 95% | Reuse infrastructure, new workflows |
| Invoice Routes | 100% | Keep existing, add vehicleId field |
| Invoice Controller | 90% | Extend saveInvoiceDetails() |
| Error Handling | 100% | Reuse middleware |
| Validation | 80% | Reuse patterns, add vehicle validators |
| Database Connection | 100% | Same MongoDB setup |

---

## 7. STEP-BY-STEP IMPLEMENTATION PLAN

### Phase 1: Foundation (Week 1)
Goal: Set up new models without touching existing functionality

- [ ] **1.1** Create Customer model (server/models/Customer.js)
  - Time: 30 min
  - Files: New file, no modifications
  
- [ ] **1.2** Create Vehicle model (server/models/Vehicle.js)
  - Time: 1 hour
  - Files: New file, no modifications
  
- [ ] **1.3** Create StatusLog model (server/models/StatusLog.js) - Optional
  - Time: 30 min
  
- [ ] **1.4** Update Invoice model to add vehicleId (optional field)
  - Time: 30 min
  - Files: Modify models/Invoice.js (backward compatible)
  - Keep existing fields, add: `vehicleId`, `workflowStage`, `customerInfo`
  
- [ ] **1.5** Database migration script
  - Time: 1 hour
  - Files: scripts/migrateInvoices.js
  - Creates "default customer" for orphaned invoices

**Checkpoint**: Run existing app → all existing features work

---

### Phase 2: Backend APIs (Week 2)
Goal: Build new REST endpoints without UI yet

- [ ] **2.1** Create customerController.js
  - Time: 2 hours
  - Routes: CRUD, document upload, list
  
- [ ] **2.2** Create vehicleController.js (MAIN CONTROLLER)
  - Time: 4 hours
  - Routes: CRUD, status management, stage operations, documents
  - Key method: updateStatus() with audit trail
  
- [ ] **2.3** Create workflowController.js
  - Time: 2 hours
  - Routes: Advance stage, trigger actions, get stats
  
- [ ] **2.4** Create dashboardController.js
  - Time: 1.5 hours
  - Routes: Summary, by-stage, activities, metrics
  
- [ ] **2.5** Create route files
  - Time: 1 hour
  - Files: routes/customerRoutes.js, routes/vehicleRoutes.js, routes/workflowRoutes.js, routes/dashboardRoutes.js
  
- [ ] **2.6** Update server.js to register routes
  - Time: 30 min
  - Files: Modify api/server.js
  
- [ ] **2.7** Create workflow rules utility
  - Time: 1 hour
  - Files: utils/workflowRules.js
  
- [ ] **2.8** Update invoiceController.js to support vehicleId
  - Time: 1 hour
  - Files: Modify controllers/invoiceController.js

**Test with Postman**: All new endpoints work, existing invoices endpoint still works

---

### Phase 3: Frontend - Customers (Week 3)
Goal: Build customer management UI

- [ ] **3.1** Create components/customers/ folder
  - Time: 30 min
  
- [ ] **3.2** Build CustomerList.jsx
  - Time: 2 hours
  - Includes: Table, search, filter, pagination, add button
  
- [ ] **3.3** Build CustomerForm.jsx (create/edit)
  - Time: 1.5 hours
  - Form validation, file upload for documents
  
- [ ] **3.4** Build CustomerDetail.jsx
  - Time: 2 hours
  - Tabs: Info, vehicles, documents, notes
  
- [ ] **3.5** Add routes to Layout.jsx
  - Time: 30 min
  - Link: `/customers`, `/customers/:id`
  
- [ ] **3.6** Create API helper (utils/api.js updates)
  - Time: 30 min
  - Add customer API calls

**Test in browser**: Create, view, update customer → Linked to new backend

---

### Phase 4: Frontend - Vehicles (Week 4)
Goal: Build vehicle management and lifecycle UI

- [ ] **4.1** Create components/vehicles/ folder
  - Time: 30 min
  
- [ ] **4.2** Build VehicleList.jsx
  - Time: 3 hours
  - Includes: Grid/table, filter by stage, search, bulk actions
  
- [ ] **4.3** Build VehicleForm.jsx (create/edit)
  - Time: 2 hours
  - Comprehensive spec entry, customer link
  
- [ ] **4.4** Build VehicleTimeline.jsx (KEY COMPONENT)
  - Time: 3 hours
  - Visual timeline: 4 stages, expand/collapse
  - Status indicators, document display
  
- [ ] **4.5** Build StageCard.jsx
  - Time: 1.5 hours
  - Reusable stage detail: dates, status, documents
  
- [ ] **4.6** Build VehicleDetail.jsx
  - Time: 2.5 hours
  - Specs + Timeline + Documents + Activity
  
- [ ] **4.7** Build DocumentGallery.jsx
  - Time: 1.5 hours
  - Display and upload vehicle documents
  
- [ ] **4.8** Add routes to Layout.jsx
  - Time: 30 min
  - Link: `/vehicles`, `/vehicles/:id`

**Test in browser**: Create vehicle → Update status → Timeline updates

---

### Phase 5: Integration & Dashboard (Week 5)
Goal: Connect everything, build real-time dashboard

- [ ] **5.1** Modify CarInvoiceForm.jsx
  - Time: 1.5 hours
  - Add customer & vehicle selection
  - Link new invoices to vehicles
  
- [ ] **5.2** Extend Dashboard.jsx
  - Time: 2 hours
  - New summary cards: vehicles by stage, pending actions
  
- [ ] **5.3** Build PipelineView.jsx (Kanban)
  - Time: 2 hours
  - Drag-drop vehicle cards between stages
  
- [ ] **5.4** Build ActivityFeed.jsx
  - Time: 1 hour
  - Recent status changes, uploads
  
- [ ] **5.5** Build MetricsCards.jsx
  - Time: 1.5 hours
  - KPIs: avg delivery time, customer count, revenue
  
- [ ] **5.6** Implement real-time updates (optional)
  - Time: 2 hours
  - WebSocket or polling for live status
  
- [ ] **5.7** Testing & bug fixes
  - Time: 2 hours

**Final test**: Full workflow → Create customer → Create vehicle → Update through all stages → Dashboard shows all

---

### Phase 6: Production Hardening (Week 6)
Goal: Make production-ready

- [ ] **6.1** Add validation & error handling
  - Time: 2 hours
  - Input validation, error messages
  
- [ ] **6.2** Performance optimization
  - Time: 1.5 hours
  - Indexes on vehicleId, customerId, status fields
  - Query optimization
  
- [ ] **6.3** Security review
  - Time: 1 hour
  - Authorization checks on all endpoints
  - Field-level access control
  
- [ ] **6.4** Logging & monitoring
  - Time: 1 hour
  - Status change logs, error logs
  
- [ ] **6.5** Documentation
  - Time: 1.5 hours
  - API docs, workflow diagrams
  
- [ ] **6.6** Load testing
  - Time: 1 hour
  - Simulate high-volume vehicle updates
  
- [ ] **6.7** Deployment
  - Time: 1 hour
  - Deploy to production, database migration

---

### Total Effort: ~6 weeks (approximately 200-250 development hours)

### Parallel Work Opportunities

Optimize by running in parallel:
- **Week 2-3**: Backend APIs (one dev) + Customer UI (another dev)
- **Week 3-4**: Vehicle UI (second dev) while first dev refines backend
- **Week 4-5**: Dashboard (first dev) while second dev finishes vehicle components

---

## 8. BONUS - AI AUTOMATION FEATURES

### Feature 1: Predictive Delivery Timeline (HIGH VALUE)
**What it does**: Uses historical data to predict delivery dates and alert admin if timeline drifts.

```python
# server/services/aiServices/predictiveTimeline.py

import numpy as np
from sklearn.linear_model import LinearRegression

class DeliveryTimelinePredictor:
    
    def __init__(self):
        self.model = LinearRegression()
        
    def train_on_historical_data(self):
        """
        Use past vehicle deliveries to predict future timelines
        Features:
        - Vehicle type (sedan, SUV, truck)
        - Import country (affects customs time)
        - Season (winter = longer shipping)
        - Price range (affects customs scrutiny)
        
        Output: Predicted days for each stage
        """
        historical_vehicles = Vehicle.find({'status': 'completed'})
        
        features = []
        targets = {
            'shipment_days': [],
            'customs_days': [],
            'rmv_days': [],
            'total_days': []
        }
        
        for vehicle in historical_vehicles:
            shipment_duration = (
                vehicle.status.stages.shipment.actualArrival - 
                vehicle.purchaseInfo.purchaseDate
            ).days
            
            customs_duration = (
                vehicle.status.stages.customs.actualClearanceDate - 
                vehicle.status.stages.shipment.actualArrival
            ).days
            
            # Extract features
            feature_vector = [
                self.encode_vehicle_type(vehicle.specifications.bodyType),
                self.encode_import_country(vehicle.purchaseInfo.importCountry),
                self.get_season_code(vehicle.purchaseInfo.purchaseDate),
                vehicle.purchaseInfo.purchasePrice
            ]
            
            features.append(feature_vector)
            targets['shipment_days'].append(shipment_duration)
            targets['customs_days'].append(customs_duration)
        
        self.model.fit(features, targets['shipment_days'])
    
    def predict_timeline(self, vehicle_id):
        """
        For a new vehicle, predict:
        - Expected delivery date
        - Stage duration breakdown
        - Risk flags if prediction seems off
        """
        vehicle = Vehicle.findById(vehicle_id)
        
        features = [
            self.encode_vehicle_type(vehicle.specifications.bodyType),
            self.encode_import_country(vehicle.purchaseInfo.importCountry),
            self.get_season_code(vehicle.purchaseInfo.purchaseDate),
            vehicle.purchaseInfo.purchasePrice
        ]
        
        predicted_shipment_days = int(self.model.predict([features])[0])
        predicted_customs_days = 14  # Average
        predicted_rmv_days = 10
        
        total_predicted_days = (
            predicted_shipment_days + 
            predicted_customs_days + 
            predicted_rmv_days
        )
        
        estimated_delivery = (
            vehicle.purchaseInfo.purchaseDate + 
            timedelta(days=total_predicted_days)
        )
        
        return {
            'estimated_delivery_date': estimated_delivery,
            'stage_breakdown': {
                'shipment': predicted_shipment_days,
                'customs': predicted_customs_days,
                'rmv': predicted_rmv_days
            },
            'confidence': 0.85,
            'risk_flags': self.identify_risks(vehicle)
        }
    
    def identify_risks(self, vehicle):
        """
        Flag high-risk vehicles that may face delays:
        - Luxury vehicles (extra scrutiny)
        - Rare models (inspection delays)
        - High-price vehicles (more documentation)
        """
        risks = []
        
        if vehicle.purchaseInfo.purchasePrice > 100000:
            risks.append({
                'type': 'high_value',
                'message': 'High-value vehicles may face extended customs inspection',
                'probability': 0.7
            })
        
        if vehicle.specifications.model in LUXURY_BRANDS:
            risks.append({
                'type': 'luxury_vehicle',
                'message': 'Luxury vehicles subject to luxury tax calculation delays',
                'probability': 0.6
            })
        
        return risks
```

**Frontend Integration**:
```jsx
// components/vehicles/VehicleTimeline.jsx - Add:

<div className="timeline-prediction">
  <Card title="Predicted Timeline">
    <div>Estimated Delivery: {prediction.estimated_delivery_date}</div>
    <div>Confidence: {(prediction.confidence * 100).toFixed(0)}%</div>
    
    {prediction.risk_flags.length > 0 && (
      <Alert type="warning">
        {prediction.risk_flags.map(risk => (
          <div key={risk.type}>{risk.message}</div>
        ))}
      </Alert>
    )}
  </Card>
</div>
```

**Business Value**:
- ✅ Admin can set realistic customer expectations
- ✅ Early warning if vehicle exceeds predicted timeline
- ✅ Identify bottlenecks (e.g., if customs consistently takes 21 days, investigate)
- ✅ Improve SLA compliance

---

### Feature 2: Document Extraction & Auto-Population (VERY PRACTICAL)
**What it does**: When document uploaded, auto-extract key fields and populate forms.

```python
# server/services/aiServices/documentExtractor.py

from google.cloud import documentai_v1
import json

class SmartDocumentExtractor:
    
    def __init__(self):
        self.client = documentai_v1.DocumentProcessorServiceClient()
        # Use existing Google DocAI setup
    
    def extract_from_purchase_invoice(self, pdf_url):
        """
        Extract from invoice PDF:
        - Vehicle make, model, year, VIN
        - Engine CC, fuel type
        - Price (convert to local currency)
        - Seller details
        """
        document = self.process_document(pdf_url)
        
        extracted = {
            'vehicle': {},
            'seller': {},
            'price': {}
        }
        
        # Extract entities using DocAI
        for entity in document.entities:
            if entity.type_ == 'vehicle_make':
                extracted['vehicle']['make'] = entity.mention_text
            elif entity.type_ == 'vehicle_model':
                extracted['vehicle']['model'] = entity.mention_text
            elif entity.type_ == 'vin':
                extracted['vehicle']['vin'] = entity.mention_text
            elif entity.type_ == 'price':
                extracted['price']['amount'] = float(entity.mention_text)
            elif entity.type_ == 'currency':
                extracted['price']['currency'] = entity.mention_text
        
        return extracted
    
    def extract_from_customs_doc(self, pdf_url):
        """
        Extract from customs clearance:
        - Clearance number
        - Clearance date
        - Customs duty amount
        - VAT, surcharge amounts
        """
        document = self.process_document(pdf_url)
        
        extracted = {
            'clearance_number': None,
            'clearance_date': None,
            'duties': {}
        }
        
        for entity in document.entities:
            if entity.type_ == 'clearance_number':
                extracted['clearance_number'] = entity.mention_text
            elif entity.type_ == 'clearance_date':
                extracted['clearance_date'] = entity.mention_text
            elif entity.type_ == 'customs_duty':
                extracted['duties']['customs'] = float(entity.mention_text)
            elif entity.type_ == 'vat':
                extracted['duties']['vat'] = float(entity.mention_text)
        
        return extracted
    
    def extract_from_registration_doc(self, pdf_url):
        """
        Extract from RMV registration:
        - Registration number
        - Issue date
        - Owner name
        - Expiry date (if applicable)
        """
        document = self.process_document(pdf_url)
        
        extracted = {
            'registration_number': None,
            'issue_date': None,
            'owner_name': None,
            'expiry_date': None
        }
        
        for entity in document.entities:
            if entity.type_ == 'registration_number':
                extracted['registration_number'] = entity.mention_text
            elif entity.type_ == 'issue_date':
                extracted['issue_date'] = entity.mention_text
        
        return extracted
    
    def process_document(self, pdf_url):
        """Call Google DocAI processor"""
        # Reuse existing DocAI service
        from services.googleDocAiService import processDocument
        return processDocument(pdf_url)
```

**Backend Endpoint**:
```javascript
// POST /api/vehicles/:vehicleId/smart-extract

router.post('/:vehicleId/smart-extract', async (req, res) => {
  const { documentUrl, documentType } = req.body;
  
  const extracted = await documentExtractor.extract(
    documentUrl, 
    documentType
  );
  
  // Auto-populate vehicle or stage data
  if (documentType === 'purchase_invoice') {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    vehicle.specifications = {
      ...vehicle.specifications,
      ...extracted.vehicle
    };
    vehicle.purchaseInfo = {
      ...vehicle.purchaseInfo,
      ...extracted.price
    };
    await vehicle.save();
  }
  
  res.json({
    success: true,
    extracted,
    populated_fields: extracted
  });
});
```

**Frontend Usage**:
```jsx
// components/vehicles/DocumentGallery.jsx - After upload:

const handleDocumentUpload = async (file, documentType) => {
  // 1. Upload file to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(file);
  
  // 2. Send to smart extraction endpoint
  const { extracted } = await api.post(
    `/vehicles/${vehicleId}/smart-extract`,
    { 
      documentUrl: cloudinaryUrl,
      documentType: documentType 
    }
  );
  
  // 3. Show extracted data to user for confirmation
  showConfirmationDialog({
    title: 'Review Extracted Information',
    data: extracted,
    onConfirm: async () => {
      // User confirms, data auto-populates form fields
      updateVehicleForm(extracted);
    }
  });
};
```

**Business Value**:
- ✅ Eliminates manual data entry (reduce errors by 90%)
- ✅ Speeds up vehicle creation (from 5 min to 30 sec)
- ✅ Auto-calculates customs duties (no manual calculation)
- ✅ Creates audit trail: which fields auto-filled vs manual

---

### Feature 3: Intelligent Status Prediction & Auto-Transition (ADVANCED)
**What it does**: Uses workflow data to predict when next action is needed and trigger automatic transitions.

```python
# server/services/aiServices/workflowIntelligence.py

import numpy as np
from datetime import datetime, timedelta

class WorkflowIntelligence:
    
    def predict_next_action(self, vehicle_id):
        """
        Based on current status and historical patterns:
        - Predict when customs will clear
        - Recommend when to submit RMV
        - Flag stalled vehicles
        """
        vehicle = Vehicle.findById(vehicle_id)
        current_stage = vehicle.status.currentStage
        
        if current_stage == 'shipment':
            return self.predict_customs_arrival(vehicle)
        elif current_stage == 'customs':
            return self.predict_customs_clearance(vehicle)
        elif current_stage == 'rmv_registration':
            return self.predict_rmv_completion(vehicle)
    
    def predict_customs_clearance(self, vehicle):
        """
        Factors:
        - Days already in customs (vs average)
        - Vehicle price (higher = more scrutiny)
        - Customs backlog (real-time data)
        """
        days_in_customs = (
            datetime.now() - 
            vehicle.status.stages.customs.startDate
        ).days
        
        average_customs_time = self.get_average_customs_time(
            vehicle.purchaseInfo.importCountry
        )
        
        if days_in_customs > average_customs_time:
            return {
                'status': 'delayed',
                'message': f'Customs clearance {days_in_customs - average_customs_time} days overdue',
                'action': 'admin_follow_up_required',
                'confidence': 0.9
            }
        else:
            predicted_clearance = (
                vehicle.status.stages.customs.startDate + 
                timedelta(days=average_customs_time)
            )
            
            return {
                'status': 'on_track',
                'predicted_clearance_date': predicted_clearance,
                'days_remaining': (
                    predicted_clearance - datetime.now()
                ).days,
                'confidence': 0.8
            }
    
    def auto_transition_if_ready(self, vehicle_id):
        """
        Automatically advance stage if:
        - Required documents uploaded
        - All approvals received
        - Timeout not exceeded
        """
        vehicle = Vehicle.findById(vehicle_id)
        current_stage = vehicle.status.currentStage
        
        # Check if current stage is complete
        if self.is_stage_complete(vehicle, current_stage):
            # Auto-transition
            next_stage = self.get_next_stage(current_stage)
            
            vehicle.status.currentStage = next_stage
            vehicle.statusHistory.append({
                stage: next_stage,
                previousStatus: vehicle.status.stages[current_stage].status,
                newStatus: 'pending',
                changedBy: 'system_automation',
                changedAt: datetime.now(),
                notes: 'Auto-transitioned due to stage completion'
            })
            
            vehicle.save()
            
            # Notify customer
            self.notify_customer(vehicle_id, 
                f'Your vehicle has moved to {next_stage} stage'
            )
            
            return True
        
        return False
    
    def is_stage_complete(self, vehicle, stage):
        """Define completion criteria per stage"""
        stage_data = vehicle.status.stages[stage]
        
        completion_criteria = {
            'shipment': [
                stage_data.actualArrival is not None,
                len(stage_data.documents) > 0,
                stage_data.status == 'completed'
            ],
            'customs': [
                stage_data.actualClearanceDate is not None,
                stage_data.clearanceNumber is not None,
                stage_data.documents.any(d => d.type == 'clearance_cert')
            ],
            'rmv_registration': [
                stage_data.registrationNumber is not None,
                stage_data.actualCompletionDate is not None
            ],
            'delivery': [
                stage_data.deliveryDate is not None,
                stage_data.status == 'delivered'
            ]
        }
        
        return all(completion_criteria[stage])
    
    def get_average_customs_time(self, import_country):
        """
        Calculate average customs processing time by country
        from historical data
        """
        completed_vehicles = Vehicle.find({
            'purchaseInfo.importCountry': import_country,
            'status': 'completed'
        })
        
        times = []
        for vehicle in completed_vehicles:
            customs_duration = (
                vehicle.status.stages.customs.actualClearanceDate - 
                vehicle.status.stages.customs.startDate
            ).days
            times.append(customs_duration)
        
        return np.median(times) if times else 14  # 14 days default
```

**Backend Scheduler**:
```javascript
// server/jobs/workflowScheduler.js

const schedule = require('node-schedule');

// Run every 6 hours
const job = schedule.scheduleJob('0 */6 * * *', async () => {
  const allVehicles = await Vehicle.find({ 
    'status.currentStage': { $ne: 'completed' } 
  });
  
  for (const vehicle of allVehicles) {
    // Check if can auto-transition
    const canTransition = await workflowAI.auto_transition_if_ready(vehicle._id);
    
    // Get prediction for dashboard
    const prediction = await workflowAI.predict_next_action(vehicle._id);
    
    if (prediction.status === 'delayed') {
      // Alert admin
      await notifyAdmin(vehicle, prediction.message);
    }
  }
});
```

**Frontend Dashboard Widget**:
```jsx
// components/dashboard/PredictionWidget.jsx

export const PredictionWidget = () => {
  const [predictions, setPredictions] = useState([]);
  
  useEffect(() => {
    api.get('/workflow/predictions').then(setPredictions);
  }, []);
  
  return (
    <Card title="Workflow Predictions">
      {predictions.map(pred => (
        <div key={pred.vehicleId} className="prediction-item">
          <div>{pred.vehicleInfo}</div>
          <ProgressBar 
            value={pred.progress_percentage}
            label={pred.status}
          />
          <div className="prediction-text">
            {pred.status === 'delayed' ? (
              <Alert type="danger">{pred.message}</Alert>
            ) : (
              <div>
                Estimated: {pred.predicted_clearance_date}
                ({pred.days_remaining} days remaining)
              </div>
            )}
          </div>
          {pred.action && (
            <Button onClick={() => triggerAction(pred.action)}>
              {pred.action}
            </Button>
          )}
        </div>
      ))}
    </Card>
  );
};
```

**Business Value**:
- ✅ Reduce manual status updates (more automated)
- ✅ Identify bottlenecks in workflow (data-driven insights)
- ✅ Predict delays before they happen (proactive management)
- ✅ Improve customer satisfaction with accurate timelines
- ✅ Enable SLA-based alerts

---

## Summary of AI Features

| Feature | Implementation Time | Business Impact | Priority |
|---------|-------------------|-----------------|----------|
| **Predictive Timeline** | 1-2 weeks | High (SLA management) | High |
| **Smart Document Extraction** | 1 week | Very High (90% data entry reduction) | Very High |
| **Workflow Intelligence** | 1-2 weeks | High (Automation + insights) | High |

---

## Database Indexing Strategy (Performance)

```javascript
// server/models/Vehicle.js - Add indexes:

vehicleSchema.index({ customerId: 1, status: 1 });           // List by customer
vehicleSchema.index({ 'status.currentStage': 1 });           // Dashboard filters
vehicleSchema.index({ 'specifications.vin': 1 });            // VIN search
vehicleSchema.index({ userId: 1, createdAt: -1 });           // User's vehicles timeline
vehicleSchema.index({ 'statusHistory.changedAt': -1 });      // Recent activity
vehicleSchema.index({ 'purchaseInfo.purchaseDate': -1 });   // Timeline analysis
```

---

## Monitoring & Alerts (Production)

```javascript
// server/services/monitoringService.js

class MonitoringService {
  
  async checkHealthMetrics() {
    const metrics = {
      stalled_vehicles: await this.find_stalled_vehicles(),
      overdue_actions: await this.find_overdue_actions(),
      pending_approvals: await this.count_pending_approvals(),
      avg_stage_duration: await this.calculate_stage_durations()
    };
    
    if (metrics.stalled_vehicles.length > 0) {
      await this.alertAdmin('Stalled vehicles detected', metrics);
    }
    
    return metrics;
  }
  
  async find_stalled_vehicles() {
    // Vehicles with no status change in > 7 days
    return Vehicle.find({
      'statusHistory.changedAt': {
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      'status.currentStage': { $ne: 'completed' }
    });
  }
}
```

---

## Final Checklist Before Production

- [ ] All existing routes still working (test with old clients)
- [ ] New customer & vehicle endpoints tested
- [ ] Status workflow logic validated (all transitions work)
- [ ] OCR still processes documents correctly
- [ ] PDF generation works for new document types
- [ ] Email notifications sent on status changes
- [ ] Database indexed for common queries
- [ ] Error handling on all endpoints
- [ ] Rate limiting applied
- [ ] Authorization checks on all endpoints
- [ ] Logging enabled for debugging
- [ ] Load tested (1000+ vehicles)
- [ ] Deployment tested in staging
- [ ] Rollback plan documented
- [ ] Customer notification prepared
- [ ] Admin training completed

---

## Success Metrics (Track After Launch)

| Metric | Target | How to Measure |
|--------|--------|-----------------|
| Data entry time | < 2 min / vehicle (was 5 min) | Track form submission times |
| Error rate | < 2% | Count data corrections needed |
| Customer satisfaction | > 4.5/5 | Post-delivery survey |
| Avg delivery time | +/- 1 day of prediction | Compare actual vs predicted |
| System uptime | 99.9% | Monitoring dashboard |
| Admin efficiency | 50% less manual work | Time tracking |

---

End of Architecture Document
