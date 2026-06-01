import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function HomeScreen() {
  const { state, loading, redeemSponsoredBonus } = useGameApp();

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>Offline arcade collection</Text>
            <Text style={styles.title}>Pocket Arcade</Text>
            <Text style={styles.subtitle}>
              Four quick-play games, local progression, and an admin build that runs ad-free.
            </Text>
          </View>

          <View style={styles.walletRow}>
            <StatPill label="Coins" value={state.coins.toString()} tone="gold" />
            <StatPill label="Sessions" value={state.sessionsPlayed.toString()} tone="blue" />
            <StatPill
              label="Mode"
              value={state.adminMode ? 'Admin' : 'Player'}
              tone={state.adminMode ? 'green' : 'purple'}
            />
          </View>
        </View>

        {!state.adminMode ? (
          <View style={styles.sponsorCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Sponsored bonus</Text>
                <Text style={styles.sectionBody}>
                  Claim a quick bonus before the next run and keep the free version growing.
                </Text>
              </View>
              <Pressable onPress={redeemSponsoredBonus} style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>+35 coins</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.adminCard}>
            <Text style={styles.sectionTitle}>Admin build active</Text>
            <Text style={styles.sectionBody}>
              Ads are suppressed, premium previews are unlocked, and booster costs are waived.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
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
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Studio controls</Text>
              <Text style={styles.sectionBody}>
                Tune the free-player loop or flip into admin mode for testing.
              </Text>
            </View>
            <Pressable onPress={() => router.push('/settings')} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Settings</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <InfoCard
              title="Ad views"
              value={String(state.adsSeen)}
              description="Counts sponsored bonus taps taken in the free build."
            />
            <InfoCard
              title="Boosters"
              value={String(
                state.boosters.freeze +
                  state.boosters.undo +
                  state.boosters.shuffle +
                  state.boosters.magnet
              )}
              description="Consumables earned or granted for run tuning."
            />
            <InfoCard
              title="Last played"
              value={state.lastPlayed ? GAME_LIBRARY_MAP[state.lastPlayed].title : 'None'}
              description="Useful for picking up balancing work fast."
            />
          </View>
        </View>

        {loading ? <Text style={styles.loading}>Syncing local progress...</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'gold' | 'blue' | 'green' | 'purple';
}) {
  return (
    <View style={[styles.statPill, statToneStyles[tone]]}>
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

const GAME_LIBRARY_MAP = Object.fromEntries(GAME_LIBRARY.map((game) => [game.slug, game])) as Record<
  (typeof GAME_LIBRARY)[number]['slug'],
  (typeof GAME_LIBRARY)[number]
>;

const statToneStyles = StyleSheet.create({
  gold: { backgroundColor: '#372f17' },
  blue: { backgroundColor: '#18283f' },
  green: { backgroundColor: '#163223' },
  purple: { backgroundColor: '#2a1b3a' },
});

const styles = StyleSheet.create({
  hero: {
    backgroundColor: tokens.surfaceStrong,
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  heroText: {
    gap: 10,
  },
  eyebrow: {
    color: tokens.cyan,
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
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 22,
  },
  walletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statPill: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 110,
    gap: 2,
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
    backgroundColor: '#1f2231',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#504e76',
  },
  adminCard: {
    backgroundColor: '#173127',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2e6a53',
    gap: 8,
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
    backgroundColor: tokens.gold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryActionText: {
    color: '#241b00',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryAction: {
    backgroundColor: tokens.surface,
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
    color: tokens.cyan,
    fontSize: 14,
    fontWeight: '800',
  },
  statsGrid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: tokens.surface,
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
