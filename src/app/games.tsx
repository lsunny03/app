import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GameCard } from '@/features/game-card';
import { GAME_LIBRARY } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { HeaderButton, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function GamesScreen() {
  const { state } = useGameApp();

  return (
    <MobileShell
      activeTab="games"
      header={
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Pick a game</Text>
            <Text style={styles.title}>Quick-play lanes</Text>
            <Text style={styles.subtitle}>
              Jump straight into a run with the brightest boosters and best score tracking.
            </Text>
          </View>
          <HeaderButton label="Open shop" onPress={() => router.replace('/shop')} tone="primary" />
        </View>
      }>
      <InfoPanel style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Play in under a minute</Text>
        <Text style={styles.infoBody}>
          Snake for speed, Fruit Merge for combos, Cake Sort for calm taps, and Screwdom for a tighter puzzle loop.
        </Text>
      </InfoPanel>

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
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
  },
  infoPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  infoTitle: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  infoBody: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  cardList: {
    gap: 14,
  },
});
