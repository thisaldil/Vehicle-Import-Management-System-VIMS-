import React, { useState } from "react";

const DocumentRequirementChecklist = () => {
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Step 1: Prepare Documents",
      duration: "1-2 weeks",
      description: "Gather and prepare all required documentation",
      requirements: [
        {
          document: "Vehicle Title/Ownership Certificate",
          why: "Proves legal ownership of the vehicle",
          tips: ["Must be original or certified copy", "Should not have liens or claims", "Must be from the previous owner's name"],
          required: true,
        },
        {
          document: "Proof of Insurance",
          why: "Vehicle insurance is mandatory before registration",
          tips: [
            "Must be active and valid",
            "Must include vehicle VIN",
            "Liability coverage minimum required",
            "Must show insured person/company name",
          ],
          required: true,
        },
        {
          document: "Government-Issued ID",
          why: "Verifies identity of vehicle owner",
          tips: [
            "Passport, Driver's License, or National ID accepted",
            "Must be current and valid",
            "Must match name on vehicle title",
          ],
          required: true,
        },
        {
          document: "Bill of Sale",
          why: "Proof of vehicle purchase transaction",
          tips: [
            "Should include buyer and seller names",
            "Vehicle make, model, year, and VIN",
            "Purchase date and price",
            "Signature from both parties",
          ],
          required: true,
        },
        {
          document: "Address Proof (Utility Bill, Bank Statement, etc.)",
          why: "Verifies current residential address",
          tips: [
            "Must be recent (within 3 months)",
            "Must show your name and current address",
            "Accepted: Electric, water, gas bills, or bank statements",
          ],
          required: true,
        },
        {
          document: "Customs Clearance Certificate",
          why: "Proves vehicle has cleared customs (for imports)",
          tips: [
            "Required for imported vehicles",
            "Issued by customs authority",
            "Shows vehicle has legal entry",
          ],
          required: true,
        },
        {
          document: "Vehicle Photos",
          why: "Visual documentation of vehicle condition",
          tips: [
            "Take photos from 4 sides (front, back, left, right)",
            "Include interior photos",
            "Show overall condition clearly",
            "Include VIN plate photo",
            "Include odometer reading",
          ],
          required: false,
        },
      ],
      estimatedCost: "Free (documentation gathering)",
    },
    {
      id: 2,
      title: "Step 2: Calculate Fees & Taxes",
      duration: "1 day",
      description: "Determine total registration costs",
      requirements: [
        {
          document: "Vehicle Value",
          why: "Used to calculate sales tax (typically 5-10%)",
          tips: [
            "Use market value or purchase price",
            "Higher of actual price or assessed value",
            "Sales tax typically 6-8% depending on state",
          ],
          required: true,
        },
        {
          document: "Vehicle Weight",
          why: "Some states charge weight-based fees",
          tips: ["Found in vehicle registration documents", "Weight-based fee typically $0.50/lb", "Heavy vehicles may have higher fees"],
          required: true,
        },
        {
          document: "Vehicle Age",
          why: "Affects registration fees",
          tips: ["Older vehicles may have lower fees", "Registration structure varies by jurisdiction"],
          required: true,
        },
      ],
      fees: [
        { name: "Registration Fee", amount: "$150" },
        { name: "Title Transfer Fee", amount: "$75" },
        { name: "Inspection Fee", amount: "$50" },
        { name: "Sales Tax (6%)", amount: "Varies" },
        { name: "Weight-based Fee", amount: "Varies" },
        { name: "Environmental Fee", amount: "$25" },
        { name: "Processing Fee", amount: "$35" },
      ],
      totalEstimate: "$500-$1500",
      estimatedCost: "Varies by vehicle value",
    },
    {
      id: 3,
      title: "Step 3: Make Payment",
      duration: "1 day",
      description: "Pay registration and tax fees",
      requirements: [
        {
          document: "Payment Method",
          why: "Multiple payment options available",
          tips: [
            "Credit/Debit Card - Instant processing",
            "Bank Transfer - 2-3 business days",
            "Check - Mail payment option",
            "Online Payment Portal - Available 24/7",
          ],
          required: true,
        },
        {
          document: "Payment Confirmation",
          why: "Proof of payment completion",
          tips: ["Save receipt or confirmation number", "Screenshots acceptable", "Email confirmations work as proof"],
          required: true,
        },
      ],
      estimatedCost: "Calculated in Step 2",
    },
    {
      id: 4,
      title: "Step 4: Schedule Inspection",
      duration: "1-3 weeks",
      description: "Book vehicle safety and emissions inspection",
      requirements: [
        {
          document: "Inspection Date & Time",
          why: "Schedule vehicle inspection with RMV",
          tips: [
            "Book at least 1 week in advance",
            "Multiple time slots available",
            "Can be scheduled online or by phone",
            "Inspection typically takes 1-2 hours",
          ],
          required: true,
        },
        {
          document: "Inspection Location",
          why: "Where inspection will be conducted",
          tips: [
            "State-approved inspection stations",
            "Multiple locations available",
            "Find nearest location online",
          ],
          required: true,
        },
      ],
      inspectionTypes: [
        {
          type: "Safety Inspection",
          checks: [
            "Brakes and brake lights",
            "Steering and suspension",
            "Tires and wheels",
            "Windshield and wipers",
            "Horn and signals",
            "Lights (headlights, taillights)",
          ],
        },
        {
          type: "Emissions Test",
          checks: [
            "Engine idle emissions",
            "Fuel pressure and evaporation",
            "Catalytic converter function",
            "Exhaust system integrity",
            "OBD (On-Board Diagnostics) scan",
          ],
        },
      ],
      estimatedCost: "$50",
    },
    {
      id: 5,
      title: "Step 5: Inspection Results",
      duration: "1 day",
      description: "Submit inspection results and report",
      requirements: [
        {
          document: "Inspection Report",
          why: "Official document from inspection station",
          tips: [
            "Will be provided after inspection",
            "Contains safety and emissions results",
            "Upload PDF or photos of report",
            "Must pass both safety and emissions",
          ],
          required: true,
        },
        {
          document: "Odometer Reading",
          why: "Recorded for vehicle history tracking",
          tips: [
            "Noted during inspection",
            "Must match vehicle's actual mileage",
            "Reported to national database",
          ],
          required: true,
        },
        {
          document: "Inspection Notes",
          why: "Any additional information about inspection",
          tips: [
            "Note any repairs needed (if failed)",
            "Document inspection conditions",
            "Important for re-inspection if needed",
          ],
          required: false,
        },
      ],
      estimatedCost: "Free",
    },
    {
      id: 6,
      title: "Step 6: Submit Application",
      duration: "1 day",
      description: "Submit complete application to RMV",
      requirements: [
        {
          document: "Select Registration Office",
          why: "Choose where to submit application",
          tips: [
            "Can choose any state office",
            "Recommend closest office for easier pickup",
            "Processing time may vary by location",
          ],
          required: true,
        },
        {
          document: "Application Verification",
          why: "Ensure all information is correct",
          tips: [
            "Double-check all dates",
            "Verify VIN and vehicle details",
            "Check document completeness",
            "Review owner information",
          ],
          required: true,
        },
      ],
      timeline: [
        "Application submitted to RMV",
        "Initial review (1-2 business days)",
        "Documentation verification (2-3 business days)",
        "Final approval (2-3 business days)",
      ],
      estimatedCost: "Free",
    },
    {
      id: 7,
      title: "Step 7: Receive Registration",
      duration: "5-7 business days",
      description: "Get approved registration and license plate",
      requirements: [
        {
          document: "Registration Certificate",
          why: "Official proof of vehicle registration",
          tips: [
            "Mailed or picked up from RMV office",
            "Keep in vehicle at all times",
            "Valid for 1-2 years (varies by state)",
            "Renewal notification sent before expiration",
          ],
          required: true,
        },
        {
          document: "License Plate",
          why: "Vehicle identification plate",
          tips: [
            "Issued with registration",
            "Install on front and back of vehicle",
            "Keep bolts tight for security",
            "Cannot transfer to other vehicles",
          ],
          required: true,
        },
      ],
      nextSteps: [
        "Receive registration certificate by mail or pickup",
        "Receive license plate (new or replacement)",
        "Install license plate on vehicle",
        "Place registration certificate in glove box",
        "Set reminder for renewal date (typically 1 year)",
      ],
      estimatedCost: "Free",
    },
  ];

  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vehicle Registration Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete 7-step process for registering your imported vehicle
          </p>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Process Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Total Time</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">3-4 weeks average</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Total Cost</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">$500-$1500</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Documents Needed</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">6 primary + photos</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Success Rate</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">95% with proper docs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Accordion */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.duration}</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                    expandedStep === step.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Step Details */}
              {expandedStep === step.id && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                    <div className="space-y-3">
                      {step.requirements.map((req, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                              req.required
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            }`}>
                              {req.required ? "!" : "•"}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">{req.document}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{req.why}</p>
                              <div className="mt-2 space-y-1">
                                {req.tips.map((tip, tipIdx) => (
                                  <p key={tipIdx} className="text-xs text-gray-500 dark:text-gray-500">
                                    • {tip}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fees (if applicable) */}
                  {step.fees && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fee Breakdown</h4>
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {step.fees.map((fee, idx) => (
                          <div
                            key={idx}
                            className={`flex justify-between items-center px-4 py-3 ${
                              idx !== step.fees.length - 1
                                ? "border-b border-gray-200 dark:border-gray-700"
                                : ""
                            }`}
                          >
                            <span className="text-gray-700 dark:text-gray-300">{fee.name}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{fee.amount}</span>
                          </div>
                        ))}
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 flex justify-between items-center font-bold">
                          <span className="text-gray-900 dark:text-white">Estimated Total</span>
                          <span className="text-blue-600 dark:text-blue-400">{step.totalEstimate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inspection Types (if applicable) */}
                  {step.inspectionTypes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Inspection Details</h4>
                      <div className="space-y-3">
                        {step.inspectionTypes.map((inspection, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">{inspection.type}</p>
                            <ul className="space-y-1">
                              {inspection.checks.map((check, checkIdx) => (
                                <li
                                  key={checkIdx}
                                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                >
                                  <span>✓</span>
                                  {check}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline (if applicable) */}
                  {step.timeline && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Processing Timeline</h4>
                      <div className="space-y-2">
                        {step.timeline.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                              {idx + 1}
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps (if applicable) */}
                  {step.nextSteps && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Next Steps</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {step.nextSteps.map((nextStep, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400">✓</span>
                            {nextStep}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cost */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <span className="font-semibold">Estimated Cost:</span> {step.estimatedCost}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-6 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
            <li>✓ Always keep original documents until registration is complete</li>
            <li>✓ Register vehicle within 10 days of purchase</li>
            <li>✓ Ensure insurance is active before inspection</li>
            <li>✓ Failure in inspection may require repairs and re-inspection</li>
            <li>✓ Registration is typically valid for 1-2 years depending on jurisdiction</li>
            <li>✓ Set reminder for renewal at least 30 days before expiration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequirementChecklist;
