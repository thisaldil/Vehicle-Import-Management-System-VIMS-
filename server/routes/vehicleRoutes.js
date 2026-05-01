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
router.delete("/:vehicleId", vehicleController.deleteVehicle);

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
