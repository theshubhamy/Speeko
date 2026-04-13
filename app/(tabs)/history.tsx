import { FontSize, Fonts, Palette, Radius, ScenarioColors, Shadows, Spacing } from '@/constants/theme';
import { useConversationStore } from '@/store/useConversationStore';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const sessions = useConversationStore((s) => s.sessions);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return Palette.textTertiary;
    if (score >= 8) return Palette.success;
    if (score >= 6) return Palette.warning;
    return Palette.error;
  };

  const scenarioIcons: Record<string, string> = {
    interview: '💼',
    sales: '💰',
    client: '🌐',
    workplace: '🏢',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Session History</Text>
        <Text style={styles.headerSubtitle}>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a practice session to see your conversation history here.
            </Text>
          </View>
        ) : (
          sessions.map((session, index) => {
            const userMessages = session.messages.filter((m) => m.role === 'user').length;
            const colors = ScenarioColors[session.scenarioType] || ScenarioColors.interview;

            return (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, Shadows.sm]}
                activeOpacity={0.8}
              >
                <View style={styles.sessionHeader}>
                  <View style={[styles.sessionIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Text style={styles.sessionIconText}>
                      {scenarioIcons[session.scenarioType] || '💬'}
                    </Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{session.scenarioTitle}</Text>
                    <Text style={styles.sessionMeta}>
                      {userMessages} message{userMessages !== 1 ? 's' : ''} · {formatDate(session.createdAt)}
                    </Text>
                  </View>
                  {session.score !== undefined && (
                    <View
                      style={[
                        styles.scoreBadge,
                        { backgroundColor: getScoreColor(session.score) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.scoreText, { color: getScoreColor(session.score) }]}
                      >
                        {session.score}/10
                      </Text>
                    </View>
                  )}
                </View>

                {/* Preview of last message */}
                {session.messages.length > 0 && (
                  <Text style={styles.preview} numberOfLines={2}>
                    {session.messages[session.messages.length - 1].text}
                  </Text>
                )}

                <View style={styles.sessionFooter}>
                  <View style={[styles.typeBadge, { backgroundColor: colors.accent + '15' }]}>
                    <Text style={[styles.typeText, { color: colors.accent }]}>
                      {session.scenarioType.charAt(0).toUpperCase() + session.scenarioType.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.duration}>
                    {session.endedAt
                      ? `${Math.round((session.endedAt - session.createdAt) / 60000)} min`
                      : 'In progress'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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
  headerContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxxl,
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.md,
    color: Palette.textTertiary,
    marginTop: Spacing.xs,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.massive,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xl,
    color: Palette.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
    lineHeight: 22,
  },

  // Session card
  sessionCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIconText: {
    fontSize: 20,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sessionTitle: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.lg,
    color: Palette.textPrimary,
  },
  sessionMeta: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  scoreText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.sm,
  },
  preview: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  typeText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.xs,
  },
  duration: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
  },
});
