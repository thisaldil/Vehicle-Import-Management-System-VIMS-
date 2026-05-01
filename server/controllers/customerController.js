const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

// CREATE CUSTOMER
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, country, address, companyName, companyType, notes } = req.body;

    if (!name || !email || !phone || !country) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingCustomer = await Customer.findOne({ email, userId: req.userId });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const customer = new Customer({
      userId: req.userId,
      name,
      email,
      phone,
      address: address || { country },
      companyName,
      companyType: companyType || "individual",
      notes,
      status: "active"
    });

    await customer.save();
    res.status(201).json({ success: true, customer });
  } catch (err) {
    console.error("Create customer error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// LIST CUSTOMERS
exports.listCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    let query = { userId: req.userId };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") }
      ];
    }

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
    console.error("List customers error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET CUSTOMER
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const vehicleCount = await Vehicle.countDocuments({ customerId: customer._id });
    customer.vehicleCount = vehicleCount;

    res.json({ success: true, customer });
  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const allowedFields = ["name", "phone", "address", "companyName", "companyType", "notes", "status", "preferences"];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        customer[field] = req.body[field];
      }
    });

    customer.updatedAt = new Date();
    await customer.save();

    res.json({ success: true, customer });
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE CUSTOMER (soft delete)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    customer.status = "inactive";
    customer.deactivatedAt = new Date();
    await customer.save();

    res.json({ success: true, message: "Customer deactivated" });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPLOAD DOCUMENT
exports.uploadDocument = async (req, res) => {
  try {
    const { type, url, description } = req.body;

    if (!type || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    customer.documents.push({ type, url, description, uploadedAt: new Date() });
    await customer.save();

    res.json({ success: true, documents: customer.documents });
  } catch (err) {
    console.error("Upload document error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET DOCUMENTS
exports.getDocuments = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ success: true, documents: customer.documents });
  } catch (err) {
    console.error("Get documents error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer || customer.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Customer not found" });
    }

    customer.documents = customer.documents.filter(doc => doc._id.toString() !== req.params.docId);
    await customer.save();

    res.json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET CUSTOMER VEHICLES
exports.getCustomerVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      customerId: req.params.customerId,
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json({ success: true, vehicles });
  } catch (err) {
    console.error("Get customer vehicles error:", err);
    res.status(500).json({ error: err.message });
  }
};
