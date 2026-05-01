# VIMS Transformation - Visual Architecture

## System Integration Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    VEHICLE IMPORT MANAGEMENT SYSTEM               │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      AUTHENTICATION                         │  │
│  │              (User + JWT + Google OAuth)                   │  │
│  │                    [NO CHANGES]                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                  ▲                                 │
│                                  │                                 │
│                  ┌───────────────┼───────────────┐                │
│                  │               │               │                │
│        ┌─────────▼──────┐ ┌──────▼────────┐ ┌────▼─────────────┐ │
│        │  CUSTOMER MGMT │ │ VEHICLE MGMT  │ │ INVOICE SYSTEM   │ │
│        │   [NEW]        │ │  [NEW - CORE] │ │  [EXTENDED]      │ │
│        │                │ │               │ │                  │ │
│        │ • CRUD         │ │ • CRUD        │ │ • Keep existing  │ │
│        │ • Documents    │ │ • Status      │ │ • Add vehicleId  │ │
│        │ • Vehicles     │ │ • Timeline    │ │ • Link to stage  │ │
│        │   list         │ │ • 4 Stages    │ │                  │ │
│        │                │ │               │ │                  │ │
│        └────────────────┘ └───────────────┘ └──────────────────┘ │
│                                  │                                 │
│                  ┌───────────────┼───────────────┐                │
│                  │               │               │                │
│        ┌─────────▼──────────────┐│ ┌─────────────▼──────┐         │
│        │   WORKFLOW ORCHESTRATION││ │  DASHBOARD        │         │
│        │      [NEW]             ││ │  [EXTENDED]       │         │
│        │                        ││ │                   │         │
│        │ • Auto-transitions      ││ │ • Vehicle stats   │         │
│        │ • Status rules          ││ │ • Pipeline view   │         │
│        │ • Timeouts              ││ │ • Activity feed   │         │
│        │ • Notifications         ││ │ • Metrics         │         │
│        │                        ││ │                   │         │
│        └──────────────┬─────────┘│ └────────┬──────────┘         │
│                       │          │          │                     │
│                       └──────────┼──────────┘                     │
│                                  │                                 │
│                ┌─────────────────▼──────────────┐                │
│                │   REUSED SERVICES              │                │
│                │   [ALL UNCHANGED]              │                │
│                │                                │                │
│                │ • OCR (DocAI, HuggingFace)    │                │
│                │ • PDF Generation               │                │
│                │ • Email/WhatsApp               │                │
│                │ • Cloudinary Storage           │                │
│                │                                │                │
│                └────────────────────────────────┘                │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Model Relationships

```
                         ┌─────────────┐
                         │    USER     │
                         │  (Existing) │
                         └─────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐    ┌──────▼──────────┐
            │    CUSTOMER    │    │   INVOICE      │
            │     (NEW)      │    │  (EXTENDED)    │
            │                │    │                │
            │ • Name         │    │ • All existing │
            │ • Email        │    │ • + vehicleId  │
            │ • Phone        │    │ • + workflowStage
            │ • Address      │    │ • + customerInfo
            │ • Documents    │    │                │
            │ • Preferences  │    │                │
            └───────┬────────┘    └────────────────┘
                    │
            ┌───────▼──────────────────────────────┐
            │           VEHICLE (NEW)              │
            │       [CORE OF NEW SYSTEM]           │
            │                                      │
            │  • Specifications (make, model,     │
            │    year, VIN, engine, fuel, etc.)   │
            │                                      │
            │  • Purchase Info                     │
            │    (price, supplier, import        │
            │     country, invoiceId)             │
            │                                      │
            │  • Status Tracking [4 STAGES]       │
            │    ├─ Shipment                      │
            │    │  (pending→transit→arrived)     │
            │    ├─ Customs                       │
            │    │  (pending→clearing→cleared)    │
            │    ├─ RMV Registration              │
            │    │  (pending→progress→completed)  │
            │    └─ Delivery                      │
            │       (pending→ready→delivered)     │
            │                                      │
            │  • Status History (audit trail)     │
            │  • Events (timeline visualization)  │
            │  • Media (photos, videos, docs)     │
            │  • Financials (costs, taxes)        │
            │                                      │
            └──────────────────────────────────────┘
```

