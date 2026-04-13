import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Palette, Spacing, Radius, FontSize, Fonts } from '@/constants/theme';
import { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  onFeedbackPress?: () => void;
  onRetry?: () => void;
}

export function ChatBubble({ message, onFeedbackPress, onRetry }: ChatBubbleProps) {
  const isUser = message.role === 'user';
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

        {message.score !== undefined && (
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{message.score}/10</Text>
            </View>
            {onFeedbackPress && (
              <Text style={styles.feedbackLink} onPress={onFeedbackPress}>
                View Feedback →
              </Text>
            )}
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
    paddingHorizontal: Spacing.lg,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Palette.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatar: {
    fontSize: 16,
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
});
