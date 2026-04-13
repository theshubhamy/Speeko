import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { ScenarioType } from '@/types';

interface ScenarioCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  onPress: () => void;
  index?: number;
}

export function ScenarioCard({ title, subtitle, icon, gradient, onPress, index = 0 }: ScenarioCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
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
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, Shadows.md]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ScenarioDetailCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: string;
  estimatedMinutes: number;
  onPress: () => void;
  index?: number;
}

export function ScenarioDetailCard({
  title,
  subtitle,
  description,
  icon,
  difficulty,
  estimatedMinutes,
  onPress,
  index = 0,
}: ScenarioDetailCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const difficultyColor =
    difficulty === 'beginner' ? Palette.success :
    difficulty === 'intermediate' ? Palette.warning :
    Palette.error;

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.detailCard, Shadows.sm]}>
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <Text style={styles.detailIcon}>{icon}</Text>
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.detailTitle}>{title}</Text>
            <Text style={styles.detailSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Text style={styles.detailDescription}>{description}</Text>
        <View style={styles.detailMeta}>
          <View style={[styles.badge, { backgroundColor: `${difficultyColor}20` }]}>
            <Text style={[styles.badgeText, { color: difficultyColor }]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          <Text style={styles.duration}>⏱ {estimatedMinutes} min</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  title: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.lg,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Fonts?.sansBold,
  },

  // Detail card styles
  detailCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIcon: {
    fontSize: 22,
  },
  detailInfo: {
    marginLeft: Spacing.md,
  },
  detailTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.lg,
    color: Palette.textPrimary,
  },
  detailSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  detailDescription: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.xs,
  },
  duration: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
  },
});
