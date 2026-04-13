import { ChatBubble, TypingIndicator } from '@/components/ui/ChatBubble';
import { FeedbackPanel } from '@/components/ui/FeedbackPanel';
import { FontSize, Fonts, Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import { AIService } from '@/services/ai.service';
import { AudioService } from '@/services/audio.service';
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
    resume?: string;
    jobDescription?: string;
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
  const [isRecording, setIsRecording] = useState(false);
  const [lastSentText, setLastSentText] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const scenarioType = (params.scenarioType || 'interview') as ScenarioType;
  const scenarioTitle = params.scenarioTitle || 'Practice';

  // Start session and send opening message
  useEffect(() => {
    const { activeSession } = useConversationStore.getState();
    
    if (!activeSession || activeSession.scenarioType !== scenarioType) {
      const context = params.resume || params.jobDescription 
        ? { resume: params.resume, jobDescription: params.jobDescription } 
        : undefined;
      
      startSession(scenarioType, scenarioTitle, context);
    }

    if (messages.length === 0) {
      const openingText = AIService.getOpeningMessage(scenarioType);
      const openingMessage: Message = {
        id: `msg_opening_${Date.now()}`,
        role: 'ai',
        text: openingText,
        timestamp: Date.now(),
      };

      setIsAiTyping(true);
      const timer = setTimeout(() => {
        addAiMessage(openingMessage);
        // 🔊 Auto-speak opening message
        AudioService.speak(openingText);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  // Handle AI Speaking when a new AI message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'ai') {
      const fullSpeech = lastMessage.nextQuestion 
        ? `${lastMessage.text} ${lastMessage.nextQuestion}`
        : lastMessage.text;
      AudioService.speak(fullSpeech);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isAiTyping]);

  const handleSend = useCallback(async (textOverride?: string, isRetry = false) => {
    const text = textOverride || inputText.trim();
    if (!text || isAiTyping) return;

    if (!isRetry) {
      setInputText('');
      addUserMessage(text);
      setLastSentText(text);
    }
    
    setIsAiTyping(true);

    try {
      const { activeSession } = useConversationStore.getState();
      const response = await AIService.processMessage(
        text, 
        scenarioType, 
        messages, 
        activeSession?.context
      );

      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        role: 'ai',
        text: response.aiResponse,
        feedback: response.feedback,
        improvedAnswer: response.improvedAnswer,
        score: response.score,
        nextQuestion: response.nextQuestion,
        timestamp: Date.now(),
      };

      addAiMessage(aiMessage);
    } catch (error) {
      addAiMessage({
        id: `msg_error_${Date.now()}`,
        role: 'ai',
        text: "I'm having trouble responding right now. Please check your connection and tap to retry.",
        timestamp: Date.now(),
      });
    } finally {
      setIsAiTyping(false);
    }
  }, [inputText, isAiTyping, messages, scenarioType]);

  const handleRetry = () => {
    if (lastSentText) {
      handleSend(lastSentText, true);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      const uri = await AudioService.stopRecording();
      if (uri) {
        setIsAiTyping(true);
        try {
          // 🎙️ Transcribe audio using Gemini
          const transcript = await AIService.transcribeAudio(uri);
          
          if (transcript && transcript.length > 0) {
            console.log('Transcribed text:', transcript);
            // sending transcribed text for processing
            handleSend(transcript);
          } else {
            setIsAiTyping(false);
            Alert.alert('Speech Not Recognized', "I couldn't hear any clear speech. Please try again or type your message.");
          }
        } catch (error) {
          setIsAiTyping(false);
          console.error('Transcription error:', error);
          Alert.alert('Error', 'Failed to transcribe audio. Please check your internet connection and try again.');
        }
      }
    } else {
      const granted = await AudioService.requestPermissions();
      if (granted) {
        setIsRecording(true);
        await AudioService.startRecording();
      } else {
        Alert.alert('Permission Denied', 'Please enable microphone access in settings.');
      }
    }
  };

  const handleEndSession = () => {
    AudioService.stopSpeaking();
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

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item}
      onFeedbackPress={
        item.feedback
          ? () => setShowFeedback(true, item.id)
          : undefined
      }
      onRetry={item.id.startsWith('msg_error') ? handleRetry : undefined}
    />
  );

  // Find the feedback for the active message
  const feedbackMessage = activeFeedbackMessageId
    ? messages.find((m) => m.id === activeFeedbackMessageId)
    : null;

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
            Voice Interactive Mode
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

        {/* ─── Voice / Input Bar ─────────────────────────────────────────── */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={isRecording ? "Listening..." : "Speak or type..."}
              placeholderTextColor={Palette.textTertiary}
              multiline
              maxLength={1000}
              editable={!isAiTyping && !isRecording}
              onSubmitEditing={() => handleSend()}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity
              onPress={toggleRecording}
              style={[
                styles.micButton,
                isRecording && styles.micButtonActive,
                isAiTyping && styles.micButtonDisabled,
              ]}
              disabled={isAiTyping}
            >
              <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎤'}</Text>
            </TouchableOpacity>

            {!isRecording && inputText.trim() && (
              <TouchableOpacity
                onPress={() => handleSend()}
                disabled={isAiTyping}
                style={[styles.sendButton, isAiTyping && styles.sendButtonDisabled]}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </TouchableOpacity>
            )}
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
    color: Palette.primary,
    marginTop: 1,
    fontWeight: '600',
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
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: Spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceLight,
    borderRadius: Radius.xxl,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  input: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
    maxHeight: 100,
    paddingVertical: Spacing.xs,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
    ...Shadows.md,
  },
  micButtonActive: {
    backgroundColor: Palette.error,
    transform: [{ scale: 1.1 }],
  },
  micButtonDisabled: {
    backgroundColor: Palette.surfaceElevated,
  },
  micIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Palette.surfaceElevated,
  },
  sendIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