---

## Vehicle Lifecycle Workflow

```
                        VEHICLE LIFECYCLE
                        
         ┌──────────────────────────────────────────┐
         │   CUSTOMER CREATES VEHICLE                │
         │   (Link purchase invoice)                 │
         └────────────────┬─────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────────┐
         │ STAGE 1: SHIPMENT                         │
         │                                          │
         │ Status: pending → in_transit → completed │
         │ Duration: 1-6 weeks                      │
         │                                          │
         │ Actions:                                 │
         │ • Enter tracking number & carrier       │
         │ • Upload shipping docs                  │
         │ • Confirm arrival                       │
         │                                          │
         │ Outputs: Tracking info, arrival date    │
         └────────────────┬─────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────────┐
         │ STAGE 2: CUSTOMS CLEARANCE               │
         │                                          │
         │ Status: pending → clearing → cleared     │
         │ Duration: 1-3 weeks                      │
         │                                          │
         │ Actions:                                 │
         │ • Submit customs declaration (auto)     │
         │ • Upload supporting docs                │
         │ • Calculate & enter duty breakdown      │
         │ • Upload clearance certificate          │
         │                                          │
         │ Auto: Duty calculation from invoice     │
         │ Outputs: Clearance #, duties            │
         └────────────────┬─────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────────┐
         │ STAGE 3: RMV REGISTRATION                │
         │                                          │
         │ Status: pending → progress → completed   │
         │ Duration: 1-2 weeks                      │
         │                                          │
         │ Actions:                                 │
         │ • Collect customer documents            │
         │ • Submit RMV application                │
         │ • Schedule inspection                   │
         │ • Upload registration certificate       │
         │                                          │
         │ Outputs: Registration #, RC             │
         └────────────────┬─────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────────┐
         │ STAGE 4: DELIVERY                        │
         │                                          │
         │ Status: pending → ready → delivered      │
         │ Duration: 1-5 days                       │
         │                                          │
         │ Actions:                                 │
         │ • Schedule delivery date/location       │
         │ • Upload delivery proof (photos)        │
         │ • Collect customer signature            │
         │ • Generate final invoice                │
         │                                          │
         │ Outputs: Final invoice, delivery proof  │
         └────────────────┬─────────────────────────┘
                          │
                          ▼
         ┌──────────────────────────────────────────┐
         │ COMPLETED                                │
         │                                          │
         │ Vehicle status = "completed"            │
         │ Full lifecycle documented & archived    │
         └──────────────────────────────────────────┘
```

---

## Backend Route Structure

```
/api/
├── auth/                    [EXISTING]
│   ├── login
│   ├── register
│   └── google-login
│
├── invoices/                [EXISTING + EXTENDED]
│   ├── POST   /upload       (OCR unchanged)
│   ├── POST   /             (+ vehicleId field)
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /upload-ticket
│   └── POST   /email
│
├── templates/               [EXISTING]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── customers/               [NEW]
│   ├── POST   /             (create)
│   ├── GET    /             (list with pagination)
│   ├── GET    /:customerId  (get with vehicle count)
│   ├── PUT    /:customerId  (update)
│   ├── DELETE /:customerId  (soft delete)
│   ├── POST   /:customerId/documents
│   ├── GET    /:customerId/documents
│   ├── DELETE /:customerId/documents/:docId
│   └── GET    /:customerId/vehicles
│
├── vehicles/                [NEW - LARGEST]
│   ├── POST   /             (create)
│   ├── GET    /             (list with filters: status, customerId)
│   ├── GET    /:vehicleId   (get details + timeline)
│   ├── PUT    /:vehicleId   (update specs)
│   │
│   ├── PATCH  /:vehicleId/status          (update status)
│   ├── GET    /:vehicleId/timeline        (get events)
│   │
│   ├── PUT    /:vehicleId/stages/shipment
│   ├── PUT    /:vehicleId/stages/customs
│   ├── PUT    /:vehicleId/stages/rmv_registration
│   ├── PUT    /:vehicleId/stages/delivery
│   │
│   ├── POST   /:vehicleId/documents
│   ├── GET    /:vehicleId/documents
│   ├── DELETE /:vehicleId/documents/:docId
│   │
│   └── GET    /search?vin=ABC123
│
├── workflow/                [NEW]
│   ├── POST   /:vehicleId/advance-stage
│   ├── POST   /:vehicleId/trigger-action
│   ├── GET    /stats
│   └── GET    /pending
│
└── dashboard/               [NEW]
    ├── GET    /summary              (vehicle counts by stage)
    ├── GET    /vehicles-by-stage
    ├── GET    /recent-activities
    ├── GET    /customer-metrics
    └── GET    /revenue-summary
```

