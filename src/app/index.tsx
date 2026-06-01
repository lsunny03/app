import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GameCard } from '@/features/game-card';
import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import {
  AppIcon,
  BadgePill,
  HeaderButton,
  IconRow,
  InfoPanel,
  MobileShell,
} from '@/features/navigation/mobile-shell';
import { elevations, tokens } from '@/features/theme';

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
          <View style={styles.heroTopRow}>
            <BadgePill
              iconFallback="✦"
              iconName={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
              label="Pocket Arcade"
              tone="lavender"
            />

            {isAdminBuild ? (
              <BadgePill
                iconFallback="✓"
                iconName={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                label="Admin build"
                tone="mint"
              />
            ) : (
              <BadgePill
                iconFallback="+"
                iconName={{ ios: 'gift.fill', android: 'featured_seasonal_and_gifts', web: 'featured_seasonal_and_gifts' }}
                label="Bonus left"
                tone="blush"
                value={String(sponsoredBonus.remainingClaims)}
              />
            )}
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.title}>Soft little games for short, happy loops.</Text>
            <Text style={styles.subtitle}>
              Offline play, quick restarts, and a cleaner split between the player build and the ad-free admin build.
            </Text>
          </View>

          <View style={styles.showcaseGrid}>
            {GAME_LIBRARY.map((game) => (
              <View key={game.slug} style={[styles.showcaseTile, { backgroundColor: `${game.accent}25` }]}>
                <Text style={styles.showcaseEmoji}>{game.emoji}</Text>
                <Text style={styles.showcaseTitle}>{game.title.replace(' Lite', '')}</Text>
              </View>
            ))}
          </View>

          <View style={styles.quickStats}>
            <StatChip
              iconFallback="$"
              iconName={{ ios: 'creditcard.fill', android: 'toll', web: 'toll' }}
              label="Coins"
              tone="butter"
              value={String(state.coins)}
            />
            <StatChip
              iconFallback="✦"
              iconName={{ ios: 'wand.and.stars', android: 'auto_fix_high', web: 'auto_fix_high' }}
              label="Boosters"
              tone="sky"
              value={String(state.boosters.freeze + state.boosters.undo + state.boosters.shuffle + state.boosters.magnet)}
            />
            <StatChip
              iconFallback="⌂"
              iconName={{ ios: 'person.crop.square.fill', android: 'account_box', web: 'account_box' }}
              label="Build"
              tone={isAdminBuild ? 'mint' : 'lavender'}
              value={isAdminBuild ? 'Admin' : 'Player'}
            />
          </View>
        </View>
      }>
      {!isAdminBuild ? (
        <InfoPanel style={styles.sponsorPanel}>
          <IconRow
            iconFallback="✦"
            iconName={{ ios: 'play.rectangle.fill', android: 'smart_display', web: 'smart_display' }}
            subtitle="Rewarded bonuses stay visible here without crowding the rest of the shell."
            title="Rewarded bonus"
          />
          <Text style={styles.panelBody}>
            Claim a small coin refill on native iOS and Android builds, then jump back into a run.
          </Text>
          <HeaderButton
            iconFallback="+"
            iconName={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }}
            label={claimingSponsoredBonus ? 'Loading...' : sponsoredBonus.supported ? 'Claim +35 coins' : 'Only on device'}
            onPress={handleClaimSponsoredBonus}
            tone="primary"
          />
          <Text style={styles.panelHint}>{sponsoredBonus.message}</Text>
        </InfoPanel>
      ) : (
        <InfoPanel style={styles.adminPanel}>
          <IconRow
            iconFallback="✓"
            iconName={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
            subtitle="Monetization surfaces stay hidden so balancing and QA feel clean."
            title="Admin mode"
          />
          <Text style={styles.panelBody}>
            This build keeps boosters friction-free and the player economy out of the way.
          </Text>
        </InfoPanel>
      )}

      <View style={styles.actionsRow}>
        <HeaderButton
          iconFallback="◉"
          iconName={{ ios: 'gamecontroller.fill', android: 'sports_esports', web: 'sports_esports' }}
          label="Open all games"
          onPress={() => router.replace('/games')}
          tone="primary"
        />
        <HeaderButton
          iconFallback="□"
          iconName={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' }}
          label="Open shop"
          onPress={() => router.replace('/shop')}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tonight&apos;s picks</Text>
          <Text style={styles.sectionBody}>Two quick starts up front, then the full shelf one tap away.</Text>
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
        <IconRow
          iconFallback="•"
          iconName={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
          subtitle="A quick read on the local loop for this install."
          title="Studio snapshot"
        />
        <Text style={styles.panelBody}>
          {appVariant === 'admin'
            ? 'The admin lane stays clean and ad-free.'
            : 'The player lane keeps progression and monetization tied to the same lightweight loop.'}{' '}
          {loading ? 'Syncing local progress now.' : `${state.adsSeen} rewarded claims have been logged on this device.`}
        </Text>
      </InfoPanel>
    </MobileShell>
  );
}

function StatChip({
  iconFallback,
  iconName,
  label,
  tone,
  value,
}: {
  iconFallback: string;
  iconName: Parameters<typeof AppIcon>[0]['name'];
  label: string;
  tone: 'butter' | 'lavender' | 'mint' | 'sky';
  value: string;
}) {
  return (
    <View style={[styles.statChip, statToneStyles[tone]]}>
      <View style={styles.statChipTop}>
        <AppIcon fallback={iconFallback} name={iconName} size={14} tintColor="#755f54" />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const statToneStyles = StyleSheet.create({
  butter: { backgroundColor: '#f7ebc9' },
  sky: { backgroundColor: '#deedf0' },
  mint: { backgroundColor: '#e3eee1' },
  lavender: { backgroundColor: '#ebe2f3' },
});

const styles = StyleSheet.create({
  hero: {
    gap: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heroCopy: {
    gap: 8,
  },
  title: {
    color: tokens.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
    maxWidth: 340,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 360,
  },
  showcaseGrid: {
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showcaseTile: {
    ...elevations.card,
    alignItems: 'center',
    borderColor: '#ffffffba',
    borderRadius: 22,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 8,
    minHeight: 92,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  showcaseEmoji: {
    fontSize: 28,
  },
  showcaseTitle: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statChip: {
    borderColor: '#ffffffba',
    borderRadius: 22,
    borderWidth: 1,
    flexBasis: '31%',
    flexGrow: 1,
    gap: 8,
    minHeight: 86,
    justifyContent: 'space-between',
    minWidth: 100,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statChipTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
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
    backgroundColor: '#edf5e8',
    borderColor: '#d2dfc5',
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
    gap: 10,
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
    lineHeight: 21,
  },
  cardList: {
    gap: 14,
  },
  detailPanel: {
    backgroundColor: tokens.cream,
  },
});
