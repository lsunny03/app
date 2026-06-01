import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 500;
  const {
    appVariant,
    claimSponsoredBonus,
    claimingSponsoredBonus,
    isAdminBuild,
    loading,
    sponsoredBonus,
    state,
  } = useGameApp();
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);

  async function handleClaimSponsoredBonus() {
    const result = await claimSponsoredBonus();
    setBonusMessage(result.message);
  }

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>Offline arcade collection</Text>
            <Text style={[styles.title, compact && styles.titleCompact]}>Pocket Arcade</Text>
            <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
              Four quick-play games, local progression, and an admin build that runs ad-free.
            </Text>
          </View>

          <View style={styles.walletRow}>
            <StatPill compact={compact} label="Coins" value={state.coins.toString()} tone="gold" />
            <StatPill compact={compact} label="Sessions" value={state.sessionsPlayed.toString()} tone="blue" />
            <StatPill
              compact={compact}
              label="Build"
              value={isAdminBuild ? 'Admin' : compact ? 'Player' : 'Consumer'}
              tone={isAdminBuild ? 'green' : 'purple'}
              wide={compact}
            />
          </View>
        </View>

        {!isAdminBuild ? (
          <View style={styles.sponsorCard}>
            <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
              <View style={styles.flexCopy}>
                <Text style={styles.sectionTitle}>Rewarded coin bonus</Text>
                <Text style={styles.sectionBody}>
                  Watch a rewarded ad on iOS or Android to claim bonus coins without breaking the
                  free-player loop.
                </Text>
              </View>
              <Pressable
                disabled={!sponsoredBonus.canClaim || claimingSponsoredBonus}
                onPress={handleClaimSponsoredBonus}
                style={[
                  styles.primaryAction,
                  compact && styles.primaryActionCompact,
                  (!sponsoredBonus.canClaim || claimingSponsoredBonus) && styles.primaryActionDisabled,
                ]}>
                <Text style={styles.primaryActionText}>
                  {claimingSponsoredBonus ? 'Loading...' : sponsoredBonus.supported ? '+35 coins' : 'On device'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.sponsorHint}>{bonusMessage || sponsoredBonus.message}</Text>
          </View>
        ) : (
          <View style={styles.adminCard}>
            <Text style={styles.sectionTitle}>Admin build active</Text>
            <Text style={styles.sectionBody}>
              This build omits rewarded ads entirely and keeps booster usage free for QA and tuning.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
            <View style={styles.flexCopy}>
              <Text style={styles.sectionTitle}>Game library</Text>
              <Text style={styles.sectionBody}>Pick up a run in under a minute, even offline.</Text>
            </View>
            <Pressable onPress={() => router.push('/shop')} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Shop</Text>
            </Pressable>
          </View>

          <View style={styles.cardGrid}>
            {GAME_LIBRARY.map((game) => (
              <Pressable
                key={game.slug}
                onPress={() =>
                  router.push({
                    pathname: '/game/[slug]',
                    params: { slug: game.slug },
                  })
                }
                style={[styles.gameCard, { borderColor: game.accent }]}>
                <View style={styles.gameCardTop}>
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                </View>
                <Text style={styles.gameDescription}>{game.description}</Text>
                <View style={styles.gameMetaRow}>
                  <MetaBadge label="Best" value={String(state.bestScores[game.slug] ?? 0)} />
                  <MetaBadge label="Hook" value={game.monetizationHook} />
                </View>
                <Text style={styles.playLabel}>Play now</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
            <View style={styles.flexCopy}>
              <Text style={styles.sectionTitle}>Studio controls</Text>
              <Text style={styles.sectionBody}>
                Inspect the current build variant, local economy, and test reset controls.
              </Text>
            </View>
            <Pressable onPress={() => router.push('/settings')} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Settings</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <InfoCard
              title="Rewarded claims"
              value={String(state.adsSeen)}
              description="Counts rewarded bonus claims completed through the real ad flow."
            />
            <InfoCard
              title="Boosters"
              value={String(
                state.boosters.freeze +
                  state.boosters.undo +
                  state.boosters.shuffle +
                  state.boosters.magnet
              )}
              description="Consumables ready to use directly inside puzzle and arcade runs."
            />
            <InfoCard
              title="Variant"
              value={appVariant === 'admin' ? 'Ad-free admin' : 'Monetized player'}
              description="Controlled by the build profile instead of a player-facing toggle."
            />
          </View>
        </View>

        {loading ? <Text style={styles.loading}>Syncing local progress...</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({
  compact,
  label,
  value,
  tone,
  wide = false,
}: {
  compact?: boolean;
  label: string;
  value: string;
  tone: 'gold' | 'blue' | 'green' | 'purple';
  wide?: boolean;
}) {
  return (
    <View
      style={[
        styles.statPill,
        statToneStyles[tone],
        compact && styles.statPillCompact,
        wide && styles.statPillWide,
      ]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaBadge}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  );
}

const statToneStyles = StyleSheet.create({
  gold: { backgroundColor: '#f7e4b7' },
  blue: { backgroundColor: '#d8e7ea' },
  green: { backgroundColor: '#dcecd4' },
  purple: { backgroundColor: '#eadcf1' },
});

const styles = StyleSheet.create({
  hero: {
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  heroCompact: {
    padding: 20,
    gap: 16,
  },
  heroText: {
    gap: 10,
  },
  eyebrow: {
    color: '#a88377',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: tokens.text,
    fontSize: 34,
    fontWeight: '800',
  },
  titleCompact: {
    fontSize: 29,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 22,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  walletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statPill: {
    borderWidth: 1,
    borderColor: '#ead9c6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 110,
    gap: 2,
  },
  statPillCompact: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 96,
  },
  statPillWide: {
    flexBasis: '100%',
  },
  statLabel: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sponsorCard: {
    backgroundColor: '#fff3ea',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efd8c3',
    gap: 12,
  },
  sponsorHint: {
    color: tokens.subtleText,
    fontSize: 13,
    lineHeight: 19,
  },
  adminCard: {
    backgroundColor: '#eef5e7',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d1dfc4',
    gap: 8,
  },
  flexCopy: {
    flex: 1,
  },
  section: {
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionHeaderCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  sectionTitle: {
    color: tokens.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionBody: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    maxWidth: 520,
  },
  primaryAction: {
    backgroundColor: tokens.pink,
    borderWidth: 1,
    borderColor: '#e1b1bf',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryActionCompact: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryActionDisabled: {
    opacity: 0.45,
  },
  primaryActionText: {
    color: '#745463',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryAction: {
    backgroundColor: '#fbf4eb',
    borderWidth: 1,
    borderColor: tokens.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  secondaryActionText: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '700',
  },
  cardGrid: {
    gap: 14,
  },
  gameCard: {
    backgroundColor: tokens.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  gameCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gameEmoji: {
    fontSize: 28,
  },
  gameTitle: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  gameDescription: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  gameMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaBadge: {
    backgroundColor: tokens.surfaceStrong,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 112,
  },
  metaLabel: {
    color: tokens.subtleText,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: tokens.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  playLabel: {
    color: '#bd8797',
    fontSize: 14,
    fontWeight: '800',
  },
  statsGrid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  infoTitle: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: tokens.text,
    fontSize: 24,
    fontWeight: '800',
  },
  infoDescription: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    color: tokens.subtleText,
    textAlign: 'center',
    fontSize: 13,
    paddingBottom: 24,
  },
});
