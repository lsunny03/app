import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 500;
  const { appVariant, isAdminBuild, monetizationEnabled, resetProgress, state, sponsoredBonus } =
    useGameApp();

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={[styles.title, compact && styles.titleCompact]}>Settings</Text>
          <Text style={styles.subtitle}>
            This app now treats admin access as a build profile instead of a player-facing toggle.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Build variant</Text>
          <Text style={styles.cardBody}>
            {isAdminBuild
              ? 'Admin builds are ad-free and skip monetization SDK usage entirely.'
              : 'Consumer builds keep rewarded ads enabled on iOS and Android for bonus claims.'}
          </Text>
          <View style={styles.detailList}>
            <DetailRow label="Variant" value={appVariant === 'admin' ? 'Admin' : 'Consumer'} />
            <DetailRow label="Monetization" value={monetizationEnabled ? 'Enabled' : 'Disabled'} />
            <DetailRow
              label="Rewarded bonus"
              value={isAdminBuild ? 'Hidden' : sponsoredBonus.supported ? 'Available' : 'Device only'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Economy state</Text>
          <Text style={styles.cardBody}>All progression is still local and offline-first.</Text>
          <View style={styles.detailList}>
            <DetailRow label="Coins" value={String(state.coins)} />
            <DetailRow label="Rewarded claims" value={String(state.adsSeen)} />
            <DetailRow label="Local sessions" value={String(state.sessionsPlayed)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reset local data</Text>
          <Text style={styles.cardBody}>
            Clears coins, boosters, saved best scores, and rewarded bonus limits on this device.
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
  const { width } = useWindowDimensions();
  const compact = width < 500;

  return (
    <View style={[styles.detailRow, compact && styles.detailRowCompact]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fbf4eb',
    borderWidth: 1,
    borderColor: tokens.border,
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
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  title: {
    color: tokens.text,
    fontSize: 32,
    fontWeight: '800',
  },
  titleCompact: {
    fontSize: 28,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 20,
    padding: 18,
    gap: 14,
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e4d7',
  },
  detailRowCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: 4,
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
    backgroundColor: tokens.pink,
    borderWidth: 1,
    borderColor: '#e1b1bf',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resetButtonText: {
    color: '#745463',
    fontSize: 14,
    fontWeight: '800',
  },
});
