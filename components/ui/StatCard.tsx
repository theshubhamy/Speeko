import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
  index?: number;
}

export function StatCard({ icon, value, label, color = Palette.primary, index = 0 }: StatCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        Shadows.sm,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontFamily: Fonts?.sansBlack,
    fontSize: FontSize.xxl,
  },
  label: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.xs,
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
