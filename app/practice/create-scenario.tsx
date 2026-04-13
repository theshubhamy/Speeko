import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useScenarioStore } from '@/store/useScenarioStore';

export default function CreateScenarioScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { createScenario, isLoading } = useScenarioStore();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💬');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const handleCreate = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please enter at least a title and description.');
      return;
    }

    if (!user) return;

    try {
      await createScenario(user.id, {
        title,
        subtitle: subtitle || 'Custom Scenario',
        description,
        icon,
        difficulty,
        type: 'personal',
        estimatedMinutes: 10,
      });
      
      Alert.alert('Success', 'Your custom scenario has been created!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create scenario.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Scenario</Text>
            <Text style={styles.subtitle}>Design a custom practice situation</Text>
          </View>

          <View style={styles.form}>
            {/* Icon Picker (Simple) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Choose Icon</Text>
              <View style={styles.iconRow}>
                {['💬', '🗣️', '🎓', '🏢', '✈️', '💼'].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[styles.iconButton, icon === emoji && styles.iconButtonActive]}
                    onPress={() => setIcon(emoji)}
                  >
                    <Text style={styles.iconEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Scenario Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Flight Attendant Interview"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={Palette.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Subtitle (Role or Context)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Service & Safety Round"
                value={subtitle}
                onChangeText={setSubtitle}
                placeholderTextColor={Palette.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description & Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the scenario in detail. What should the AI focus on? (e.g. 'The AI should act as a passenger complaining about food...')"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor={Palette.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyRow}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.difficultyChip, difficulty === d && styles.difficultyChipActive]}
                    onPress={() => setDifficulty(d)}
                  >
                    <Text style={[styles.difficultyText, difficulty === d && styles.difficultyTextActive]}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.buttonDisabled]} 
              onPress={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Create Scenario</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  backIcon: {
    fontSize: 20,
    color: Palette.textPrimary,
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
  },
  form: {
    gap: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  iconButtonActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary + '10',
  },
  iconEmoji: {
    fontSize: 24,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  difficultyChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  difficultyChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  difficultyText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: Palette.primary,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
    ...Shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
});
