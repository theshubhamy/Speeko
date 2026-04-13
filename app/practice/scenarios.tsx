import { ScenarioDetailCard } from '@/components/ui/ScenarioCard';
import { SCENARIOS, SCENARIO_CATEGORIES } from '@/constants/scenarios';
import { FontSize, Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { ScenarioType } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScenariosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const [activeType, setActiveType] = useState<ScenarioType | 'all'>(
    (params.type as ScenarioType) || 'all'
  );

  const filteredScenarios =
    activeType === 'all'
      ? SCENARIOS
      : SCENARIOS.filter((s) => s.type === activeType);

  const handleSelectScenario = (scenarioId: string, scenarioType: ScenarioType, scenarioTitle: string) => {
    router.push({
      pathname: '/practice/setup',
      params: { scenarioId, scenarioType, scenarioTitle },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ─── Header ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Scenario</Text>
        <Text style={styles.headerSubtitle}>Select a practice scenario to get started</Text>
      </View>

      {/* ─── Category Filter ─────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, activeType === 'all' && styles.filterChipActive]}
          onPress={() => setActiveType('all')}
        >
          <Text style={[styles.filterText, activeType === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {SCENARIO_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.type}
            style={[styles.filterChip, activeType === cat.type && styles.filterChipActive]}
            onPress={() => setActiveType(cat.type)}
          >
            <Text style={styles.filterIcon}>{cat.icon}</Text>
            <Text
              style={[styles.filterText, activeType === cat.type && styles.filterTextActive]}
            >
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── Scenario List ───────────────────────────────────────────────── */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.resultCount}>
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''}
        </Text>

        {filteredScenarios.map((scenario, index) => (
          <ScenarioDetailCard
            key={scenario.id}
            title={scenario.title}
            subtitle={scenario.subtitle}
            description={scenario.description}
            icon={scenario.icon}
            difficulty={scenario.difficulty}
            estimatedMinutes={scenario.estimatedMinutes}
            index={index}
            onPress={() =>
              handleSelectScenario(scenario.id, scenario.type, scenario.title)
            }
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.md,
    color: Palette.primary,
  },
  headerTitle: {
    fontFamily: Fonts?.sansBold,
    fontSize: FontSize.xxxl,
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontFamily: Fonts?.sans,
    fontSize: FontSize.md,
    color: Palette.textTertiary,
    marginTop: Spacing.xs,
  },

  // Filter
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontFamily: Fonts?.sansSemiBold,
    fontSize: FontSize.sm,
    color: Palette.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // Content
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  resultCount: {
    fontFamily: Fonts?.sansMedium,
    fontSize: FontSize.sm,
    color: Palette.textTertiary,
    marginBottom: Spacing.lg,
  },
});
