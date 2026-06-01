import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GameCard } from '@/features/game-card';
import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { BadgePill, HeaderButton, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function GamesScreen() {
  const { state } = useGameApp();

  return (
    <MobileShell
      activeTab="games"
      header={
        <View style={styles.hero}>
          <View style={styles.badgeRow}>
            <BadgePill
              iconFallback="✦"
              iconName={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
              label="All four live"
              tone="butter"
            />
            <BadgePill
              iconFallback="•"
              iconName={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
              label="Offline runs"
              tone="sky"
            />
          </View>

          <Text style={styles.title}>Pick the loop that fits your mood.</Text>
          <Text style={styles.subtitle}>
            Fast arcade, merge comfort, calm sorting, or a tighter screw puzzle, all in one shelf.
          </Text>

          <View style={styles.moodRow}>
            <BadgePill label="Fast" tone="blush" />
            <BadgePill label="Calm" tone="mint" />
            <BadgePill label="Puzzle" tone="lavender" />
            <BadgePill label="Replayable" tone="neutral" />
          </View>

          <HeaderButton
            iconFallback="□"
            iconName={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' }}
            label="Open shop"
            onPress={() => router.replace('/shop')}
            tone="secondary"
          />
        </View>
      }>
      <View style={styles.cardList}>
        {GAME_LIBRARY.map((game) => (
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
    </MobileShell>
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
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
    maxWidth: 330,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 360,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardList: {
    gap: 14,
  },
});
