import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BoosterRow, GameSurface, StatRow } from './shared';

import { useGameApp } from '@/features/game-app-context';
import { tokens } from '@/features/theme';

type VariantConfig = {
  title: string;
  subtitle: string;
  capacity: number;
  emptyColumns: number;
  colors: string[];
  label: string;
};

type StackHistory = {
  moves: number;
  stacks: string[][];
  status: 'ready' | 'live' | 'solved';
};

const CONFIGS: Record<'cake' | 'screw', VariantConfig> = {
  cake: {
    title: 'Cake Sort',
    subtitle: 'Move layers one tap at a time until every slice stack matches cleanly.',
    capacity: 4,
    emptyColumns: 1,
    colors: ['#f29f9f', '#f2cf8c', '#a6d8d4', '#c2b6ff'],
    label: 'Layers',
  },
  screw: {
    title: 'Screwdom Lite',
    subtitle: 'Route screws into cleaner bins and keep the top color aligned.',
    capacity: 3,
    emptyColumns: 1,
    colors: ['#7a91ff', '#87d2ff', '#c6c0d8', '#ffaf6e', '#7bd89f'],
    label: 'Screws',
  },
};

function generatePuzzle(config: VariantConfig) {
  const stacks = config.colors.map((color) =>
    Array.from({ length: config.capacity }, () => color)
  );
  for (let count = 0; count < config.emptyColumns; count += 1) {
    stacks.push([]);
  }

  let previousMove = '';
  const shuffleMoves = 40;

  for (let step = 0; step < shuffleMoves; step += 1) {
    const options = stacks.flatMap((source, sourceIndex) => {
      if (source.length === 0) {
        return [];
      }

      return stacks.flatMap((destination, destinationIndex) => {
        if (sourceIndex === destinationIndex || destination.length >= config.capacity) {
          return [];
        }

        const top = source[source.length - 1];
        const accepts = destination.length === 0 || destination[destination.length - 1] === top;
        const moveKey = `${sourceIndex}-${destinationIndex}`;
        if (!accepts || previousMove === `${destinationIndex}-${sourceIndex}`) {
          return [];
        }

        return [[sourceIndex, destinationIndex, moveKey] as const];
      });
    });

    if (options.length === 0) {
      break;
    }

    const [from, to, moveKey] = options[Math.floor(Math.random() * options.length)];
    const moving = stacks[from].pop();
    if (!moving) {
      break;
    }
    stacks[to].push(moving);
    previousMove = moveKey;
  }

  return stacks;
}

function isSolved(stacks: string[][], capacity: number) {
  return stacks.every(
    (stack) =>
      stack.length === 0 ||
      (stack.length === capacity && stack.every((piece) => piece === stack[0]))
  );
}

