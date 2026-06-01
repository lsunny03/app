import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameDefinition } from '@/features/game-library';
import { AppIcon } from '@/features/navigation/mobile-shell';
import { elevations, tokens } from '@/features/theme';

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
      <View style={[styles.topBand, { backgroundColor: `${game.accent}24` }]}>
        <View style={[styles.emojiWrap, { borderColor: game.accent, backgroundColor: `${game.accent}36` }]}>
          <Text style={styles.emoji}>{game.emoji}</Text>
        </View>

        <View style={styles.headerCopy}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaBadge label="Best score" value={String(bestScore)} />
        <MetaBadge label="Reward loop" value={game.monetizationHook} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerCopy}>Quick start</Text>
        <View style={[styles.openPill, { backgroundColor: `${game.accent}2f` }]}>
          <Text style={styles.openLabel}>Open</Text>
          <AppIcon
            fallback="→"
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={14}
            tintColor="#715a4b"
          />
        </View>
      </View>
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
    ...elevations.card,
    backgroundColor: tokens.surface,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    padding: 18,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  topBand: {
    borderColor: '#ffffffc7',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  emojiWrap: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  emoji: {
    fontSize: 30,
  },
  headerCopy: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: tokens.text,
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaBadge: {
    backgroundColor: tokens.surfaceMuted,
    borderColor: tokens.border,
    borderRadius: 16,
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
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerCopy: {
    color: '#b48593',
    fontSize: 14,
    fontWeight: '800',
  },
  openPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  openLabel: {
    color: '#715a4b',
    fontSize: 13,
    fontWeight: '800',
  },
});
