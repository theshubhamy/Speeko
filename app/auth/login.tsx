import { FontSize, Fonts, Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LoginScreen() {
  const router = useRouter();
  const { login, loginAsGuest, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      // Error handled by store
    }
  };


  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Guest Login Failed', e.message);
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
            <LinearGradient
              colors={[Palette.gradientStart, Palette.gradientEnd]}
              style={styles.logoBadge}
            >
              <Text style={styles.logoText}>S</Text>
            </LinearGradient>
            <Text style={styles.title}>Welcome to Speeko</Text>
            <Text style={styles.subtitle}>Practice your way to English fluency</Text>
          </View>

          {/* ─── Form ──────────────────────────────────────────────────────── */}
          <View style={styles.form}>
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
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 50 }]}
                  placeholder="••••••••"
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

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Social Login ─────────────────────────────────────────────── */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGuestLogin}
                disabled={isLoading}
              >
                <Text style={styles.socialIcon}>👤</Text>
                <Text style={styles.socialButtonText}>Continue as Guest</Text>
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
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.massive,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.glow,
  },
  logoText: {
    fontFamily: Fonts?.sansBlack,
    fontSize: 32,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxxl,
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  form: {
    marginBottom: Spacing.massive,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
    marginBottom: Spacing.xs,
  },
  forgotText: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.xs,
    color: Palette.primary,
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
  loginButton: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  registerText: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
  },
  registerLink: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.sm,
    color: Palette.primary,
  },
  socialSection: {
    marginTop: 'auto',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  dividerText: {
    fontFamily: Fonts?.sansBold,
    fontSize: 10,
    color: Palette.textMuted,
    marginHorizontal: Spacing.lg,
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  socialIcon: {
    fontSize: 18,
  },
  socialButtonText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.textPrimary,
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