---

## Frontend Component Tree

```
App
├── Layout (+ NEW routes)
│   ├── Sidebar Navigation
│   │   ├── Dashboard
│   │   ├── Invoices         [EXISTING]
│   │   ├── Customers        [NEW]
│   │   ├── Vehicles         [NEW]
│   │   └── Templates        [EXISTING]
│   │
│   └── MainContent
│       │
│       ├── /dashboard       [EXTENDED]
│       │   ├── Dashboard.jsx
│       │   ├── PipelineView.jsx      [NEW]
│       │   ├── ActivityFeed.jsx      [NEW]
│       │   └── MetricsCards.jsx      [NEW]
│       │
│       ├── /customers       [NEW]
│       │   ├── CustomerList.jsx
│       │   ├── CustomerDetail.jsx
│       │   ├── CustomerForm.jsx
│       │   └── DocumentUpload.jsx
│       │
│       ├── /vehicles        [NEW]
│       │   ├── VehicleList.jsx
│       │   ├── VehicleDetail.jsx     [CORE COMPONENT]
│       │   │   ├── VehicleTimeline.jsx    [KEY - Shows 4 stages]
│       │   │   ├── StageCard.jsx         [Reusable stage display]
│       │   │   ├── DocumentGallery.jsx
│       │   │   └── ActivityLog.jsx
│       │   ├── VehicleForm.jsx
│       │   └── StatusUpdateModal.jsx
│       │
│       ├── /invoices        [EXISTING + MINOR CHANGES]
│       │   ├── AllInvoices.jsx
│       │   └── CarInvoiceForm.jsx    [MODIFIED - add vehicle linking]
│       │
│       └── /templates        [EXISTING]
│           ├── TemplateManager.jsx
│           ├── TemplateEditor.jsx
│           └── RichTextEditor.jsx
```

---

## Status Transition Matrix

```
SHIPMENT STAGE:
    pending    ──→ in_transit    ──→ completed
    (manual)       (manual)       (manual)
                                    │
                                    └──→ AUTO: Move to Customs

CUSTOMS STAGE:
    pending    ──→ under_clearance ──→ cleared
    (auto doc)     (await approval)    (manual upload)
                                          │
                                          └──→ AUTO: Move to RMV
                          ↓
                       on_hold  ──→ under_clearance (retry)

RMV REGISTRATION STAGE:
    pending    ──→ in_progress   ──→ completed
    (manual)       (await RMV)       (manual upload)
                                          │
                                          └──→ AUTO: Move to Delivery
                        ↓
                     rejected ──→ in_progress (resubmit)

DELIVERY STAGE:
    pending    ──→ ready        ──→ scheduled   ──→ delivered
    (manual)       (manual)        (auto)          (manual)
                                                      │
                                                      └──→ STATUS = COMPLETED
```

---

## Database Schema Hierarchy

