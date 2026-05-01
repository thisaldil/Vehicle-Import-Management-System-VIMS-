# VIMS Transformation - Quick Start Guide

## Your Next Steps (Priority Order)

### Week 1: Foundation Setup

#### Step 1: Verify Models Are Loaded
File: `server/api/server.js`

Add these lines after existing model requires:
```javascript
require("../models/Customer");    // NEW
require("../models/Vehicle");      // NEW
```

#### Step 2: Create Database Migration (Optional but Recommended)
File: `server/scripts/migrateInvoices.js`

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // For each user, create a default customer
  const users = await User.find();
  
  for (const user of users) {
    const existingCustomer = await Customer.findOne({
      userId: user._id,
      name: "Default Customer"
    });
    
    if (!existingCustomer) {
      await Customer.create({
        userId: user._id,
        name: "Default Customer",
        email: user.email,
        phone: "Not provided",
        country: "Not provided",
        status: "active"
      });
      console.log(`Created default customer for ${user.email}`);
    }
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
```

Run: `node server/scripts/migrateInvoices.js`

---

### Week 2: Start Building Backend

#### Step 3: Create Customer Routes File
File: `server/routes/customerRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authRequired = require("../middlewares/authRequired");

// Protect all routes
router.use(authRequired);

// CRUD
router.post("/", customerController.createCustomer);
router.get("/", customerController.listCustomers);
router.get("/:customerId", customerController.getCustomer);
router.put("/:customerId", customerController.updateCustomer);
router.delete("/:customerId", customerController.deleteCustomer);

// Documents
router.post("/:customerId/documents", customerController.uploadDocument);
router.get("/:customerId/documents", customerController.getDocuments);
router.delete("/:customerId/documents/:docId", customerController.deleteDocument);

// Vehicles
router.get("/:customerId/vehicles", customerController.getCustomerVehicles);

module.exports = router;
```

#### Step 4: Create Customer Controller (Skeleton)
File: `server/controllers/customerController.js`

```javascript
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

// Create customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, country, ...rest } = req.body;
    
    // Validate
    if (!name || !email || !phone || !country) {
      return res.status(400).json({ 
        error: "Missing required fields: name, email, phone, country" 
      });
    }
    
    const customer = new Customer({
      userId: req.userId,
      name,
      email,
      phone,
      address: { country },
      ...rest
    });
    
    await customer.save();
    
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// List customers
exports.listCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = { userId: req.userId };
    if (status) query.status = status;
    
    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Customer.countDocuments(query);
    
    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single customer
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    // Get vehicle count
    const vehicleCount = await Vehicle.countDocuments({
      customerId: customer._id
    });
    
    customer.vehicleCount = vehicleCount;
    
    res.json({
      success: true,
      customer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    // Update allowed fields
    const allowedFields = ['name', 'phone', 'address', 'notes', 'status', 'preferences'];
    allowedFields.forEach(field => {
      if (req.body[field]) {
        customer[field] = req.body[field];
      }
    });
    
    customer.updatedAt = new Date();
    await customer.save();
    
    res.json({
      success: true,
      message: "Customer updated successfully",
      customer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete customer (soft delete)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    customer.status = "inactive";
    customer.deactivatedAt = new Date();
    await customer.save();
    
    res.json({
      success: true,
      message: "Customer deactivated successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { type, url, description } = req.body;
    
    if (!type || !url) {
      return res.status(400).json({ 
        error: "Missing required fields: type, url" 
      });
    }
    
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    customer.documents.push({
      type,
      url,
      description,
      uploadedAt: new Date()
    });
    
    await customer.save();
    
    res.json({
      success: true,
      message: "Document uploaded successfully",
      documents: customer.documents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get documents
exports.getDocuments = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    res.json({
      success: true,
      documents: customer.documents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    customer.documents = customer.documents.filter(
      doc => doc._id.toString() !== req.params.docId
    );
    
    await customer.save();
    
    res.json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer vehicles
exports.getCustomerVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      customerId: req.params.customerId,
      userId: req.userId
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      vehicles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

#### Step 5: Register Routes in server.js
File: `server/api/server.js`

Add after existing route registrations:
```javascript
// NEW ROUTES
app.use("/api/customers", require("../routes/customerRoutes"));
```

#### Step 6: Test with Postman
```
POST /api/customers
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+94771234567",
  "country": "Sri Lanka"
}

GET /api/customers
GET /api/customers/:customerId
```

---

### Week 3: Build Vehicle Controller

#### Step 7: Create Vehicle Routes
File: `server/routes/vehicleRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const authRequired = require("../middlewares/authRequired");

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

#### Step 8: Create Skeleton Vehicle Controller
File: `server/controllers/vehicleController.js` (start with this)

```javascript
const Vehicle = require("../models/Vehicle");
const Customer = require("../models/Customer");

// Create vehicle
exports.createVehicle = async (req, res) => {
  try {
    const {
      customerId,
      specifications,
      purchaseInfo,
      ...rest
    } = req.body;
    
    // Validate
    if (!customerId || !specifications || !purchaseInfo) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }
    
    // Verify customer belongs to user
    const customer = await Customer.findById(customerId);
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Customer not found" });
    }
    
    const vehicle = new Vehicle({
      customerId,
      userId: req.userId,
      specifications,
      purchaseInfo,
      status: {
        currentStage: "shipment",
        stages: {
          shipment: { status: "pending", startDate: new Date() },
          customs: { status: "pending" },
          rmv_registration: { status: "pending" },
          delivery: { status: "pending" }
        }
      },
      ...rest
    });
    
    await vehicle.save();
    
    // Update customer vehicle count
    customer.vehicleCount = (customer.vehicleCount || 0) + 1;
    await customer.save();
    
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List vehicles
exports.listVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customerId } = req.query;
    
    let query = { userId: req.userId };
    
    if (status) query["status.currentStage"] = status;
    if (customerId) query.customerId = customerId;
    
    const vehicles = await Vehicle.find(query)
      .populate("customerId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Vehicle.countDocuments(query);
    
    res.json({
      success: true,
      data: vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get vehicle details
exports.getVehicleDetails = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId)
      .populate("customerId")
      .populate("purchaseInfo.invoiceId");
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    res.json({
      success: true,
      vehicle
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    // Update specifications and purchase info
    if (req.body.specifications) {
      vehicle.specifications = { ...vehicle.specifications, ...req.body.specifications };
    }
    if (req.body.purchaseInfo) {
      vehicle.purchaseInfo = { ...vehicle.purchaseInfo, ...req.body.purchaseInfo };
    }
    if (req.body.notes) vehicle.notes = req.body.notes;
    if (req.body.priority) vehicle.priority = req.body.priority;
    
    vehicle.updatedAt = new Date();
    await vehicle.save();
    
    res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status (CORE WORKFLOW METHOD)
exports.updateStatus = async (req, res) => {
  try {
    const { stage, status, notes, documents } = req.body;
    
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    // Get previous status for history
    const previousStatus = vehicle.status.stages[stage]?.status;
    
    // Update stage status
    vehicle.status.stages[stage].status = status;
    
    // Set dates based on status
    if (status !== "pending" && !vehicle.status.stages[stage].startDate) {
      vehicle.status.stages[stage].startDate = new Date();
    }
    
    if (status === "completed" && !vehicle.status.stages[stage].completedAt) {
      vehicle.status.stages[stage].completedAt = new Date();
    }
    
    // Add to history
    vehicle.statusHistory.push({
      stage,
      previousStatus,
      newStatus: status,
      changedBy: req.userId,
      changedAt: new Date(),
      notes
    });
    
    // Add to timeline
    vehicle.events.push({
      type: "status_change",
      stage,
      title: `${stage} - ${status}`,
      message: `Status changed from ${previousStatus} to ${status}`,
      timestamp: new Date(),
      metadata: { notes }
    });
    
    await vehicle.save();
    
    // TODO: Send notification to customer
    
    res.json({
      success: true,
      message: "Status updated successfully",
      vehicle
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get timeline
exports.getTimeline = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    // Build timeline data for frontend
    const timeline = Object.keys(vehicle.status.stages).map(stage => {
      const stageData = vehicle.status.stages[stage];
      
      return {
        stage,
        status: stageData.status,
        startDate: stageData.startDate,
        endDate: stageData.actualArrival || stageData.actualClearanceDate || stageData.actualCompletionDate || stageData.deliveryDate,
        documents: stageData.documents || [],
        events: vehicle.events.filter(e => e.stage === stage)
      };
    });
    
    res.json({
      success: true,
      timeline
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update shipment stage
exports.updateShipment = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    vehicle.status.stages.shipment = {
      ...vehicle.status.stages.shipment,
      ...req.body
    };
    
    vehicle.updatedAt = new Date();
    await vehicle.save();
    
    res.json({
      success: true,
      shipment: vehicle.status.stages.shipment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customs stage
exports.updateCustoms = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    vehicle.status.stages.customs = {
      ...vehicle.status.stages.customs,
      ...req.body
    };
    
    // Calculate total duty if individual duties provided
    if (req.body.duties) {
      const total =
        (req.body.duties.customsDuty || 0) +
        (req.body.duties.vat || 0) +
        (req.body.duties.surcharge || 0) +
        (req.body.duties.luxuryTax || 0) +
        (req.body.duties.otherCharges || 0);
      
      vehicle.status.stages.customs.duties.totalDuty = total;
    }
    
    vehicle.updatedAt = new Date();
    await vehicle.save();
    
    res.json({
      success: true,
      customs: vehicle.status.stages.customs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update RMV stage
exports.updateRmv = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    vehicle.status.stages.rmv_registration = {
      ...vehicle.status.stages.rmv_registration,
      ...req.body
    };
    
    vehicle.updatedAt = new Date();
    await vehicle.save();
    
    res.json({
      success: true,
      rmv: vehicle.status.stages.rmv_registration
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update delivery stage
exports.updateDelivery = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    vehicle.status.stages.delivery = {
      ...vehicle.status.stages.delivery,
      ...req.body
    };
    
    // If delivered, mark vehicle as completed
    if (req.body.status === "delivered") {
      vehicle.status.currentStage = "completed";
      vehicle.completedAt = new Date();
    }
    
    vehicle.updatedAt = new Date();
    await vehicle.save();
    
    res.json({
      success: true,
      delivery: vehicle.status.stages.delivery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const { stage, type, url, description } = req.body;
    
    if (!stage || !type || !url) {
      return res.status(400).json({
        error: "Missing required fields: stage, type, url"
      });
    }
    
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    // Add to stage documents
    vehicle.status.stages[stage].documents.push({
      type,
      url,
      description,
      uploadedAt: new Date()
    });
    
    // Add to timeline
    vehicle.events.push({
      type: "document_upload",
      stage,
      title: `Document uploaded to ${stage}`,
      message: `${type} document uploaded`,
      timestamp: new Date(),
      relatedDocument: url
    });
    
    await vehicle.save();
    
    res.json({
      success: true,
      message: "Document uploaded successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get documents
exports.getDocuments = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    // Collect all documents from all stages
    const allDocuments = [];
    
    Object.keys(vehicle.status.stages).forEach(stage => {
      vehicle.status.stages[stage].documents.forEach(doc => {
        allDocuments.push({
          ...doc,
          stage
        });
      });
    });
    
    res.json({
      success: true,
      documents: allDocuments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

#### Step 9: Register Vehicle Routes
File: `server/api/server.js`

```javascript
app.use("/api/vehicles", require("../routes/vehicleRoutes"));
```

---

## Testing Checklist

### Backend Testing (Postman)
```
✓ POST /api/customers (create)
✓ GET /api/customers (list)
✓ POST /api/vehicles (create)
✓ PATCH /api/vehicles/:id/status (update status)
✓ PUT /api/vehicles/:id/stages/customs (update customs)
✓ POST /api/vehicles/:id/documents (upload doc)
```

### Existing Features Still Work
```
✓ POST /api/invoices/upload (OCR still works)
✓ POST /api/invoices (save invoice)
✓ GET /api/invoices (list invoices)
✓ User login/auth
```

---

## What's Next After Backend

1. **Frontend**: Build React components for customers & vehicles
2. **Dashboard**: Add overview page
3. **Integration**: Connect CarInvoiceForm to vehicle system
4. **AI Features**: Add predictive timeline & document extraction

---

## Common Issues & Solutions

### Issue: Customer not found
→ Verify userId matches in middleware: `req.userId` set by `authRequired`

### Issue: VIN duplicate error
→ VIN is unique, sparse index. Can be null for multiple records.

### Issue: Authorization errors
→ Check `userId` matches when finding customer/vehicle

### Issue: Dates not saving
→ Ensure dates are JavaScript Date objects, not strings

---

## Database Connection Troubleshooting

If models not loading:
1. Verify `MONGODB_URI` environment variable
2. Check database connection in `server/database.js`
3. Ensure models required before routes in `server.js`
4. Check no circular dependencies in models

---

## Need Help?

Refer to the full architecture document: `ARCHITECTURE_TRANSFORMATION.md`

Key sections:
- Database Design (Schema details)
- Backend Changes (All endpoint specs)
- Workflow Design (Business logic)
- Step-by-Step Implementation (Full roadmap)
