import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { Feedback } from '@/types';

interface FeedbackPanelProps {
  feedback: Feedback;
  improvedAnswer: string;
  score: number;
  onClose: () => void;
}

export function FeedbackPanel({ feedback, improvedAnswer, score, onClose }: FeedbackPanelProps) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const scoreColor =
    score >= 8 ? Palette.success :
    score >= 6 ? Palette.warning :
    Palette.error;

  return (
    <Animated.View
      style={[
        styles.overlay,
        { opacity: fadeAnim },
      ]}
    >
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={[styles.scoreBadge, { backgroundColor: `${scoreColor}20` }]}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
            <Text style={[styles.scoreMax, { color: scoreColor }]}>/10</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Grammar */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Grammar</Text>
            </View>
            <Text style={styles.sectionText}>{feedback.grammar}</Text>
          </View>

          {/* Clarity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={styles.sectionTitle}>Clarity</Text>
            </View>
            <Text style={styles.sectionText}>{feedback.clarity}</Text>
          </View>

          {/* Suggestion */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎯</Text>
              <Text style={styles.sectionTitle}>Tip</Text>
            </View>
            <Text style={styles.sectionText}>{feedback.suggestion}</Text>
          </View>

          {/* Improved Answer */}
          <View style={[styles.section, styles.improvedSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✨</Text>
              <Text style={[styles.sectionTitle, { color: Palette.accent }]}>
                Improved Answer
              </Text>
            </View>
            <Text style={[styles.sectionText, styles.improvedText]}>{improvedAnswer}</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Palette.overlay,
  },
  container: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: '75%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Palette.border,
    ...Shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderLight,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xl,
    color: Palette.textPrimary,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  scoreValue: {
    fontFamily: Fonts?.sansBlack,
    fontSize: FontSize.xxl,
  },
  scoreMax: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
  },
  section: {
    backgroundColor: Palette.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
  },
  sectionText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    lineHeight: 20,
  },
  improvedSection: {
    backgroundColor: `${Palette.accent}10`,
    borderWidth: 1,
    borderColor: `${Palette.accent}30`,
  },
  improvedText: {
    color: Palette.textPrimary,
    fontStyle: 'italic',
  },
});
