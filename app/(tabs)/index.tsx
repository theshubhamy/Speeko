import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { SCENARIO_CATEGORIES } from '@/constants/scenarios';
import { ScenarioCard } from '@/components/ui/ScenarioCard';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useConversationStore } from '@/store/useConversationStore';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { sessions, fetchSessions } = useConversationStore();

  useEffect(() => {
    if (user?.id) {
      fetchSessions(user.id);
    }
  }, [user?.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{user?.streak || 0}</Text>
          </View>
        </View>

        {/* ─── Hero Card ─────────────────────────────────────────────────── */}
        <LinearGradient
          colors={[Palette.gradientStart, Palette.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, Shadows.glow]}
        >
          <Text style={styles.heroEmoji}>🎯</Text>
          <Text style={styles.heroTitle}>Ready to practice?</Text>
          <Text style={styles.heroSubtitle}>
            Improve your English with AI-powered conversations tailored to real-world scenarios.
          </Text>
          <Button
            title="Start Practice"
            variant="secondary"
            onPress={() => router.push('/practice/scenarios')}
            style={styles.heroButton}
            textStyle={{ color: Palette.primary }}
          />
        </LinearGradient>

        {/* ─── Stats ─────────────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard
            icon="📊"
            value={sessions.length || user?.totalSessions || 0}
            label="Sessions"
            color={Palette.primary}
            index={0}
          />
          <StatCard
            icon="⭐"
            value={user?.averageScore?.toFixed(1) || '0.0'}
            label="Avg Score"
            color={Palette.accent}
            index={1}
          />
          <StatCard
            icon="🔥"
            value={user?.streak || 0}
            label="Day Streak"
            color={Palette.warning}
            index={2}
          />
        </View>

        {/* ─── Quick Practice ────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <Text
            style={styles.seeAll}
            onPress={() => router.push('/practice/scenarios')}
          >
            See All →
          </Text>
        </View>

        {SCENARIO_CATEGORIES.map((category, index) => (
          <ScenarioCard
            key={category.type}
            title={category.title}
            subtitle={category.subtitle}
            icon={category.icon}
            gradient={category.gradient}
            index={index}
            onPress={() =>
              router.push({
                pathname: '/practice/scenarios',
                params: { type: category.type },
              })
            }
          />
        ))}

        {/* ─── Tips Section ──────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💡 Daily Tip</Text>
        </View>
        <View style={[styles.tipCard, Shadows.sm]}>
          <Text style={styles.tipTitle}>Use the STAR Method</Text>
          <Text style={styles.tipText}>
            When answering behavioral questions, structure your response with Situation, Task, Action, and Result for maximum impact.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  greeting: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.md,
    color: Palette.textSecondary,
  },
  userName: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxl,
    color: Palette.textPrimary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.xs,
  },
  streakIcon: {
    fontSize: 18,
  },
  streakText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.lg,
    color: Palette.warning,
  },

  // Hero
  heroCard: {
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxl,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  heroButton: {
    marginTop: Spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxxl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xl,
    color: Palette.textPrimary,
  },
  seeAll: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.primary,
  },

  // Tip
  tipCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  tipTitle: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.lg,
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    lineHeight: 20,
  },
});
