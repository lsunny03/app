import { StyleSheet, Text, View } from 'react-native';

import { useGameApp } from '@/features/game-app-context';
import { BadgePill, HeaderButton, IconRow, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function SettingsScreen() {
  const { appVariant, isAdminBuild, monetizationEnabled, resetProgress, state, sponsoredBonus } =
    useGameApp();

  return (
    <MobileShell
      activeTab="settings"
      header={
        <View style={styles.hero}>
          <View style={styles.badgeRow}>
            <BadgePill
              iconFallback="✓"
              iconName={{ ios: 'person.crop.square.fill', android: 'account_box', web: 'account_box' }}
              label={appVariant === 'admin' ? 'Admin build' : 'Consumer build'}
              tone={isAdminBuild ? 'mint' : 'lavender'}
            />
            <BadgePill
              iconFallback="•"
              iconName={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              label="Local controls"
              tone="neutral"
            />
          </View>

          <Text style={styles.title}>Tidy controls for the build behind the scenes.</Text>
          <Text style={styles.subtitle}>
            Keep the player and admin lanes readable without burying the useful device-level details.
          </Text>
        </View>
      }>
      <InfoPanel>
        <IconRow
          iconFallback="✓"
          iconName={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
          subtitle="The current release lane and monetization state on this install."
          title="Build snapshot"
        />
        <DetailRow label="Variant" value={appVariant === 'admin' ? 'Admin' : 'Consumer'} />
        <DetailRow label="Monetization" value={monetizationEnabled ? 'Enabled' : 'Disabled'} />
        <DetailRow
          label="Rewarded bonus"
          value={isAdminBuild ? 'Hidden' : sponsoredBonus.supported ? 'Available' : 'Only on device'}
        />
      </InfoPanel>

      <InfoPanel style={styles.progressPanel}>
        <IconRow
          iconFallback="•"
          iconName={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
          subtitle="Everything here is still local and offline-first."
          title="Progress snapshot"
        />
        <DetailRow label="Coins" value={String(state.coins)} />
        <DetailRow label="Rewarded claims" value={String(state.adsSeen)} />
        <DetailRow label="Sessions" value={String(state.sessionsPlayed)} />
      </InfoPanel>

      <InfoPanel style={styles.resetPanel}>
        <IconRow
          iconFallback="!"
          iconName={{ ios: 'arrow.counterclockwise.circle.fill', android: 'restart_alt', web: 'restart_alt' }}
          subtitle="This clears saved scores, boosters, coins, and reward cooldowns for this device only."
          title="Reset local data"
        />
        <View style={styles.resetWrap}>
          <HeaderButton
            iconFallback="!"
            iconName={{ ios: 'arrow.counterclockwise', android: 'restart_alt', web: 'restart_alt' }}
            label="Reset progress"
            onPress={resetProgress}
            tone="primary"
          />
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
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    color: tokens.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    maxWidth: 340,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 360,
  },
  detailRow: {
    borderBottomColor: '#efe1d3',
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: 10,
  },
  detailLabel: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  progressPanel: {
    backgroundColor: tokens.cream,
  },
  resetPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  resetWrap: {
    alignItems: 'flex-start',
  },
});
