import { ChatBubble, TypingIndicator } from '@/components/ui/ChatBubble';
import { FeedbackPanel } from '@/components/ui/FeedbackPanel';
import { FontSize, Fonts, Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import { AIService } from '@/services/ai.service';
import { useConversationStore } from '@/store/useConversationStore';
import { Message, ScenarioType } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scenarioId: string;
    scenarioType: string;
    scenarioTitle: string;
  }>();

  const {
    messages,
    isAiTyping,
    showFeedback,
    activeFeedbackMessageId,
    startSession,
    addUserMessage,
    addAiMessage,
    setIsAiTyping,
    setShowFeedback,
    endSession,
  } = useConversationStore();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const scenarioType = (params.scenarioType || 'interview') as ScenarioType;
  const scenarioTitle = params.scenarioTitle || 'Practice';

  // Start session and send opening message
  useEffect(() => {
    startSession(scenarioType, scenarioTitle);

    // AI sends the opening message
    const openingText = AIService.getOpeningMessage(scenarioType);
    const openingMessage: Message = {
      id: `msg_opening_${Date.now()}`,
      role: 'ai',
      text: openingText,
      timestamp: Date.now(),
    };

    // Simulate brief typing delay for the opening
    setIsAiTyping(true);
    const timer = setTimeout(() => {
      addAiMessage(openingMessage);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isAiTyping]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isAiTyping) return;

    setInputText('');
    addUserMessage(text);
    setIsAiTyping(true);

    try {
      const response = await AIService.processMessage(text, scenarioType, messages);

      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        role: 'ai',
        text: response.aiResponse,
        feedback: response.feedback,
        improvedAnswer: response.improvedAnswer,
        score: response.score,
        timestamp: Date.now(),
      };

      addAiMessage(aiMessage);
    } catch (error) {
      addAiMessage({
        id: `msg_error_${Date.now()}`,
        role: 'ai',
        text: "I'm having trouble responding right now. Please try again.",
        timestamp: Date.now(),
      });
    }
  }, [inputText, isAiTyping, messages, scenarioType]);

  const handleEndSession = () => {
    const aiMessages = messages.filter((m) => m.role === 'ai' && m.score !== undefined);
    const avgScore =
      aiMessages.length > 0
        ? Math.round(
          (aiMessages.reduce((acc, m) => acc + (m.score || 0), 0) / aiMessages.length) * 10
        ) / 10
        : undefined;

    Alert.alert(
      'End Session',
      avgScore
        ? `Your average score: ${avgScore}/10\n\nWould you like to end this practice session?`
        : 'Would you like to end this practice session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            endSession(avgScore);
            router.back();
          },
        },
      ]
    );
  };

  // Find the feedback for the active message
  const feedbackMessage = activeFeedbackMessageId
    ? messages.find((m) => m.id === activeFeedbackMessageId)
    : null;

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item}
      onFeedbackPress={
        item.feedback
          ? () => setShowFeedback(true, item.id)
          : undefined
      }
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ─── Header ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {scenarioTitle}
          </Text>
          <Text style={styles.headerSubtitle}>
            {messages.filter((m) => m.role === 'user').length} messages
          </Text>
        </View>
        <TouchableOpacity onPress={handleEndSession} style={styles.endButton}>
          <Text style={styles.endButtonText}>End</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Messages ──────────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isAiTyping ? <TypingIndicator /> : null}
        />

        {/* ─── Input Bar ─────────────────────────────────────────────────── */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your response..."
              placeholderTextColor={Palette.textTertiary}
              multiline
              maxLength={1000}
              editable={!isAiTyping}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isAiTyping}
              style={[
                styles.sendButton,
                (!inputText.trim() || isAiTyping) && styles.sendButtonDisabled,
              ]}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ─── Feedback Panel ──────────────────────────────────────────────── */}
      {showFeedback && feedbackMessage?.feedback && (
        <FeedbackPanel
          feedback={feedbackMessage.feedback}
          improvedAnswer={feedbackMessage.improvedAnswer || ''}
          score={feedbackMessage.score || 0}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Palette.textPrimary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.lg,
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
    marginTop: 1,
  },
  endButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Palette.error + '20',
  },
  endButtonText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.error,
  },

  // Chat
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: Spacing.lg,
  },

  // Input
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Palette.surfaceLight,
    borderRadius: Radius.xxl,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  input: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Palette.surfaceElevated,
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
