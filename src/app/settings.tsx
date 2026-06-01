import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function SettingsScreen() {
  const { state, resetProgress, toggleAdminMode } = useGameApp();

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Use admin mode for an ad-free studio build, then reset data to test the free-player
            loop again.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.cardTitle}>Admin mode</Text>
              <Text style={styles.cardBody}>
                Removes ads, unlocks premium preview surfaces, and grants free boosters.
              </Text>
            </View>
            <Switch
              value={state.adminMode}
              onValueChange={toggleAdminMode}
              trackColor={{ false: '#3c445a', true: '#3f9e74' }}
              thumbColor={state.adminMode ? '#ebfff5' : '#f4f6fb'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Build profile</Text>
          <Text style={styles.cardBody}>Offline-first play sessions and local progression only.</Text>
          <View style={styles.detailList}>
            <DetailRow label="Mode" value={state.adminMode ? 'Admin preview' : 'Free player'} />
            <DetailRow label="Sponsored bonus taps" value={String(state.adsSeen)} />
            <DetailRow label="Local sessions" value={String(state.sessionsPlayed)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reset local data</Text>
          <Text style={styles.cardBody}>
            Clears coins, boosters, and saved best scores on this device.
          </Text>
          <Pressable onPress={resetProgress} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backLabel: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '700',
  },
  hero: {
    gap: 8,
  },
  title: {
    color: tokens.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: tokens.surface,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleCopy: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardBody: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  detailList: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabel: {
    color: tokens.subtleText,
    fontSize: 14,
  },
  detailValue: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '700',
  },
  resetButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#5b2233',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#ffd7e1',
    fontSize: 14,
    fontWeight: '800',
  },
});
