/**
 * @aura/design-system - Tokens & Visual Design Language
 * Next-Generation Clinical & Virtual Health Platform
 */

export const auraTokens = {
  colors: {
    // Primary Clinical Anchor (Calm, authoritative, clean)
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0D746F', // Main brand primary
      800: '#115E59',
      900: '#134E4A',
      950: '#042F2E',
    },
    // Soothing Neutrals (Readable, accessible surfaces without harsh glare)
    slate: {
      50: '#F8FAFC', // Standard background
      100: '#F1F5F9', // Card hover / subtle border
      200: '#E2E8F0', // Card stroke
      300: '#CBD5E1', // Divider
      400: '#94A3B8', // Subdued text
      500: '#64748B', // Secondary text
      600: '#475569', // Body text
      700: '#334155', // Subheadings
      800: '#1E293B', // Headings
      900: '#0F172A', // High contrast clinical primary text
      950: '#020617',
    },
    // Success & Verified Status
    emerald: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      500: '#10B981',
      600: '#059669', // Verified passport / confirmed appointment
      700: '#047857',
    },
    // Warnings & Expirations
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B',
      600: '#D97706', // Safeguarding / license expiring soon
      700: '#B45309',
    },
    // Critical Alerts & Allergies
    rose: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      500: '#F43F5E',
      600: '#E11D48', // Severe allergy / clinical emergency
      700: '#BE123C',
    },
    // Info & Diagnostics
    sky: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      500: '#0EA5E9',
      600: '#0284C7', // Lab in progress / informational badge
      700: '#0369A1',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  shadows: {
    soft: '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
    card: '0 4px 16px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
    dropdown: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
  },
};
