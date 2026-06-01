import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GameCard } from '@/features/game-card';
import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { HeaderButton, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function HomeScreen() {
  const {
    appVariant,
    claimSponsoredBonus,
    claimingSponsoredBonus,
    isAdminBuild,
    loading,
    sponsoredBonus,
    state,
  } = useGameApp();

  async function handleClaimSponsoredBonus() {
    await claimSponsoredBonus();
  }

  return (
    <MobileShell
      activeTab="home"
      header={
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Pocket Arcade</Text>
            <Text style={styles.title}>Cute, bright, and ready for quick runs.</Text>
            <Text style={styles.subtitle}>
              One offline arcade with soft progress, fast restarts, and an admin build that stays ad-free.
            </Text>
          </View>

          <View style={styles.pillRow}>
            <StatBubble label="Coins" tone="gold" value={String(state.coins)} />
            <StatBubble label="Boosters" tone="blue" value={String(state.boosters.freeze + state.boosters.undo + state.boosters.shuffle + state.boosters.magnet)} />
            <StatBubble
              label="Build"
              tone={isAdminBuild ? 'green' : 'purple'}
              value={isAdminBuild ? 'Admin' : 'Player'}
            />
          </View>
        </View>
      }>
      {!isAdminBuild ? (
        <InfoPanel style={styles.sponsorPanel}>
          <Text style={styles.panelTitle}>Rewarded bonus</Text>
          <Text style={styles.panelBody}>
            Grab extra coins from the native rewarded path on iOS and Android without cluttering the rest of the app.
          </Text>
          <HeaderButton
            label={claimingSponsoredBonus ? 'Loading...' : sponsoredBonus.supported ? '+35 coins' : 'On device'}
            onPress={handleClaimSponsoredBonus}
            tone="primary"
          />
          <Text style={styles.panelHint}>{sponsoredBonus.message}</Text>
        </InfoPanel>
      ) : (
        <InfoPanel style={styles.adminPanel}>
          <Text style={styles.panelTitle}>Admin build active</Text>
          <Text style={styles.panelBody}>
            This build keeps monetization hidden and booster use friction-free for balancing and QA.
          </Text>
        </InfoPanel>
      )}

      <View style={styles.actionsRow}>
        <HeaderButton label="Browse all games" onPress={() => router.replace('/games')} tone="primary" />
        <HeaderButton label="Open shop" onPress={() => router.replace('/shop')} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured today</Text>
          <Text style={styles.sectionBody}>Start with two fast picks, then browse the full game shelf.</Text>
        </View>

        <View style={styles.cardList}>
          {GAME_LIBRARY.slice(0, 2).map((game) => (
            <GameCard
              key={game.slug}
              bestScore={state.bestScores[game.slug] ?? 0}
              game={game}
              onPress={() =>
                router.push({
                  pathname: '/game/[slug]',
                  params: { slug: game.slug },
                })
              }
            />
          ))}
        </View>
      </View>

      <InfoPanel style={styles.detailPanel}>
        <Text style={styles.panelTitle}>Studio snapshot</Text>
        <Text style={styles.panelBody}>
          {appVariant === 'admin'
            ? 'The admin lane stays clean and ad-free.'
            : 'The player lane keeps monetization and progression together in one loop.'}{' '}
          {loading ? 'Syncing local progress now.' : `${state.adsSeen} rewarded claims have been logged on this device.`}
        </Text>
      </InfoPanel>
    </MobileShell>
  );
}

function StatBubble({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'blue' | 'gold' | 'green' | 'purple';
  value: string;
}) {
  return (
    <View style={[styles.statBubble, toneStyles[tone]]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const toneStyles = StyleSheet.create({
  gold: { backgroundColor: '#f7e4b7' },
  blue: { backgroundColor: '#d8e7ea' },
  green: { backgroundColor: '#dcecd4' },
  purple: { backgroundColor: '#eadcf1' },
});

const styles = StyleSheet.create({
  hero: {
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 26,
    borderWidth: 1,
    gap: 18,
    padding: 20,
  },
  heroCopy: {
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
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 17,
    lineHeight: 24,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBubble: {
    borderColor: '#ead9c6',
    borderRadius: 18,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 4,
    minHeight: 96,
    justifyContent: 'center',
    minWidth: 112,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statLabel: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    color: tokens.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sponsorPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  adminPanel: {
    backgroundColor: '#eef5e7',
    borderColor: '#d1dfc4',
  },
  panelTitle: {
    color: tokens.text,
    fontSize: 19,
    fontWeight: '800',
  },
  panelBody: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  panelHint: {
    color: tokens.subtleText,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    gap: 12,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: tokens.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionBody: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  cardList: {
    gap: 14,
  },
  detailPanel: {
    backgroundColor: '#fbf4eb',
  },
});
