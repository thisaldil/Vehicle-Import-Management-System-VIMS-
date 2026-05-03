import React, { useState } from 'react';
import { Button } from './BaseComponents';

// Sidebar Navigation Component
export const Sidebar = ({ isOpen = true, onToggle = () => {} }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard' },
    { id: 'customers', label: 'Customers', icon: '👥', href: '/customers' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗', href: '/vehicles' },
    { id: 'invoices', label: 'Invoices', icon: '📄', href: '/invoices' },
    { id: 'documents', label: 'Documents', icon: '📁', href: '/documents' },
    { id: 'templates', label: 'Templates', icon: '📋', href: '/templates' },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
    { id: 'reports', label: 'Reports', icon: '📊', href: '/reports' },
    { id: 'activity', label: 'Activity Log', icon: '🕐', href: '/activity' },
  ];

  const bottomItems = [
    { id: 'help', label: 'Help', icon: '❓', href: '/help' },
    { id: 'feedback', label: 'Feedback', icon: '💬', href: '/feedback' },
  ];

  const NavItem = ({ item, isActive }) => (
    <a
      href={item.href}
      onClick={() => setActiveMenu(item.id)}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-200 cursor-pointer mb-1
        ${
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <span className="text-lg">{item.icon}</span>
      {isOpen && <span>{item.label}</span>}
    </a>
  );

  return (
    <div
      className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-surface-0 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 z-40 overflow-y-auto
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          {isOpen && <span className="font-bold text-lg text-gray-900 dark:text-white">VIMS</span>}
        </div>
      </div>

      {/* Search Bar */}
      {isOpen && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          />
        </div>
      )}

      {/* Main Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={activeMenu === item.id} />
        ))}
      </nav>

      {/* Divider */}
      <div className="px-4 my-4 border-t border-gray-200 dark:border-gray-800" />

      {/* Secondary Navigation */}
      <nav className="p-4 space-y-1">
        {secondaryItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={activeMenu === item.id} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.id} item={item} isActive={activeMenu === item.id} />
          ))}
        </nav>
      </div>
    </div>
  );
};

// Top Navbar Component
export const Navbar = ({ onMenuToggle = () => {}, isDarkMode = false, onThemeToggle = () => {} }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, type: 'status', title: 'Vehicle Status Updated', message: 'Toyota Camry moved to Customs', time: '2 hours ago' },
    { id: 2, type: 'document', title: 'Document Uploaded', message: 'Shipment docs for vehicle #123', time: '4 hours ago' },
    { id: 3, type: 'alert', title: 'RMV Delay', message: 'Vehicle #456 RMV registration delayed', time: '6 hours ago' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status':
        return '🚗';
      case 'document':
        return '📄';
      case 'alert':
        return '⚠️';
      default:
        return '📬';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-surface-1 border-b border-gray-200 dark:border-gray-800 z-30 flex items-center justify-between px-8">
      {/* Left Section - Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
      >
        ☰
      </button>

      {/* Center Section - Breadcrumb (Optional) */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Import Management</h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-surface-1 rounded-lg shadow-level-4 border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <button className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{notif.title}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{notif.message}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                <a href="#" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  View All Notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              JD
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-1 rounded-lg shadow-level-4 border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>

              <nav className="py-2">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Preferences
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Billing
                </a>
              </nav>

              <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                <button className="w-full px-4 py-2 text-sm text-error font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Layout Wrapper
export const MainLayout = ({ children, sidebarOpen = true, onSidebarToggle = () => {} }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="w-full h-screen bg-gray-50 dark:bg-surface-0 text-gray-900 dark:text-gray-100 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={onSidebarToggle} />

        {/* Navbar */}
        <Navbar
          onMenuToggle={onSidebarToggle}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Main Content Area */}
        <main
          className={`
            fixed top-16 left-0 right-0 bottom-0 overflow-auto
            transition-all duration-300
            ${sidebarOpen ? 'ml-64' : 'ml-20'}
          `}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Content Header Component
export const ContentHeader = ({ title, subtitle = '', action = null, filters = null }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {filters && <div className="flex gap-2">{filters}</div>}
        {action && action}
      </div>
    </div>
  );
};
