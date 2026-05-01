const Vehicle = require("../models/Vehicle");
const Invoice = require("../models/Invoice");

// GET DASHBOARD SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId });
    
    const summary = {
      totalVehicles: vehicles.length,
      shipment: vehicles.filter(v => v.status.currentStage === "shipment").length,
      customs: vehicles.filter(v => v.status.currentStage === "customs").length,
      rmv_registration: vehicles.filter(v => v.status.currentStage === "rmv_registration").length,
      delivery: vehicles.filter(v => v.status.currentStage === "delivery").length,
      completed: vehicles.filter(v => v.status.currentStage === "completed").length
    };

    res.json({ success: true, summary });
  } catch (err) {
    console.error("Get summary error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET VEHICLES BY STAGE
exports.getVehiclesByStage = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId })
      .populate("customerId", "name email");

    const byStage = {
      shipment: [],
      customs: [],
      rmv_registration: [],
      delivery: [],
      completed: []
    };

    vehicles.forEach(v => {
      byStage[v.status.currentStage].push({
        _id: v._id,
        specifications: v.specifications,
        customer: v.customerInfo,
        status: v.status.stages[v.status.currentStage].status,
        priority: v.priority
      });
    });

    res.json({ success: true, byStage });
  } catch (err) {
    console.error("Get vehicles by stage error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET RECENT ACTIVITIES
exports.getRecentActivities = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .limit(50);

    const activities = [];
    vehicles.forEach(v => {
      v.events.slice(-5).forEach(event => {
        activities.push({
          vehicleId: v._id,
          vehicleName: `${v.specifications.make} ${v.specifications.model}`,
          event: event.message,
          timestamp: event.timestamp,
          stage: event.stage
        });
      });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json({ success: true, activities: activities.slice(0, 20) });
  } catch (err) {
    console.error("Get recent activities error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET PENDING ACTIONS
exports.getPendingActions = async (req, res) => {
  try {
    const stageOrder = ["shipment", "customs", "rmv_registration", "delivery"];
    const vehicles = await Vehicle.find({ userId: req.userId })
      .populate("customerId", "name");

    const pending = vehicles
      .filter(v => v.status.currentStage !== "completed")
      .map(v => ({
        vehicleId: v._id,
        vehicle: `${v.specifications.make} ${v.specifications.model}`,
        customer: v.customerInfo.customerName,
        currentStage: v.status.currentStage,
        status: v.status.stages[v.status.currentStage].status,
        priority: v.priority,
        daysPending: Math.floor(
          (Date.now() - v.status.stages[v.status.currentStage].startDate) / (1000 * 60 * 60 * 24)
        )
      }))
      .sort((a, b) => b.daysPending - a.daysPending);

    res.json({ success: true, pending });
  } catch (err) {
    console.error("Get pending actions error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET CUSTOMER METRICS
exports.getCustomerMetrics = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.userId });
    
    const customerMetrics = {};
    vehicles.forEach(v => {
      const name = v.customerInfo.customerName;
      if (!customerMetrics[name]) {
        customerMetrics[name] = {
          name,
          total: 0,
          completed: 0,
          inProgress: 0
        };
      }
      customerMetrics[name].total++;
      if (v.status.currentStage === "completed") {
        customerMetrics[name].completed++;
      } else {
        customerMetrics[name].inProgress++;
      }
    });

    const metrics = Object.values(customerMetrics)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    res.json({ success: true, metrics });
  } catch (err) {
    console.error("Get customer metrics error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET STAGE DURATIONS
exports.getStageDurations = async (req, res) => {
  try {
    const completedVehicles = await Vehicle.find({
      userId: req.userId,
      completedAt: { $exists: true }
    });

    const durations = {
      shipment: [],
      customs: [],
      rmv_registration: [],
      delivery: []
    };

    completedVehicles.forEach(v => {
      Object.keys(durations).forEach(stage => {
        if (v.status.stages[stage].startDate && v.status.stages[stage].actualArrival ||
            v.status.stages[stage].actualClearanceDate ||
            v.status.stages[stage].actualCompletionDate ||
            v.status.stages[stage].deliveryDate) {
          const endDate = v.status.stages[stage].actualArrival ||
                         v.status.stages[stage].actualClearanceDate ||
                         v.status.stages[stage].actualCompletionDate ||
                         v.status.stages[stage].deliveryDate;
          if (endDate) {
            const days = Math.floor((endDate - v.status.stages[stage].startDate) / (1000 * 60 * 60 * 24));
            durations[stage].push(days);
          }
        }
      });
    });

    const average = {};
    Object.keys(durations).forEach(stage => {
      if (durations[stage].length > 0) {
        average[stage] = Math.round(
          durations[stage].reduce((a, b) => a + b, 0) / durations[stage].length
        );
      }
    });

    res.json({ success: true, average, sampleCount: completedVehicles.length });
  } catch (err) {
    console.error("Get stage durations error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL STATS (comprehensive)
exports.getAllStats = async (req, res) => {
  try {
    const summary = await this.getSummary({ userId: req.userId }, { json: () => {} });
    const pending = await Vehicle.find({ userId: req.userId, "status.currentStage": { $ne: "completed" } });
    
    const invoices = await Invoice.find({ userId: req.userId });
    const monthlyRevenue = invoices
      .filter(inv => new Date(inv.date).getMonth() === new Date().getMonth())
      .reduce((sum, inv) => sum + (inv.priceDetails?.totalAmount || 0), 0);

    const stats = {
      totalVehicles: await Vehicle.countDocuments({ userId: req.userId }),
      completedVehicles: await Vehicle.countDocuments({ userId: req.userId, completedAt: { $exists: true } }),
      pendingVehicles: pending.length,
      monthlyRevenue,
      overallHealth: Math.round((await Vehicle.countDocuments({ userId: req.userId, completedAt: { $exists: true } }) / 
                                await Vehicle.countDocuments({ userId: req.userId })) * 100) || 0
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error("Get all stats error:", err);
    res.status(500).json({ error: err.message });
  }
};
