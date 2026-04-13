import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { useConversationStore } from '@/store/useConversationStore';
import { ScenarioType } from '@/types';

export default function SetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scenarioId: string;
    scenarioType: string;
    scenarioTitle: string;
  }>();

  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const startSession = useConversationStore((state) => state.startSession);

  const handleStart = () => {
    const scenarioType = (params.scenarioType || 'interview') as ScenarioType;
    const scenarioTitle = params.scenarioTitle || 'Practice';

    // Start session with context in the store
    startSession(scenarioType, scenarioTitle, {
      resume: resume.trim() || undefined,
      jobDescription: jobDescription.trim() || undefined,
    });

    // Navigate to chat
    router.push({
      pathname: '/practice/chat',
      params: { ...params },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Boost Your Context</Text>
            <Text style={styles.subtitle}>
              Adding your resume or job description helps the AI ask hyper-relevant questions.
            </Text>
          </View>

          {/* Resume Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Your Resume</Text>
              <Text style={styles.optional}>Optional</Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Paste your resume text here..."
              placeholderTextColor={Palette.textTertiary}
              multiline
              textAlignVertical="top"
              value={resume}
              onChangeText={setResume}
            />
          </View>

          {/* Job Description Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Job Description</Text>
              <Text style={styles.optional}>Optional</Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Paste the job description you're preparing for..."
              placeholderTextColor={Palette.textTertiary}
              multiline
              textAlignVertical="top"
              value={jobDescription}
              onChangeText={setJobDescription}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Tip: The more context you provide, the better the interview simulation will be.
            </Text>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleStart}>
            <Text style={styles.skipButtonText}>Skip & Start</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.md,
    color: Palette.primary,
  },
  title: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxxl,
    color: Palette.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: Spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  label: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
  },
  optional: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.xs,
    color: Palette.textTertiary,
  },
  textArea: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    height: 150,
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  infoBox: {
    backgroundColor: Palette.primary + '10',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.primary + '30',
  },
  infoText: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.primary,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  startButton: {
    backgroundColor: Palette.primary,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    ...Shadows.md,
  },
  startButtonText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
  },
});
