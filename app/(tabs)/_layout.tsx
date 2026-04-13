import { HapticTab } from '@/components/haptic-tab';
import { FontSize, Fonts, Palette, Spacing } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

const width = Dimensions.get('window').width;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Tab bar height: icon area (56px) + bottom safe area (e.g. 34px on iPhone)
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: Spacing.sm,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📚" label="History" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Palette.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  tabIconContainer: {
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flexDirection: 'row',
    paddingTop: 2,
  },
  tabIcon: {
    fontSize: FontSize.md,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
  },
  tabLabelActive: {
    color: Palette.primary,
  },
});
