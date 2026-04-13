import { Palette } from '@/constants/theme';
import { ScenarioService } from '@/services/scenario.service';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent splash screen from hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

// Customize the dark theme for our design system
const SpeekoTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Palette.primary,
    background: Palette.background,
    card: Palette.surface,
    text: Palette.textPrimary,
    border: Palette.border,
    notification: Palette.accent,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const initialize = useAuthStore((s) => s.initialize);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Start Firebase auth listener — restores session on every launch
    const unsubscribe = initialize();
    
    // Seed system scenarios (only creates if missing)
    ScenarioService.seedScenarios().catch(console.error);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle Authentication Routing
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated but tried to access auth screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Palette.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={SpeekoTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Palette.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
          <Stack.Screen name="auth/register" />
          <Stack.Screen
            name="practice/scenarios"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="practice/chat"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="practice/setup"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
