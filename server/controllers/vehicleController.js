const Vehicle = require("../models/Vehicle");
const Customer = require("../models/Customer");

// CREATE VEHICLE
exports.createVehicle = async (req, res) => {
  try {
    const { customerId, specifications, purchaseInfo, notes, priority } = req.body;

    if (!customerId || !specifications || !purchaseInfo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Customer not found or unauthorized" });
    }

    const vehicle = new Vehicle({
      customerId,
      userId: req.userId,
      specifications,
      purchaseInfo,
      notes,
      priority: priority || "normal",
      status: {
        currentStage: "shipment",
        stages: {
          shipment: { status: "pending", startDate: new Date() },
          customs: { status: "pending" },
          rmv_registration: { status: "pending" },
          delivery: { status: "pending" }
        }
      },
      customerInfo: {
        customerId: customer._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone
      }
    });

    await vehicle.save();
    customer.vehicleCount = (customer.vehicleCount || 0) + 1;
    await customer.save();

    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    console.error("Create vehicle error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LIST VEHICLES
exports.listVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customerId, search } = req.query;
    let query = { userId: req.userId };

    if (status) query["status.currentStage"] = status;
    if (customerId) query.customerId = customerId;
    if (search) {
      query.$or = [
        { "specifications.vin": new RegExp(search, "i") },
        { "specifications.make": new RegExp(search, "i") },
        { "specifications.model": new RegExp(search, "i") },
        { "customerInfo.customerName": new RegExp(search, "i") }
      ];
    }

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
    console.error("List vehicles error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET VEHICLE DETAILS
exports.getVehicleDetails = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId)
      .populate("customerId")
      .populate("purchaseInfo.invoiceId");

    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ success: true, vehicle });
  } catch (err) {
    console.error("Get vehicle error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE VEHICLE
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    if (req.body.specifications) {
      vehicle.specifications = { ...vehicle.specifications, ...req.body.specifications };
    }
    if (req.body.purchaseInfo) {
      vehicle.purchaseInfo = { ...vehicle.purchaseInfo, ...req.body.purchaseInfo };
    }
    if (req.body.notes !== undefined) vehicle.notes = req.body.notes;
    if (req.body.priority) vehicle.priority = req.body.priority;

    vehicle.updatedAt = new Date();
    await vehicle.save();

    res.json({ success: true, vehicle });
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS - CORE WORKFLOW
exports.updateStatus = async (req, res) => {
  try {
    const { stage, status, notes } = req.body;

    if (!stage || !status) {
      return res.status(400).json({ error: "Stage and status required" });
    }

    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const previousStatus = vehicle.status.stages[stage]?.status;

    vehicle.status.stages[stage].status = status;

    if (status !== "pending" && !vehicle.status.stages[stage].startDate) {
      vehicle.status.stages[stage].startDate = new Date();
    }

    if (status === "completed") {
      if (stage === "shipment") {
        vehicle.status.stages.shipment.actualArrival = new Date();
      } else if (stage === "customs") {
        vehicle.status.stages.customs.actualClearanceDate = new Date();
      } else if (stage === "rmv_registration") {
        vehicle.status.stages.rmv_registration.actualCompletionDate = new Date();
      } else if (stage === "delivery") {
        vehicle.status.stages.delivery.deliveryDate = new Date();
        vehicle.status.currentStage = "completed";
        vehicle.completedAt = new Date();
      }
    }

    vehicle.statusHistory.push({
      stage,
      previousStatus,
      newStatus: status,
      changedBy: req.userId,
      changedAt: new Date(),
      notes
    });

    vehicle.events.push({
      type: "status_change",
      stage,
      title: `${stage} - ${status}`,
      message: `Status changed from ${previousStatus} to ${status}`,
      timestamp: new Date(),
      metadata: { notes }
    });

    // Auto advance to next stage if current completed
    if (status === "completed") {
      const stageOrder = ["shipment", "customs", "rmv_registration", "delivery"];
      const currentIndex = stageOrder.indexOf(stage);
      if (currentIndex < stageOrder.length - 1 && stage !== "delivery") {
        vehicle.status.currentStage = stageOrder[currentIndex + 1];
      }
    }

    await vehicle.save();
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET TIMELINE
exports.getTimeline = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const timeline = Object.keys(vehicle.status.stages).map(stage => ({
      stage,
      status: vehicle.status.stages[stage].status,
      startDate: vehicle.status.stages[stage].startDate,
      endDate:
        vehicle.status.stages[stage].actualArrival ||
        vehicle.status.stages[stage].actualClearanceDate ||
        vehicle.status.stages[stage].actualCompletionDate ||
        vehicle.status.stages[stage].deliveryDate,
      documents: vehicle.status.stages[stage].documents || [],
      events: vehicle.events.filter(e => e.stage === stage)
    }));

    res.json({ success: true, timeline });
  } catch (err) {
    console.error("Get timeline error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE SHIPMENT STAGE
exports.updateShipment = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.status.stages.shipment = {
      ...vehicle.status.stages.shipment,
      ...req.body,
      documents: req.body.documents ? [...(vehicle.status.stages.shipment.documents || []), ...req.body.documents] : vehicle.status.stages.shipment.documents
    };

    vehicle.updatedAt = new Date();
    await vehicle.save();

    res.json({ success: true, shipment: vehicle.status.stages.shipment });
  } catch (err) {
    console.error("Update shipment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CUSTOMS STAGE
exports.updateCustoms = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.status.stages.customs = {
      ...vehicle.status.stages.customs,
      ...req.body,
      documents: req.body.documents ? [...(vehicle.status.stages.customs.documents || []), ...req.body.documents] : vehicle.status.stages.customs.documents
    };

    if (req.body.duties) {
      const total =
        (req.body.duties.customsDuty || 0) +
        (req.body.duties.vat || 0) +
        (req.body.duties.surcharge || 0) +
        (req.body.duties.luxuryTax || 0) +
        (req.body.duties.environmentalCharge || 0) +
        (req.body.duties.otherCharges || 0);
      vehicle.status.stages.customs.duties.totalDuty = total;
    }

    vehicle.updatedAt = new Date();
    await vehicle.save();

    res.json({ success: true, customs: vehicle.status.stages.customs });
  } catch (err) {
    console.error("Update customs error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE RMV STAGE
exports.updateRmv = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.status.stages.rmv_registration = {
      ...vehicle.status.stages.rmv_registration,
      ...req.body,
      documents: req.body.documents ? [...(vehicle.status.stages.rmv_registration.documents || []), ...req.body.documents] : vehicle.status.stages.rmv_registration.documents
    };

    vehicle.updatedAt = new Date();
    await vehicle.save();

    res.json({ success: true, rmv: vehicle.status.stages.rmv_registration });
  } catch (err) {
    console.error("Update RMV error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE DELIVERY STAGE
exports.updateDelivery = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.status.stages.delivery = {
      ...vehicle.status.stages.delivery,
      ...req.body,
      documents: req.body.documents ? [...(vehicle.status.stages.delivery.documents || []), ...req.body.documents] : vehicle.status.stages.delivery.documents
    };

    if (req.body.status === "delivered") {
      vehicle.status.currentStage = "completed";
      vehicle.completedAt = new Date();
    }

    vehicle.updatedAt = new Date();
    await vehicle.save();

    res.json({ success: true, delivery: vehicle.status.stages.delivery });
  } catch (err) {
    console.error("Update delivery error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPLOAD DOCUMENT
exports.uploadDocument = async (req, res) => {
  try {
    const { stage, type, url, description } = req.body;

    if (!stage || !type || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    vehicle.status.stages[stage].documents.push({
      type,
      url,
      description,
      uploadedAt: new Date()
    });

    vehicle.events.push({
      type: "document_upload",
      stage,
      title: `Document uploaded to ${stage}`,
      message: `${type} document uploaded`,
      timestamp: new Date(),
      relatedDocument: url
    });

    await vehicle.save();
    res.json({ success: true, message: "Document uploaded" });
  } catch (err) {
    console.error("Upload document error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET DOCUMENTS
exports.getDocuments = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const allDocuments = [];
    Object.keys(vehicle.status.stages).forEach(stage => {
      vehicle.status.stages[stage].documents.forEach(doc => {
        allDocuments.push({ ...doc, stage });
      });
    });

    res.json({ success: true, documents: allDocuments });
  } catch (err) {
    console.error("Get documents error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE VEHICLE
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle || vehicle.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    await Vehicle.deleteOne({ _id: req.params.vehicleId });
    const customer = await Customer.findById(vehicle.customerId);
    if (customer) {
      customer.vehicleCount = Math.max(0, (customer.vehicleCount || 1) - 1);
      await customer.save();
    }

    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ error: err.message });
  }
};
