module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001933',
        },
        secondary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          400: '#D8B4FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        
        // Stage colors
        shipment: '#3B82F6',
        customs: '#8B5CF6',
        rmv: '#06B6D4',
        delivered: '#10B981',
        delayed: '#EF4444',
        pending: '#F59E0B',

        // Neutral palette
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Dark mode surface colors
        surface: {
          0: '#0A0E27',
          1: '#111829',
          2: '#1A1F3A',
          3: '#2D3748',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        // Display sizes
        'display-xl': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'display-l': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'display-s': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        
        // Heading sizes
        'heading-xl': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'heading-l': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-m': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-s': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        
        // Body sizes
        'body-xl': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-l': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'body-m': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-s': ['13px', { lineHeight: '19px', fontWeight: '400' }],
        
        // Caption
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },

      borderRadius: {
        'subtle': '6px',
        'standard': '8px',
        'large': '12px',
        'full': '9999px',
      },

      boxShadow: {
        'level-1': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'level-2': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'level-3': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'level-4': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        
        // Dark mode shadows
        'dark-level-1': '0 1px 2px 0 rgba(0,0,0,0.2)',
        'dark-level-2': '0 4px 6px -1px rgba(0,0,0,0.3)',
        'dark-level-3': '0 10px 15px -3px rgba(0,0,0,0.4)',
        'dark-level-4': '0 20px 25px -5px rgba(0,0,0,0.5)',
      },

      backdropBlur: {
        'xl': 'blur(20px)',
      },

      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },

      transitionDuration: {
        150: '150ms',
        300: '300ms',
        500: '500ms',
      },

      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      width: {
        'sidebar': '260px',
        'sidebar-collapsed': '80px',
      },

      height: {
        'navbar': '64px',
      },
    },
  },

  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        // Utility classes for glassmorphism
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },

        // Scrollbar styling
        '.scrollbar-hide': {
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
