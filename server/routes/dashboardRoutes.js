const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authRequired = require("../middlewares/authRequired");

router.use(authRequired);

router.get("/summary", dashboardController.getSummary);
router.get("/vehicles-by-stage", dashboardController.getVehiclesByStage);
router.get("/recent-activities", dashboardController.getRecentActivities);
router.get("/pending-actions", dashboardController.getPendingActions);
router.get("/customer-metrics", dashboardController.getCustomerMetrics);
router.get("/stage-durations", dashboardController.getStageDurations);
router.get("/all-stats", dashboardController.getAllStats);

module.exports = router;
