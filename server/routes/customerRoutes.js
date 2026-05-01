const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authRequired = require("../middlewares/authRequired");

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
