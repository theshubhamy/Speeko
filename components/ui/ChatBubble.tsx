import { FontSize, Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { Message } from '@/types';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatBubbleProps {
  message: Message;
  onFeedbackPress?: () => void;
  onRetry?: () => void;
}

export function ChatBubble({ message, onFeedbackPress, onRetry }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  console.log("message", isUser ? "user" : "AI", message);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>🤖</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {message.text}
        </Text>

        {/* 🎤 Voice message duration */}
        {isUser && message.audioDuration !== undefined && message.audioDuration > 0 && (
          <View style={styles.audioBadge}>
            <Text style={styles.audioBadgeIcon}>🎤</Text>
            <Text style={styles.audioBadgeText}>
              {String(Math.floor(message.audioDuration / 60)).padStart(2, '0')}:
              {String(message.audioDuration % 60).padStart(2, '0')}
            </Text>
          </View>
        )}

        {/* 🎯 Next Question / Retry Question: Highly Prompted */}
        {!isUser && message.nextQuestion && (
          <View style={styles.questionBox}>
            <Text style={styles.questionLabel}>
              {message.score !== undefined && message.score < 8 ? "RETRY THIS QUESTION:" : "NEXT QUESTION:"}
            </Text>
            <Text style={styles.questionText}>{message.nextQuestion}</Text>
          </View>
        )}

        {message.score !== undefined && (
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{message.score}/10</Text>
            </View>
          </View>
        )}

        {/* 📝 Inline Feedback */}
        {!isUser && message.feedback && message.score !== undefined && message.score < 8 && (
          <View style={styles.feedbackDetails}>
            {message.feedback.grammar && (
              <Text style={styles.feedbackItem}>
                <Text style={styles.feedbackLabel}>Grammar: </Text>
                {message.feedback.grammar}
              </Text>
            )}
            {message.feedback.clarity && (
              <Text style={styles.feedbackItem}>
                <Text style={styles.feedbackLabel}>Clarity: </Text>
                {message.feedback.clarity}
              </Text>
            )}
            {message.feedback.suggestion && (
              <Text style={styles.feedbackItem}>
                <Text style={styles.feedbackLabel}>Suggestion: </Text>
                {message.feedback.suggestion}
              </Text>
            )}
          </View>
        )}

        {/* 💡 Suggested Answer: Visible directly if score is low */}
        {!isUser && message.improvedAnswer && message.score !== undefined && message.score < 8 && (
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionLabel}>Suggested Answer:</Text>
            <Text style={styles.suggestionText}>"{message.improvedAnswer}"</Text>
          </View>
        )}
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retryBadge}>
            <Text style={styles.scoreText}>Retry ↺</Text>
          </TouchableOpacity>
        )}
      </View>

      {isUser && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
      )}
    </Animated.View>
  );
}

export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={[styles.container, styles.aiContainer]}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>🤖</Text>
      </View>
      <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Palette.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatar: {
    fontSize: 12,
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  userBubble: {
    backgroundColor: Palette.userBubble,
    borderBottomRightRadius: Radius.sm,
    marginRight: Spacing.sm,
  },
  aiBubble: {
    backgroundColor: Palette.aiBubble,
    borderBottomLeftRadius: Radius.sm,
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  messageText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textSecondary,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  scoreBadge: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  scoreText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xs,
    color: '#FFFFFF',
  },
  retryBadge: {
    backgroundColor: Palette.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  feedbackLink: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.accent,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.textTertiary,
  },
  suggestionBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Palette.accent,
  },
  suggestionLabel: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xs,
    color: Palette.accent,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  suggestionText: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.md,
    color: Palette.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  feedbackDetails: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackItem: {
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginBottom: 4,
  },
  feedbackLabel: {
    fontFamily: Fonts?.sansBold,
    color: Palette.accent,
  },
  questionBox: {
    marginTop: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: 'rgba(74, 144, 226, 0.1)', // Subtle primary tint
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  questionLabel: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xs,
    color: Palette.primary,
    marginBottom: 6,
    letterSpacing: 1,
  },
  questionText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.lg,
    color: Palette.textPrimary,
    lineHeight: 26,
  },

  // ─── Voice message audio duration ──────────────────────────
  audioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
    gap: 4,
    opacity: 0.75,
  },
  audioBadgeIcon: {
    fontSize: 11,
  },
  audioBadgeText: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.xs,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
