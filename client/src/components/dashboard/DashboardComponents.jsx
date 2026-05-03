import React from 'react';
import { Card, Badge, Spinner } from '../common/BaseComponents';

// KPI Card Component
export const KPICard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  trend = null,
  gradient = 'from-blue-100 to-blue-50',
  borderColor = 'border-blue-200',
  valueColor = 'text-blue-900',
  titleColor = 'text-gray-700'
}) => {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border ${borderColor} hover:shadow-level-3 relative overflow-hidden`}>
      {/* Background Icon */}
      <div className="absolute top-4 right-4 opacity-10 text-6xl">{icon}</div>

      {/* Content */}
      <div className="relative z-10">
        <p className={`text-sm font-medium ${titleColor} mb-2`}>{title}</p>
        <div className="flex items-baseline justify-between mb-2">
          <h3 className={`text-4xl font-bold ${valueColor}`}>{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>}
      </div>
    </Card>
  );
};

// Status Overview Chips
export const StatusOverview = ({ statuses = [] }) => {
  const defaultStatuses = [
    { id: 'shipment', label: 'Shipment', count: 125, color: '#DBEAFE', icon: '✈️' },
    { id: 'customs', label: 'Customs', count: 89, color: '#F3E8FF', icon: '📋' },
    { id: 'rmv', label: 'RMV', count: 234, color: '#CFFAFE', icon: '🚗' },
    { id: 'delivered', label: 'Delivered', count: 512, color: '#DCFCE7', icon: '✓' },
  ];

  const displayStatuses = statuses.length > 0 ? statuses : defaultStatuses;

  return (
    <Card className="p-4 mb-8">
      <div className="flex flex-wrap gap-4">
        {displayStatuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center gap-3 px-4 py-2 rounded-lg border hover:shadow-level-2 transition cursor-pointer"
            style={{
              backgroundColor: status.color,
              borderColor: status.color,
            }}
          >
            <span className="text-2xl">{status.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{status.label}</p>
              <p className="text-lg font-bold text-gray-900">{status.count}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Activity Feed Component
export const ActivityFeed = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'status_update',
      title: 'Vehicle Status Updated',
      description: 'Toyota Camry moved to Customs',
      vehicle: 'VIN: 4T1BF1AK5CU123456',
      time: '2 hours ago',
      icon: '🚗',
    },
    {
      id: 2,
      type: 'document',
      title: 'Document Uploaded',
      description: 'Shipment documents added',
      vehicle: 'VIN: 1HGCV51387A456789',
      time: '4 hours ago',
      icon: '📄',
    },
    {
      id: 3,
      type: 'invoice',
      title: 'Invoice Created',
      description: 'New invoice for John Smith',
      vehicle: 'Invoice #INV-2024-001',
      time: '6 hours ago',
      icon: '💰',
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Vehicle Delivered',
      description: 'Honda Civic delivered to customer',
      vehicle: 'VIN: 2HGCV51387H456789',
      time: '1 day ago',
      icon: '✓',
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const activityColors = {
    status_update: { bg: '#DBEAFE', text: '#0066FF' },
    document: { bg: '#F3E8FF', text: '#8B5CF6' },
    invoice: { bg: '#DCFCE7', text: '#10B981' },
    delivery: { bg: '#DCFCE7', text: '#10B981' },
    alert: { bg: '#FEE2E2', text: '#EF4444' },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {displayActivities.map((activity) => {
          const colors = activityColors[activity.type] || { bg: '#F3F4F6', text: '#6B7280' };
          return (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{activity.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{activity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-500">{activity.vehicle}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-4">
        <a href="#" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
          View All Activity →
        </a>
      </div>
    </Card>
  );
};

// Alert Cards Component
export const AlertCard = ({ 
  type = 'warning', 
  title, 
  description, 
  vehicle, 
  action = null,
  priority = 'medium'
}) => {
  const typeConfig = {
    error: { bg: '#FEE2E2', border: '#FECACA', icon: '⚠️', color: '#EF4444' },
    warning: { bg: '#FEF3C7', border: '#FCD34D', icon: '🔔', color: '#F59E0B' },
    info: { bg: '#DBEAFE', border: '#BFDBFE', icon: 'ℹ️', color: '#0066FF' },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className="p-4 rounded-lg border-l-4 mb-3 hover:shadow-level-2 transition"
      style={{
        backgroundColor: config.bg,
        borderLeftColor: config.color,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-gray-700 text-xs mt-1">{description}</p>
          <p className="text-gray-600 text-xs mt-2 font-mono">{vehicle}</p>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};

// Shipment Alerts Container
export const ShipmentAlerts = ({ alerts = [] }) => {
  const defaultAlerts = [
    {
      id: 1,
      type: 'error',
      title: 'Customs Clearance Delay',
      description: 'Vehicle awaiting customs inspection for 3 days',
      vehicle: 'VIN: 4T1BF1AK5CU123456',
    },
    {
      id: 2,
      type: 'warning',
      title: 'RMV Registration Due',
      description: 'RMV registration required within 2 days',
      vehicle: 'VIN: 1HGCV51387A456789',
    },
    {
      id: 3,
      type: 'info',
      title: 'Shipment Arrived',
      description: 'New shipment arrived at warehouse',
      vehicle: 'Shipment #SHP-2024-001',
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipment Alerts</h3>
      <div className="space-y-2">
        {displayAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            type={alert.type}
            title={alert.title}
            description={alert.description}
            vehicle={alert.vehicle}
          />
        ))}
      </div>
    </Card>
  );
};

// Dashboard Stats Grid
export const DashboardStatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        icon="✈️"
        title="In Shipment"
        value="125"
        subtitle="+12 this week"
        trend={{ direction: 'up', value: '+12' }}
        gradient="from-blue-100 to-blue-50"
        borderColor="border-blue-200"
        valueColor="text-blue-900"
      />
      <KPICard
        icon="📋"
        title="Customs Pending"
        value="89"
        subtitle="+5 this week"
        gradient="from-purple-100 to-purple-50"
        borderColor="border-purple-200"
        valueColor="text-purple-900"
      />
      <KPICard
        icon="🚗"
        title="RMV Required"
        value="234"
        subtitle="3 overdue"
        gradient="from-cyan-100 to-cyan-50"
        borderColor="border-cyan-200"
        valueColor="text-cyan-900"
      />
      <KPICard
        icon="✓"
        title="Delivered Today"
        value="23"
        subtitle="On schedule"
        trend={{ direction: 'up', value: '+8' }}
        gradient="from-green-100 to-green-50"
        borderColor="border-green-200"
        valueColor="text-green-900"
      />
    </div>
  );
};

// Distribution Chart Component (placeholder)
export const DistributionChart = () => {
  return (
    <Card className="p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Distribution</h3>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Chart loading...</p>
        </div>
      </div>
    </Card>
  );
};

// Complete Dashboard Component
export const Dashboard = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your current status.</p>
      </div>

      {/* KPI Cards */}
      <DashboardStatsGrid />

      {/* Status Overview */}
      <StatusOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Alerts */}
        <div>
          <ShipmentAlerts />
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-8">
        <DistributionChart />
      </div>
    </div>
  );
};
