import React, { useState } from 'react';

// Base Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon = null,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 active:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-level-2 hover:shadow-level-3',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    destructive: 'bg-error text-white hover:bg-red-600 active:scale-95',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-2.5 h-10 text-sm',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({
  children,
  className = '',
  onClick = null,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-surface-1 rounded-large border border-gray-200 dark:border-gray-700
        shadow-level-2 ${hoverable ? 'hover:shadow-level-3 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge / Status Component
export const Badge = ({ label, status = 'default', size = 'md' }) => {
  const statusClasses = {
    shipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    customs: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    rmv: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    delayed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full
      ${statusClasses[status]} ${sizeClasses[size]}
    `}>
      {label}
    </span>
  );
};

// Input Component
export const Input = ({
  label,
  placeholder = '',
  type = 'text',
  value = '',
  onChange = () => {},
  error = null,
  disabled = false,
  icon = null,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full h-10 px-3 py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3
            border rounded-lg bg-white dark:bg-surface-2 text-gray-700 dark:text-gray-200
            placeholder-gray-400 dark:placeholder-gray-500
            border-gray-200 dark:border-gray-700
            focus:border-2 focus:border-primary-500 focus:ring-0 focus:outline-none
            focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900
            transition-all duration-300
            ${error ? 'border-error ring-4 ring-red-100 dark:ring-red-900' : ''}
            ${disabled ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

// Select Component
export const Select = ({
  label,
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Select...',
  disabled = false,
  error = null,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full h-10 px-3 py-2 pr-10
          border rounded-lg bg-white dark:bg-surface-2 text-gray-700 dark:text-gray-200
          border-gray-200 dark:border-gray-700
          focus:border-2 focus:border-primary-500 focus:outline-none
          transition-all duration-300
          appearance-none cursor-pointer
          ${error ? 'border-error' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Checkbox Component
export const Checkbox = ({ label, checked = false, onChange = () => {}, disabled = false, className = '' }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600
          bg-white dark:bg-surface-2
          focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
          cursor-pointer
          ${checked ? 'bg-primary-500 border-primary-500' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}
        `}
      />
      {label && (
        <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({
  label,
  placeholder = '',
  value = '',
  onChange = () => {},
  rows = 4,
  error = null,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-3 py-2
          border rounded-lg bg-white dark:bg-surface-2 text-gray-700 dark:text-gray-200
          border-gray-200 dark:border-gray-700
          focus:border-2 focus:border-primary-500 focus:outline-none
          transition-all duration-300 resize-vertical
          ${error ? 'border-error' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

// Modal Component
export const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = '',
  children,
  footer = null,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative bg-white dark:bg-surface-1 rounded-large shadow-level-4
        w-11/12 ${sizeClasses[size]} max-h-screen overflow-auto
        animate-[fade-in] transition-all
      `}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-8">{children}</div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-8 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Tooltip Component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          className={`
            absolute ${positionClasses[position]}
            bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
            whitespace-nowrap z-50 pointer-events-none
            animate-[fade-in]
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Loading Skeleton
export const SkeletonLoader = ({ count = 1, height = 'h-4', className = '' }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${height} bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800
            rounded-lg animate-shimmer ${className}
          `}
        />
      ))}
    </div>
  );
};

// Spinner Component
export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-500',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Empty State Component
export const EmptyState = ({ icon, title, description, action = null }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">{description}</p>
      {action && action}
    </div>
  );
};