```
┌─ Customer (Collection)
│   ├─ Basic Fields: name, email, phone, address
│   ├─ Documents: [{type, url, uploadedAt}]
│   ├─ Preferences: {receiveUpdates, channel, language}
│   └─ Metadata: status, notes, createdAt, updatedAt
│
└─ Vehicle (Collection)    ◄─── LARGEST & MOST COMPLEX
    ├─ Ownership: customerId, userId
    ├─ Specifications: {make, model, year, vin, engine, fuel, etc.}
    ├─ Purchase Info: {price, supplier, invoiceId, importCountry}
    │
    ├─ Status Object:
    │   ├─ currentStage: (shipment|customs|rmv|delivery|completed)
    │   └─ stages: {
    │       ├─ shipment: {
    │       │   status, startDate, estimatedArrival, actualArrival,
    │       │   carrier, trackingNumber, documents: [{type, url}]
    │       │}
    │       ├─ customs: {
    │       │   status, startDate, clearanceDate,
    │       │   clearanceNumber, duties: {customsDuty, vat, tax, total},
    │       │   documents: [{type, url}]
    │       │}
    │       ├─ rmv_registration: {
    │       │   status, startDate, registrationNumber, plateNumber,
    │       │   documents: [{type, url}]
    │       │}
    │       └─ delivery: {
    │           status, readyDate, deliveryDate, location,
    │           documents: [{type, url}]
    │       }
    │   }
    │
    ├─ Status History: [{stage, previousStatus, newStatus, changedBy, changedAt}]
    ├─ Events (Timeline): [{type, stage, title, message, timestamp}]
    ├─ Media: {photos: [{url, caption}], documents: [{type, url}]}
    ├─ Financials: {totalCost, taxApplied, profitMargin}
    └─ Metadata: notes, priority, tags, createdAt, updatedAt
```

---

## Data Flow: Creating Vehicle & Updating Status

```
STEP 1: CREATE VEHICLE
────────────────────────────────────────────────

Frontend (VehicleForm.jsx)
    ├─ User selects Customer
    ├─ Enters Vehicle specs (make, model, VIN, etc.)
    ├─ Enters Purchase info (price, supplier, invoice link)
    └─ Clicks "Create Vehicle"
            │
            ▼
    POST /api/vehicles
    {
        customerId: "5f...",
        specifications: {...},
        purchaseInfo: {...}
    }
            │
            ▼
    vehicleController.createVehicle()
    ├─ Verify customer exists & belongs to user
    ├─ Create Vehicle document with:
    │   - status.currentStage = "shipment"
    │   - status.stages.shipment.status = "pending"
    │   - status.stages.shipment.startDate = now
    │   - Empty statusHistory & events arrays
    └─ Update customer.vehicleCount++
            │
            ▼
    Return Vehicle object
            │
            ▼
    Frontend: Navigate to /vehicles/:vehicleId


STEP 2: UPDATE STATUS (Example: Shipment Arrived)
────────────────────────────────────────────────

Frontend (VehicleTimeline.jsx)
    ├─ User in Shipment stage card
    ├─ Clicks "Mark as Arrived"
    ├─ Enters: actualArrival date, tracking confirmation
    └─ Clicks "Update Status"
            │
            ▼
    PATCH /api/vehicles/:vehicleId/status
    {
        stage: "shipment",
        status: "completed",
        notes: "Arrived at port"
    }
            │
            ▼
    vehicleController.updateStatus()
    ├─ Get previous status ("in_transit")
    ├─ Update: status.stages.shipment.status = "completed"
    ├─ Add to statusHistory: {
    │   stage: "shipment",
    │   previousStatus: "in_transit",
    │   newStatus: "completed",
    │   changedBy: userId,
    │   changedAt: now
    │}
    ├─ Add to events: {
    │   type: "status_change",
    │   stage: "shipment",
    │   message: "Shipment arrived",
    │   timestamp: now
    │}
    └─ Check if can auto-advance to customs (yes!)
            │
            ▼
    Save Vehicle
            │
            ▼
    Trigger workflowOrchestrator.autoAdvanceStage()
    ├─ Detect: shipment is completed
    └─ Move status.currentStage = "customs"
    └─ Trigger email to customer
            │
            ▼
    Return updated Vehicle
            │
            ▼
    Frontend: Refresh timeline
    ├─ Shipment card now shows "completed"
    ├─ Customs card now active with "pending"
    └─ New events visible in activity log
```

