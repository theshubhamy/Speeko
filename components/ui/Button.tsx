import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, fontSize: FontSize.sm },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, fontSize: FontSize.md },
    lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, fontSize: FontSize.lg },
  };

  const isPrimary = variant === 'primary';

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#fff' : Palette.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles[size].fontSize },
              variant === 'ghost' && { color: Palette.primary },
              variant === 'outline' && { color: Palette.primary },
              variant === 'secondary' && { color: Palette.textPrimary },
              disabled && { opacity: 0.5 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={[Palette.gradientStart, Palette.gradientMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            {
              paddingVertical: sizeStyles[size].paddingVertical,
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
            },
            disabled && styles.disabled,
            Shadows.md,
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
        },
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  text: {
    fontFamily: Fonts?.sansSemiBold,
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: Palette.surfaceLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});
