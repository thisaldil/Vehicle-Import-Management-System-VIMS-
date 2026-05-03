import React, { useState } from 'react';
import { Card, Button, Badge } from '../common/BaseComponents';

// Timeline Step Component
export const TimelineStep = ({
  stage,
  status = 'pending', // pending, in-progress, completed, delayed
  date = null,
  estimatedDate = null,
  events = [],
  isExpanded = false,
  onExpand = () => {},
  onStatusUpdate = () => {},
  isCurrentStage = false,
}) => {
  const stageConfig = {
    shipment: {
      title: 'Shipment',
      color: '#3B82F6',
      bgLight: '#DBEAFE',
      icon: '✈️',
      description: 'Vehicle shipment from origin',
    },
    customs: {
      title: 'Customs',
      color: '#8B5CF6',
      bgLight: '#F3E8FF',
      icon: '📋',
      description: 'Customs clearance process',
    },
    rmv: {
      title: 'RMV Registration',
      color: '#06B6D4',
      bgLight: '#CFFAFE',
      icon: '🚗',
      description: 'Vehicle registration at RMV',
    },
    delivered: {
      title: 'Delivered',
      color: '#10B981',
      bgLight: '#DCFCE7',
      icon: '✓',
      description: 'Vehicle delivered to customer',
    },
  };

  const statusConfig = {
    completed: { icon: '✓', color: '#10B981', bgColor: '#DCFCE7' },
    'in-progress': { icon: '●', color: '#0066FF', bgColor: '#DBEAFE' },
    pending: { icon: '○', color: '#9CA3AF', bgColor: '#F3F4F6' },
    delayed: { icon: '⚠', color: '#EF4444', bgColor: '#FEE2E2' },
  };

  const config = stageConfig[stage];
  const statusCfg = statusConfig[status];

  const defaultEvents = {
    shipment: [
      { id: 1, text: 'Picked up from origin port', completed: true },
      { id: 2, text: 'In transit to destination', completed: true },
      { id: 3, text: 'Arrived at destination port', completed: true },
    ],
    customs: [
      { id: 1, text: 'Customs documents submitted', completed: true },
      { id: 2, text: 'Awaiting clearance', completed: false },
      { id: 3, text: 'Inspection scheduled', completed: false },
    ],
    rmv: [
      { id: 1, text: 'RMV registration initiated', completed: false },
      { id: 2, text: 'Inspection appointment booked', completed: false },
      { id: 3, text: 'Documentation verified', completed: false },
    ],
    delivered: [
      { id: 1, text: 'Ready for delivery', completed: false },
      { id: 2, text: 'Out for delivery', completed: false },
      { id: 3, text: 'Delivered to customer', completed: false },
    ],
  };

  const displayEvents = events.length > 0 ? events : (defaultEvents[stage] || []);

  return (
    <div className="relative flex gap-6 pb-8">
      {/* Timeline Line & Node */}
      <div className="flex flex-col items-center">
        {/* Node Circle */}
        <div
          className="w-6 h-6 rounded-full border-3 flex items-center justify-center text-xs font-bold z-10 bg-white dark:bg-surface-1 transition-all"
          style={{
            borderColor: statusCfg.color,
            backgroundColor: statusCfg.bgColor,
            color: statusCfg.color,
          }}
        >
          {statusCfg.icon}
        </div>

        {/* Vertical Line (not on last item) */}
        <div
          className="w-1 h-20 mt-2"
          style={{ backgroundColor: statusCfg.color }}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 pt-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{config.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{config.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              label={status === 'in-progress' ? 'In Progress' : status === 'completed' ? 'Completed' : status === 'delayed' ? 'Delayed' : 'Pending'}
              status={status === 'in-progress' ? 'info' : status === 'completed' ? 'success' : status === 'delayed' ? 'error' : 'pending'}
            />
            {date && <span className="text-xs text-gray-500">{date}</span>}
          </div>
        </div>

        {/* Estimated Date (if in progress) */}
        {isCurrentStage && estimatedDate && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Estimated completion: <span className="font-semibold">{estimatedDate}</span></p>
        )}

        {/* Events List (Expanded) */}
        {isExpanded && (
          <Card className="mt-4 p-4 bg-gray-50 dark:bg-surface-2 border-0">
            <div className="space-y-3">
              {displayEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {event.completed ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-400">⏱</span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      event.completed
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {event.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {isCurrentStage && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusUpdate(stage)}
            >
              Update Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        )}

        {!isCurrentStage && (
          <button
            onClick={onExpand}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium mt-2"
          >
            {isExpanded ? '▼ Collapse' : '▶ Expand Details'}
          </button>
        )}
      </div>
    </div>
  );
};

// Vehicle Timeline Container (Premium Feature)
export const PremiumVehicleTimeline = ({
  vehicleData = {
    make: '2024 Toyota Camry',
    vin: '4T1BF1AK5CU123456',
    customer: 'John Smith',
    currentStage: 'customs',
  },
  onStatusUpdate = () => {},
}) => {
  const [expandedStages, setExpandedStages] = useState(['customs']); // Current stage expanded by default
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const stages = [
    {
      id: 'shipment',
      status: 'completed',
      date: 'Jan 2, 2024',
    },
    {
      id: 'customs',
      status: 'in-progress',
      estimatedDate: 'Jan 12, 2024',
      isCurrentStage: true,
    },
    {
      id: 'rmv',
      status: 'pending',
    },
    {
      id: 'delivered',
      status: 'pending',
    },
  ];

  const handleStageExpand = (stageId) => {
    setExpandedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const handleStatusUpdate = (stage) => {
    setSelectedStage(stage);
    setShowStatusModal(true);
  };

  return (
    <Card className="p-8">
      {/* Timeline Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Lifecycle Timeline</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track the complete journey of your vehicle</p>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-2">
        {stages.map((stage) => (
          <TimelineStep
            key={stage.id}
            stage={stage.id}
            status={stage.status}
            date={stage.date}
            estimatedDate={stage.estimatedDate}
            isExpanded={expandedStages.includes(stage.id)}
            onExpand={() => handleStageExpand(stage.id)}
            onStatusUpdate={handleStatusUpdate}
            isCurrentStage={stage.isCurrentStage}
          />
        ))}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          stage={selectedStage}
          onClose={() => setShowStatusModal(false)}
          onSubmit={(data) => {
            onStatusUpdate(data);
            setShowStatusModal(false);
          }}
        />
      )}
    </Card>
  );
};

// Status Update Modal
export const StatusUpdateModal = ({ stage, onClose, onSubmit }) => {
  const [status, setStatus] = useState('in-progress');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [progressItems, setProgressItems] = useState([
    { id: 1, text: 'Item 1', completed: false },
    { id: 2, text: 'Item 2', completed: false },
  ]);

  const stageNames = {
    shipment: 'Shipment',
    customs: 'Customs',
    rmv: 'RMV Registration',
    delivered: 'Delivery',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-screen overflow-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Update: {stageNames[stage]}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Status Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Current Status
          </label>
          <div className="space-y-2">
            {['in-progress', 'completed', 'delayed', 'on-hold'].map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={opt}
                  checked={status === opt}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{opt.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Progress Items */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Progress Items
          </label>
          <div className="space-y-2">
            {progressItems.map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => {
                    setProgressItems((prev) =>
                      prev.map((i) => (i.id === item.id ? { ...i, completed: e.target.checked } : i))
                    );
                  }}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Estimated Date */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Estimated Completion Date
          </label>
          <input
            type="date"
            value={estimatedDate}
            onChange={(e) => setEstimatedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-2 text-gray-900 dark:text-white"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Progress Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this stage..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-2 text-gray-900 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSubmit({
                stage,
                status,
                estimatedDate,
                notes,
                progressItems,
              });
            }}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
