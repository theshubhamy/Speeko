/**
 * Speeko Design System
 * Premium dark-mode-first design tokens
 */

import { Platform } from 'react-native';

// ─── Color Palette ───────────────────────────────────────────────────────────

export const Palette = {
  // Primary gradient
  primary: '#6C63FF',
  primaryLight: '#8B83FF',
  primaryDark: '#4A42E0',

  // Accent
  accent: '#00D9FF',
  accentLight: '#33E1FF',
  accentDark: '#00B8D9',

  // Success / Warning / Error
  success: '#00E676',
  successDark: '#00C853',
  warning: '#FFB74D',
  warningDark: '#FF9800',
  error: '#FF5252',
  errorDark: '#D32F2F',

  // Neutrals (dark mode)
  background: '#0A0A1A',
  surface: '#12122A',
  surfaceLight: '#1A1A3E',
  surfaceElevated: '#222252',
  border: '#2A2A5A',
  borderLight: '#3A3A6A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C8',
  textTertiary: '#6B6B99',
  textMuted: '#4A4A70',

  // Gradients
  gradientStart: '#6C63FF',
  gradientMid: '#8B5CF6',
  gradientEnd: '#00D9FF',

  // Chat bubbles
  userBubble: '#6C63FF',
  aiBubble: '#1A1A3E',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  glassBg: 'rgba(26, 26, 62, 0.8)',
  glassBorder: 'rgba(108, 99, 255, 0.15)',
};

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

// ─── Border Radius ───────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// ─── Typography ──────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    sansBlack: 'Inter_900Black',
  },
  default: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    sansBlack: 'Inter_900Black',
  },
  web: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    sansBlack: 'Inter_900Black',
  },
});

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};

// ─── Legacy Colors export (for themed components) ───────────────────────────

export const Colors = {
  light: {
    text: Palette.textPrimary,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textTertiary,
    tabIconSelected: Palette.primary,
  },
  dark: {
    text: Palette.textPrimary,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textTertiary,
    tabIconSelected: Palette.primary,
  },
};

// ─── Scenario types ──────────────────────────────────────────────────────────

export const ScenarioColors: Record<string, { bg: string; accent: string }> = {
  interview: { bg: '#1A1040', accent: '#8B5CF6' },
  sales: { bg: '#0A2A1A', accent: '#00E676' },
  client: { bg: '#0A1A2A', accent: '#00D9FF' },
  workplace: { bg: '#2A1A0A', accent: '#FFB74D' },
};
