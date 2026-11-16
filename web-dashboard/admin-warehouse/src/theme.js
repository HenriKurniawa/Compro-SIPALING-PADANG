import { Platform } from 'react-native';

// Injeksi Google Fonts untuk Plus Jakarta Sans secara global di Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const fontLinkId = 'plus-jakarta-sans-google-fonts';
  if (!document.getElementById(fontLinkId)) {
    const link = document.createElement('link');
    link.id = fontLinkId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap';
    document.head.appendChild(link);
  }

  const fontStyleId = 'plus-jakarta-sans-global-css';
  if (!document.getElementById(fontStyleId)) {
    const style = document.createElement('style');
    style.id = fontStyleId;
    style.innerHTML = `
      * {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      body {
        margin: 0;
        background-color: #F8F3EA;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        -webkit-font-smoothing: antialiased;
      }
      input, textarea, select, button {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      /* Custom scrollbar untuk web */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.03);
      }
      ::-webkit-scrollbar-thumb {
        background: #D8CCB8;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #B9A892;
      }

      /* Pola Motif Garis Batik & Songket Minang untuk Sidebar */
      .sidebar-batik {
        background-color: #56160F !important;
        background-image: 
          radial-gradient(circle at 50% 50%, rgba(234, 111, 26, 0.16) 1.5px, transparent 1.5px),
          linear-gradient(45deg, transparent 48%, rgba(245, 214, 206, 0.07) 49%, rgba(245, 214, 206, 0.07) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(245, 214, 206, 0.07) 49%, rgba(245, 214, 206, 0.07) 51%, transparent 52%) !important;
        background-size: 18px 18px, 18px 18px, 18px 18px !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export const colors = {
  // Brand Maroon
  maroon: '#8E2B1E',
  maroonDark: '#56160F',
  maroonDeep: '#3F0F09',
  maroonLight: '#AB3727',
  maroonBg: '#FBEFEF',

  // Warm Cream Backgrounds
  cream: '#F8F3EA',
  creamAlt: '#F4ECE0',
  creamDark: '#EADBCA',
  card: '#FFFFFF',

  // Brand Orange Accent
  orange: '#E86F1A',
  orangeDark: '#C95A0E',
  orangeLight: '#FFF2E8',

  // Typography
  text: '#241713',
  textSecondary: '#5A4942',
  muted: '#87766E',
  mutedLight: '#B2A39B',

  // Borders
  border: '#EADBCA',
  borderLight: '#F0E6D8',
  borderFocus: '#8E2B1E',

  // Status Tones
  green: '#1E7C48',
  greenBg: '#E7F6ED',
  greenBorder: '#BCE5CE',

  warn: '#B46410',
  warnBg: '#FEF4E6',
  warnBorder: '#FAD8A8',

  danger: '#C63428',
  dangerBg: '#FDECEB',
  dangerBorder: '#F9C4C0',

  blue: '#1E6F9F',
  blueBg: '#E9F4FB',
  blueBorder: '#BDE1F5',
};

export const fonts = {
  regular: Platform.select({ web: "'Plus Jakarta Sans', sans-serif", default: 'PlusJakartaSans_400Regular' }),
  medium: Platform.select({ web: "'Plus Jakarta Sans', sans-serif", default: 'PlusJakartaSans_500Medium' }),
  semiBold: Platform.select({ web: "'Plus Jakarta Sans', sans-serif", default: 'PlusJakartaSans_600SemiBold' }),
  bold: Platform.select({ web: "'Plus Jakarta Sans', sans-serif", default: 'PlusJakartaSans_700Bold' }),
  extraBold: Platform.select({ web: "'Plus Jakarta Sans', sans-serif", default: 'PlusJakartaSans_800ExtraBold' }),
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: Platform.select({
    web: { boxShadow: '0 1px 3px rgba(36, 23, 19, 0.05), 0 1px 2px rgba(36, 23, 19, 0.03)' },
    default: {
      shadowColor: '#241713',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
  }),
  md: Platform.select({
    web: { boxShadow: '0 4px 12px rgba(36, 23, 19, 0.06), 0 2px 4px rgba(36, 23, 19, 0.03)' },
    default: {
      shadowColor: '#241713',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  }),
  lg: Platform.select({
    web: { boxShadow: '0 10px 25px rgba(36, 23, 19, 0.08), 0 4px 10px rgba(36, 23, 19, 0.04)' },
    default: {
      shadowColor: '#241713',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  }),
  dropdown: Platform.select({
    web: { boxShadow: '0 12px 32px rgba(36, 23, 19, 0.16), 0 4px 12px rgba(36, 23, 19, 0.08)' },
    default: {
      shadowColor: '#241713',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 10,
    },
  }),
};
