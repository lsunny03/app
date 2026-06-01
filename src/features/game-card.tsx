import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameDefinition } from '@/features/game-library';
import { tokens } from '@/features/theme';

export function GameCard({
  bestScore,
  game,
  onPress,
}: {
  bestScore: number;
  game: GameDefinition;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: game.accent },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{game.emoji}</Text>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaBadge label="Best" value={String(bestScore)} />
        <MetaBadge label="Hook" value={game.monetizationHook} />
      </View>

      <Text style={styles.playLabel}>Play now</Text>
    </Pressable>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surface,
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    minHeight: 188,
    padding: 20,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.988 }],
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  emoji: {
    fontSize: 32,
    marginTop: 2,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaBadge: {
    backgroundColor: tokens.surfaceStrong,
    borderColor: tokens.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metaLabel: {
    color: tokens.subtleText,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  playLabel: {
    color: '#bd8797',
    fontSize: 15,
    fontWeight: '800',
  },
});