---

## Reuse of Existing Systems

```
EXISTING SYSTEM                  HOW IT'S REUSED IN NEW SYSTEM
────────────────────────────────────────────────────────────

OCR Pipeline                     NEW: Extract from:
(Google DocAI, HuggingFace,      • Customs documents → duty amounts
 Mindee, Tesseract)              • Registration docs → registration #
                                 • Shipping docs → tracking confirmation
                                 (All else unchanged)

PDF Generation                   NEW: Generate PDFs for:
(@react-pdf/renderer)            • Customs duty invoice
                                 • RMV registration summary
                                 • Delivery slip
                                 • Vehicle timeline report
                                 (Keep existing invoice PDFs)

Email System                      NEW: Send emails on:
(Nodemailer)                      • Shipment arrived
                                 • Customs cleared
                                 • Registration approved
                                 • Vehicle ready for delivery
                                 • Vehicle delivered
                                 (Infrastructure unchanged)

File Storage                      NEW: Store:
(Cloudinary)                      • Vehicle photos
                                 • Shipping documents
                                 • Customs certificates
                                 • Registration documents
                                 (Same integration)

Authentication                   NEW: Use for:
(JWT + Google OAuth)             • Protect all new routes
                                 • Track who changed status
                                 • Customer access control
                                 (Zero changes needed)

Invoice System                    EXTENDED: Each vehicle links to:
(Existing model)                 • Purchase invoice
                                 • Customs duty invoice (new)
                                 • Final delivery invoice (new)
                                 (Keep all existing functionality)
```

---

## Implementation Timeline

```
WEEK 1: Foundation
├─ Create Customer.js model
├─ Create Vehicle.js model
├─ Create migration script
└─ Update server.js to load models

WEEK 2: Backend APIs
├─ Build customerController.js
├─ Build vehicleController.js (LARGEST)
├─ Build workflowController.js
├─ Build dashboardController.js
├─ Create all route files
└─ Register routes in server.js

WEEK 3: Customer UI
├─ Build CustomerList.jsx
├─ Build CustomerForm.jsx
├─ Build CustomerDetail.jsx
└─ Add routes to Layout

WEEK 4: Vehicle UI + Timeline
├─ Build VehicleList.jsx
├─ Build VehicleForm.jsx
├─ Build VehicleTimeline.jsx ◄─ KEY COMPONENT
├─ Build VehicleDetail.jsx
└─ Add routes to Layout

WEEK 5: Integration & Dashboard
├─ Extend Dashboard.jsx
├─ Build PipelineView.jsx
├─ Build ActivityFeed.jsx
├─ Modify CarInvoiceForm.jsx for vehicle linking
└─ Real-time updates (optional)

WEEK 6: Hardening + AI
├─ Add validation & error handling
├─ Performance optimization & indexes
├─ Security review
├─ Add AI features (predictive timeline, doc extraction)
├─ Load testing
└─ Deploy to production
```

---

## Success Indicators

✅ All existing features work without changes
✅ Customer CRUD working, testing with Postman
✅ Vehicle CRUD working, status updates working
✅ Timeline visualization shows all 4 stages
✅ Workflow auto-transitions working correctly
✅ Dashboard shows vehicle statistics
✅ No breaking changes to Invoice system
✅ OCR, PDF, Email still working as before
✅ Load test: 1000+ vehicles handled efficiently
✅ Customer can see vehicle status online

---

This is your complete visual guide to the transformation!
