// Note: Full Firebase Analytics requires native modules (expo-firebase-analytics is deprecated)
// For Expo SDK 50+, standard practice is using a wrapper or a web-compatible fallback.
// This is a simplified version that can be expanded with @react-native-firebase/analytics if needed.

export const AnalyticsService = {
  logEvent: (name: string, params?: object) => {
    // In production without native Firebase, you might use a different provider 
    // or log to a custom Firestore collection for basic tracking
    if (__DEV__) {
      console.log(`[Analytics] Event: ${name}`, params);
    }
    // Logic for production tracking can be added here
  },

  logScreenView: (screenName: string) => {
    if (__DEV__) {
      console.log(`[Analytics] Screen View: ${screenName}`);
    }
  },

  setUserProperties: (properties: object) => {
    if (__DEV__) {
      console.log('[Analytics] Set User Properties:', properties);
    }
  }
};
