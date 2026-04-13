import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useConversationStore } from '@/store/useConversationStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const sessions = useConversationStore((s) => s.sessions);

  const menuItems = [
    { icon: '🎯', title: 'Learning Goals', subtitle: 'Set your practice targets' },
    { icon: '🔔', title: 'Notifications', subtitle: 'Reminders & updates' },
    { icon: '🌐', title: 'Language', subtitle: 'English (US)' },
    { icon: '🎨', title: 'Appearance', subtitle: 'Dark mode' },
    { icon: '📊', title: 'Analytics', subtitle: 'Detailed performance data' },
    { icon: '❓', title: 'Help & Support', subtitle: 'FAQs and contact us' },
    { icon: '📄', title: 'Terms & Privacy', subtitle: 'Legal documents' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Profile Header ────────────────────────────────────────────── */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[Palette.gradientStart, Palette.gradientMid]}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </LinearGradient>
          <Text style={styles.profileName}>{user?.name || 'Learner'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'hello@speeko.ai'}</Text>

          <View style={styles.planBadge}>
            <Text style={styles.planText}>
              {user?.plan === 'premium' ? '⭐ Premium' : '🆓 Free Plan'}
            </Text>
          </View>
        </View>

        {/* ─── Stats Grid ────────────────────────────────────────────────── */}
        <View style={[styles.statsCard, Shadows.sm]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessions.length || user?.totalSessions || 0}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Palette.accent }]}>
                {user?.averageScore?.toFixed(1) || '0.0'}
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Palette.warning }]}>
                {user?.streak || 0}
              </Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* ─── Upgrade Card ──────────────────────────────────────────────── */}
        {user?.plan !== 'premium' && (
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={[Palette.gradientStart, Palette.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.upgradeCard, Shadows.glow]}
            >
              <Text style={styles.upgradeIcon}>👑</Text>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeSubtitle}>
                  Unlock voice conversations, resume-based questions & advanced analytics
                </Text>
              </View>
              <Text style={styles.upgradeArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ─── Menu Items ────────────────────────────────────────────────── */}
        <View style={[styles.menuContainer, Shadows.sm]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Logout Button ─────────────────────────────────────────────── */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* ─── Version ───────────────────────────────────────────────────── */}
        <Text style={styles.version}>Speeko v1.0.0</Text>

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
    paddingTop: Spacing.xl,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontFamily: Fonts?.sansBlack,
    fontSize: FontSize.xxxl,
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxl,
    color: Palette.textPrimary,
  },
  profileEmail: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textTertiary,
    marginTop: Spacing.xs,
  },
  planBadge: {
    marginTop: Spacing.md,
    backgroundColor: Palette.surfaceLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  planText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
  },

  // Stats
  statsCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Fonts?.sansBlack,
    fontSize: FontSize.xxl,
    color: Palette.primary,
  },
  statLabel: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.xs,
    color: Palette.textTertiary,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Palette.border,
  },

  // Upgrade
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  upgradeIcon: {
    fontSize: 32,
  },
  upgradeInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  upgradeTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.lg,
    color: '#FFFFFF',
  },
  upgradeSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    lineHeight: 18,
  },
  upgradeArrow: {
    fontFamily: Fonts?.sansBold,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Menu
  menuContainer: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  menuIcon: {
    fontSize: 20,
    width: 36,
    textAlign: 'center',
  },
  menuInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
  },
  menuSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  menuArrow: {
    fontFamily: Fonts?.sansBold,
    fontSize: 20,
    color: Palette.textTertiary,
  },

  // Footer
  version: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  // Logout
  logoutButton: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.error + '40',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  logoutText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.md,
    color: Palette.error,
  },
});
