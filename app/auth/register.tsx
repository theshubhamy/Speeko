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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Spacing, Radius, FontSize, Fonts, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      // Error handled by store
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Header ────────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Speeko and start practicing today</Text>
          </View>

          {/* ─── Form ──────────────────────────────────────────────────────── */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={Palette.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Palette.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 50 }]}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Palette.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 50 }]}
                  placeholder="Re-enter password"
                  placeholderTextColor={Palette.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
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
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.massive,
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
    flex: 1,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Palette.textPrimary,
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
  },
  errorContainer: {
    backgroundColor: Palette.error + '10',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.error + '30',
  },
  errorText: {
    color: Palette.error,
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    ...Shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
  },
  loginLink: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.sm,
    color: Palette.primary,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
    zIndex: 1,
  },
  eyeIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
});
