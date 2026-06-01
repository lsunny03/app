import { StyleSheet, Text, View } from 'react-native';

import { useGameApp } from '@/features/game-app-context';
import { HeaderButton, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function SettingsScreen() {
  const { appVariant, isAdminBuild, monetizationEnabled, resetProgress, state, sponsoredBonus } =
    useGameApp();

  return (
    <MobileShell
      activeTab="settings"
      header={
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Studio controls</Text>
          <Text style={styles.title}>Tune the build without leaving the app.</Text>
          <Text style={styles.subtitle}>
            The player and admin lanes now stay separate at the build level instead of hiding behind a toggle.
          </Text>
        </View>
      }>
      <InfoPanel>
        <Text style={styles.cardTitle}>Build variant</Text>
        <DetailRow label="Variant" value={appVariant === 'admin' ? 'Admin' : 'Consumer'} />
        <DetailRow label="Monetization" value={monetizationEnabled ? 'Enabled' : 'Disabled'} />
        <DetailRow
          label="Rewarded bonus"
          value={isAdminBuild ? 'Hidden' : sponsoredBonus.supported ? 'Available' : 'Device only'}
        />
      </InfoPanel>

      <InfoPanel>
        <Text style={styles.cardTitle}>Local progress</Text>
        <DetailRow label="Coins" value={String(state.coins)} />
        <DetailRow label="Rewarded claims" value={String(state.adsSeen)} />
        <DetailRow label="Sessions" value={String(state.sessionsPlayed)} />
      </InfoPanel>

      <InfoPanel style={styles.resetPanel}>
        <Text style={styles.cardTitle}>Reset local data</Text>
        <Text style={styles.bodyText}>
          Clears coins, boosters, best scores, and reward limits on this device only.
        </Text>
        <View style={styles.resetWrap}>
          <HeaderButton label="Reset progress" onPress={resetProgress} tone="primary" />
        </View>
      </InfoPanel>
    </MobileShell>
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
  hero: {
    gap: 8,
  },
  eyebrow: {
    color: '#a88377',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: tokens.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
  },
  cardTitle: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  detailRow: {
    borderBottomColor: '#f0e4d7',
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: 10,
  },
  detailLabel: {
    color: tokens.subtleText,
    fontSize: 13,
    fontWeight: '700',
  },
  detailValue: {
    color: tokens.text,
    fontSize: 17,
    fontWeight: '800',
  },
  resetPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  bodyText: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  resetWrap: {
    alignItems: 'flex-start',
  },
});