export function StackSortGame({
  variant,
  onComplete,
}: {
  variant: 'cake' | 'screw';
  onComplete: (score: number) => void;
}) {
  const { consumeBooster, isAdminBuild, state } = useGameApp();
  const config = CONFIGS[variant];
  const [history, setHistory] = useState<StackHistory | null>(null);
  const [stacks, setStacks] = useState(() => generatePuzzle(config));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<'ready' | 'live' | 'solved'>('ready');
  const completionRef = useRef(false);

  useEffect(() => {
    if (status === 'solved' && !completionRef.current) {
      completionRef.current = true;
      onComplete(Math.max(100, 220 - moves * 10));
    }
  }, [moves, onComplete, status]);

  function restart() {
    completionRef.current = false;
    setHistory(null);
    setStacks(generatePuzzle(config));
    setSelected(null);
    setMoves(0);
    setStatus('ready');
  }

  function useUndoBoost() {
    if (!history || !consumeBooster('undo')) {
      return;
    }

    setStacks(history.stacks.map((stack) => [...stack]));
    setMoves(history.moves);
    setSelected(null);
    setStatus(history.status);
    setHistory(null);
  }

  function useShuffleBoost() {
    if (!consumeBooster('shuffle')) {
      return;
    }

    completionRef.current = false;
    setHistory(null);
    setStacks(generatePuzzle(config));
    setSelected(null);
    setStatus('live');
  }

  function handleColumnPress(index: number) {
    if (selected === null) {
      if (stacks[index].length > 0) {
        setSelected(index);
        setStatus('live');
      }
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    const source = stacks[selected];
    const destination = stacks[index];
    if (!source || source.length === 0) {
      setSelected(null);
      return;
    }

    const moving = source[source.length - 1];
    const accepts =
      destination.length < config.capacity &&
      (destination.length === 0 || destination[destination.length - 1] === moving);

    if (!accepts) {
      setSelected(null);
      return;
    }

    setHistory({
      moves,
      stacks: stacks.map((stack) => [...stack]),
      status,
    });

    const next = stacks.map((stack) => [...stack]);
    next[selected].pop();
    next[index].push(moving);
    setStacks(next);
    setMoves((currentMoves) => currentMoves + 1);
    setStatus(isSolved(next, config.capacity) ? 'solved' : 'live');
    setSelected(null);
  }

  return (
    <GameSurface title={config.title} subtitle={config.subtitle}>
      <StatRow
        items={[
          { label: 'Moves', value: String(moves) },
          { label: config.label, value: String(stacks.flat().length) },
          { label: 'Undo', value: isAdminBuild ? 'Admin' : String(state.boosters.undo) },
          { label: 'Shuffle', value: isAdminBuild ? 'Admin' : String(state.boosters.shuffle) },
        ]}
      />

      <BoosterRow
        items={[
          {
            disabled: !history || (!isAdminBuild && state.boosters.undo < 1),
            label: isAdminBuild ? 'Undo move' : `Undo (${state.boosters.undo})`,
            onPress: useUndoBoost,
          },
          {
            disabled: !isAdminBuild && state.boosters.shuffle < 1,
            label: isAdminBuild ? 'Shuffle boost' : `Shuffle (${state.boosters.shuffle})`,
            onPress: useShuffleBoost,
          },
          {
            label: status === 'solved' ? 'New puzzle' : 'Restart run',
            onPress: restart,
            tone: 'primary',
          },
        ]}
      />

      <View style={styles.stackGrid}>
        {stacks.map((stack, index) => (
          <Pressable
            key={`${variant}-${index}`}
            onPress={() => handleColumnPress(index)}
            style={[
              styles.stackCard,
              selected === index && styles.stackCardSelected,
              variant === 'screw' && styles.stackCardTight,
            ]}>
            <Text style={styles.stackLabel}>
              {variant === 'cake' ? `Plate ${index + 1}` : `Tray ${index + 1}`}
            </Text>
            <View style={styles.piecesColumn}>
              {Array.from({ length: config.capacity }, (_, pieceIndex) => {
                const piece = stack[config.capacity - pieceIndex - 1];
                return (
                  <View
                    key={`${index}-${pieceIndex}`}
                    style={[
                      styles.piece,
                      !piece && styles.emptyPiece,
                      piece ? { backgroundColor: piece } : null,
                      variant === 'cake' ? styles.cakePiece : styles.screwPiece,
                    ]}>
                    {piece ? (
                      <Text style={styles.pieceLabel}>
                        {variant === 'cake' ? 'Layer' : 'Screw'}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </Pressable>
        ))}
      </View>
    </GameSurface>
  );
}

const styles = StyleSheet.create({
  stackGrid: {
    gap: 12,
  },
  stackCard: {
    backgroundColor: '#0f1420',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1f283c',
  },
  stackCardSelected: {
    borderColor: tokens.cyan,
  },
  stackCardTight: {
    paddingVertical: 12,
  },
  stackLabel: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
  },
  piecesColumn: {
    gap: 8,
  },
  piece: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPiece: {
    backgroundColor: '#171c2b',
    borderWidth: 1,
    borderColor: '#252e44',
  },
  cakePiece: {
    borderRadius: 14,
  },
  screwPiece: {
    borderRadius: 10,
  },
  pieceLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
