import React, { useState } from 'react';
import { MainLayout, ContentHeader } from './layout/LayoutComponents';
import { Card, Button, Input, Select, Badge, Modal, Checkbox } from './common/BaseComponents';
import { KPICard, StatusOverview, ActivityFeed, ShipmentAlerts } from './dashboard/DashboardComponents';
import { PremiumVehicleTimeline } from './vehicles/PremiumVehicleTimeline';

/**
 * EXAMPLE PAGES - Use these as reference for building your complete application
 */

// ============================================================================
// DASHBOARD PAGE
// ============================================================================
export function DashboardPage() {
  return (
    <MainLayout>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Welcome back! Here's your current status.</p>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon="✈️"
            title="In Shipment"
            value="125"
            subtitle="+12 this week"
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
            gradient="from-green-100 to-green-50"
            borderColor="border-green-200"
            valueColor="text-green-900"
          />
        </div>

        {/* Status Overview */}
        <StatusOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <ShipmentAlerts />
        </div>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// VEHICLES LIST PAGE
// ============================================================================
export function VehiclesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const vehicles = [
    { id: 1, vin: '4T1BF1AK5CU123456', make: '2024 Toyota Camry', customer: 'John Smith', stage: 'customs', status: 'in-progress' },
    { id: 2, vin: '1HGCV51387A456789', make: '2024 Honda Civic', customer: 'Jane Doe', stage: 'delivered', status: 'completed' },
    { id: 3, vin: '2HGCV51387H456789', make: '2024 Ford F-150', customer: 'Bob Wilson', stage: 'rmv', status: 'pending' },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    if (searchQuery && !v.vin.includes(searchQuery) && !v.make.includes(searchQuery)) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (stageFilter !== 'all' && v.stage !== stageFilter) return false;
    return true;
  });

  return (
    <MainLayout>
      <ContentHeader
        title="Vehicles"
        subtitle={`${filteredVehicles.length} vehicles in your system`}
        action={<Button variant="primary">+ New Vehicle</Button>}
      />

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search VIN, make, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="🔍"
          />
          <Select
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={[
              { label: 'All Stages', value: 'all' },
              { label: 'Shipment', value: 'shipment' },
              { label: 'Customs', value: 'customs' },
              { label: 'RMV', value: 'rmv' },
              { label: 'Delivered', value: 'delivered' },
            ]}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          />
          <Select
            options={[
              { label: 'Most Recent', value: 'recent' },
              { label: 'Oldest', value: 'oldest' },
              { label: 'Make A-Z', value: 'make' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </Card>

      {/* Vehicle Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-surface-2 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">VIN</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Make/Model</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Stage</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-2 transition">
                <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">{vehicle.vin}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{vehicle.make}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.customer}</td>
                <td className="px-6 py-4">
                  <Badge label={vehicle.stage} status={vehicle.stage} />
                </td>
                <td className="px-6 py-4">
                  <Badge label={vehicle.status} status={vehicle.status === 'completed' ? 'success' : vehicle.status === 'pending' ? 'pending' : 'info'} />
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button variant="ghost" size="sm">👁️ View</Button>
                  <Button variant="ghost" size="sm">✏️ Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </MainLayout>
  );
}

// ============================================================================
// VEHICLE DETAIL PAGE
// ============================================================================
export function VehicleDetailPage({ vehicleId = '4T1BF1AK5CU123456' }) {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <MainLayout>
      {/* Vehicle Header */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-8">
          <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-6xl">
            🚗
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">2024 Toyota Camry</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Status: In Transit</p>
            <div className="flex gap-4 mt-4">
              <Badge label="In Customs" status="customs" />
              <Badge label="Active" status="info" />
            </div>
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">VIN</p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">{vehicleId}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary">Edit</Button>
            <Button variant="secondary">Archive</Button>
            <Button variant="ghost">⋯</Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        {['Timeline', 'Information', 'Documents', 'Invoices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab.toLowerCase()
                ? 'text-primary-600 dark:text-primary-400 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'timeline' && (
        <PremiumVehicleTimeline
          vehicleData={{
            make: '2024 Toyota Camry',
            vin: vehicleId,
            customer: 'John Smith',
            currentStage: 'customs',
          }}
        />
      )}

      {activeTab === 'information' && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vehicle Information</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Make</p>
              <p className="text-gray-900 dark:text-white">Toyota</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Model</p>
              <p className="text-gray-900 dark:text-white">Camry</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year</p>
              <p className="text-gray-900 dark:text-white">2024</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color</p>
              <p className="text-gray-900 dark:text-white">Silver</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Documents</h2>
          <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet.</p>
        </Card>
      )}

      {activeTab === 'invoices' && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Invoices</h2>
          <p className="text-gray-600 dark:text-gray-400">No invoices associated with this vehicle.</p>
        </Card>
      )}
    </MainLayout>
  );
}

// ============================================================================
// CUSTOMERS LIST PAGE
// ============================================================================
export function CustomersListPage() {
  const [customers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', vehicles: 5, status: 'active' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '(555) 987-6543', vehicles: 3, status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '(555) 456-7890', vehicles: 2, status: 'inactive' },
  ]);

  return (
    <MainLayout>
      <ContentHeader
        title="Customers"
        subtitle={`${customers.length} customers in your system`}
        action={<Button variant="primary">+ New Customer</Button>}
      />

      {/* Search */}
      <Card className="p-6 mb-8">
        <Input
          placeholder="Search by name, email, phone..."
          icon="🔍"
        />
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-surface-2 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Vehicles</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-2 transition">
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{customer.email}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{customer.vehicles}</td>
                <td className="px-6 py-4">
                  <Badge label={customer.status} status={customer.status === 'active' ? 'success' : 'pending'} />
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </MainLayout>
  );
}

// ============================================================================
// INVOICES PAGE
// ============================================================================
export function InvoicesPage() {
  const [invoices] = useState([
    { id: 1, number: 'INV-2024-001', customer: 'John Smith', amount: 5234.50, status: 'paid', date: 'Jan 15, 2024' },
    { id: 2, number: 'INV-2024-002', customer: 'Jane Doe', amount: 3456.75, status: 'pending', date: 'Jan 16, 2024' },
    { id: 3, number: 'INV-2024-003', customer: 'Bob Wilson', amount: 2100.00, status: 'overdue', date: 'Jan 10, 2024' },
  ]);

  return (
    <MainLayout>
      <ContentHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices`}
        action={<Button variant="primary">+ New Invoice</Button>}
      />

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="p-6 hoverable">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{invoice.number}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${invoice.amount.toFixed(2)}</p>
              </div>
              <Badge
                label={invoice.status}
                status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'pending'}
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customer}</p>
              <p className="text-xs text-gray-500 mt-2">{invoice.date}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm" className="flex-1">Download</Button>
              <Button variant="ghost" size="sm" className="flex-1">Send</Button>
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}

// ============================================================================
// SETTINGS PAGE
// ============================================================================
export function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'ABC Import Co.',
  });

  const handleSave = () => {
    // Handle save logic
    console.log('Settings saved:', profile);
  };

  return (
    <MainLayout>
      <ContentHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      {/* Profile Section */}
      <Card className="p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Input
            label="Company Name"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}

export default {
  DashboardPage,
  VehiclesListPage,
  VehicleDetailPage,
  CustomersListPage,
  InvoicesPage,
  SettingsPage,
};
