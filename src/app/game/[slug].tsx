import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CakeSortGame } from '@/features/games/cake-sort-game';
import { FruitMergeGame } from '@/features/games/fruit-merge-game';
import { SnakeGame } from '@/features/games/snake-game';
import { ScrewdomGame } from '@/features/games/screwdom-game';
import { GAME_LIBRARY_MAP, isGameSlug } from '@/features/game-library';
import { useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function GameScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const { isAdminBuild, recordSession, state } = useGameApp();

  if (!slug || !isGameSlug(slug)) {
    return (
      <SafeAreaView style={screenStyles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Game not found</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
            <Text style={styles.backLabel}>Return home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const game = GAME_LIBRARY_MAP[slug];

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>
              {game.emoji} {game.title}
            </Text>
            <Text style={styles.subtitle}>{game.description}</Text>
          </View>

          <View style={[styles.bestCard, { borderColor: game.accent }]}>
            <Text style={styles.bestLabel}>Best score</Text>
            <Text style={styles.bestValue}>{state.bestScores[slug]}</Text>
          </View>
        </View>

        {!isAdminBuild ? (
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Consumer build</Text>
            <Text style={styles.bannerBody}>
              Rewarded bonus ads stay on the home screen only. Boosters bought in the shop now work
              directly inside these game runs.
            </Text>
          </View>
        ) : (
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Admin build</Text>
            <Text style={styles.bannerBody}>
              Ads are removed and boosters can be used without spending inventory.
            </Text>
          </View>
        )}

        {slug === 'snake' ? <SnakeGame onComplete={(score) => recordSession(slug, score)} /> : null}
        {slug === 'fruit-merge' ? (
          <FruitMergeGame onComplete={(score) => recordSession(slug, score)} />
        ) : null}
        {slug === 'cake-sort' ? (
          <CakeSortGame onComplete={(score) => recordSession(slug, score)} />
        ) : null}
        {slug === 'screwdom' ? (
          <ScrewdomGame onComplete={(score) => recordSession(slug, score)} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  header: {
    gap: 16,
  },
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
  headerCopy: {
    gap: 8,
  },
  eyebrow: {
    color: tokens.text,
    fontSize: 30,
    fontWeight: '800',
  },
  title: {
    color: tokens.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  bestCard: {
    backgroundColor: tokens.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
    minWidth: 140,
  },
  bestLabel: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
  },
  bestValue: {
    color: tokens.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  banner: {
    backgroundColor: '#fff3ea',
    borderWidth: 1,
    borderColor: '#efd8c3',
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  bannerTitle: {
    color: tokens.text,
    fontSize: 16,
    fontWeight: '800',
  },
  bannerBody: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
});
