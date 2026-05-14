const express = require("express");
const router = express.Router();
const rmvController = require("../controllers/rmvController");
const authRequired = require("../middlewares/authRequired");

// All routes require authentication
router.use(authRequired);

// Create RMV registration for a vehicle
router.post("/create", rmvController.createRMVRegistration);

// Get RMV registration details
router.get("/:vehicleId", rmvController.getRMVRegistration);

// Get RMV status summary
router.get("/:vehicleId/status", rmvController.getRMVStatus);

// Upload documents
router.post("/document/upload", rmvController.uploadDocument);

// Book inspection
router.post("/inspection/book", rmvController.bookInspection);

// Submit inspection results
router.post("/inspection/results", rmvController.submitInspectionResults);

// Calculate fees
router.post("/fees/calculate", rmvController.calculateFees);

// Process payment
router.post("/payment/process", rmvController.processPayment);

// Submit application to RMV
router.post("/application/submit", rmvController.submitApplication);

// Approve registration (Admin only - can add admin middleware)
router.post("/approve", rmvController.approveRegistration);

// List all RMV registrations for user
router.get("/", rmvController.listRMVRegistrations);

module.exports = router;
