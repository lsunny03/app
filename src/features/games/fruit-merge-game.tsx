import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BoosterRow, ActionButton, GameSurface, StatRow } from './shared';

import { useGameApp } from '@/features/game-app-context';
import { tokens } from '@/features/theme';

const SIZE = 4;
const FRUITS = ['.', 'Cherry', 'Strawberry', 'Orange', 'Peach', 'Pineapple', 'Melon', 'Dragon'];

type FruitHistory = {
  board: number[];
  score: number;
  status: 'ready' | 'live' | 'ended';
};

function getEmptyIndexes(board: number[]) {
  return board.flatMap((value, index) => (value === 0 ? [index] : []));
}

function seedBoard() {
  const board = Array.from({ length: SIZE * SIZE }, () => 0);
  return addRandomTile(addRandomTile(board));
}

function addRandomTile(board: number[]) {
  const empty = getEmptyIndexes(board);
  if (empty.length === 0) {
    return board;
  }
  const index = empty[Math.floor(Math.random() * empty.length)];
  const next = [...board];
  next[index] = Math.random() > 0.85 ? 2 : 1;
  return next;
}

function shiftLine(line: number[]) {
  const compact = line.filter(Boolean);
  const merged: number[] = [];
  let gained = 0;

  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] !== 0 && compact[index] === compact[index + 1]) {
      const upgraded = compact[index] + 1;
      merged.push(upgraded);
      gained += upgraded * 12;
      index += 1;
    } else {
      merged.push(compact[index]);
    }
  }

  while (merged.length < SIZE) {
    merged.push(0);
  }

  return { line: merged, gained };
}

function move(board: number[], direction: 'up' | 'down' | 'left' | 'right') {
  const next = Array.from({ length: SIZE * SIZE }, () => 0);
  let moved = false;
  let gained = 0;

  for (let outer = 0; outer < SIZE; outer += 1) {
    const rawLine = Array.from({ length: SIZE }, (_, inner) => {
      if (direction === 'left' || direction === 'right') {
        const col = direction === 'left' ? inner : SIZE - 1 - inner;
        return board[outer * SIZE + col];
      }
      const row = direction === 'up' ? inner : SIZE - 1 - inner;
      return board[row * SIZE + outer];
    });

    const result = shiftLine(rawLine);
    gained += result.gained;

    for (let inner = 0; inner < SIZE; inner += 1) {
      if (direction === 'left' || direction === 'right') {
        const col = direction === 'left' ? inner : SIZE - 1 - inner;
        next[outer * SIZE + col] = result.line[inner];
      } else {
        const row = direction === 'up' ? inner : SIZE - 1 - inner;
        next[row * SIZE + outer] = result.line[inner];
      }
    }

    if (rawLine.some((value, index) => value !== result.line[index])) {
      moved = true;
    }
  }

  return { board: moved ? addRandomTile(next) : board, moved, gained };
}

function hasMoves(board: number[]) {
  if (board.includes(0)) {
    return true;
  }

  for (let index = 0; index < board.length; index += 1) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const value = board[index];
    if (col < SIZE - 1 && board[index + 1] === value) {
      return true;
    }
    if (row < SIZE - 1 && board[index + SIZE] === value) {
      return true;
    }
  }

  return false;
}

export function FruitMergeGame({ onComplete }: { onComplete: (score: number) => void }) {
  const { consumeBooster, isAdminBuild, state } = useGameApp();
  const [board, setBoard] = useState(seedBoard);
  const [history, setHistory] = useState<FruitHistory | null>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'ready' | 'live' | 'ended'>('ready');
  const completionRef = useRef(false);

  useEffect(() => {
    if (status === 'ended' && !completionRef.current) {
      completionRef.current = true;
      onComplete(score);
    }
  }, [onComplete, score, status]);

  const highestFruit = useMemo(() => Math.max(...board), [board]);

  function handleMove(direction: 'up' | 'down' | 'left' | 'right') {
    const result = move(board, direction);
    if (!result.moved) {
      return;
    }

    setHistory({
      board: [...board],
      score,
      status,
    });
    setBoard(result.board);
    setScore((current) => current + result.gained);
    setStatus(hasMoves(result.board) ? 'live' : 'ended');
  }

  function reset() {
    completionRef.current = false;
    setBoard(seedBoard());
    setHistory(null);
    setScore(0);
    setStatus('ready');
  }

  function useUndoBoost() {
    if (!history || !consumeBooster('undo')) {
      return;
    }

    setBoard(history.board);
    setScore(history.score);
    setStatus(history.status);
    setHistory(null);
  }

  function useMagnetBoost() {
    const targetIndex = board.findIndex((value) => value > 0 && value < FRUITS.length - 1);
    if (targetIndex === -1 || !consumeBooster('magnet')) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[targetIndex] += 1;

    setHistory({
      board: [...board],
      score,
      status,
    });
    setBoard(nextBoard);
    setScore((current) => current + nextBoard[targetIndex] * 20);
    setStatus(hasMoves(nextBoard) ? 'live' : 'ended');
  }

  return (
    <GameSurface
      title="Fruit Merge"
      subtitle="Slide the orchard, stack matching fruit, and rescue bad boards with live boosters.">
      <StatRow
        items={[
          { label: 'Score', value: String(score) },
          { label: 'Top fruit', value: FRUITS[highestFruit] ?? 'Cherry' },
          { label: 'Undo', value: isAdminBuild ? 'Admin' : String(state.boosters.undo) },
          { label: 'Magnet', value: isAdminBuild ? 'Admin' : String(state.boosters.magnet) },
        ]}
      />

      <View style={styles.grid}>
        {board.map((value, index) => (
          <View
            key={index}
            style={[
              styles.tile,
              value === 0 ? styles.tileEmpty : fruitStyles[value] ?? styles.tileFinal,
            ]}>
            <Text style={styles.tileLabel}>{value === 0 ? '' : FRUITS[value]}</Text>
          </View>
        ))}
      </View>

      <BoosterRow
        items={[
          {
            disabled: !history || (!isAdminBuild && state.boosters.undo < 1),
            label: isAdminBuild ? 'Undo move' : `Undo (${state.boosters.undo})`,
            onPress: useUndoBoost,
          },
          {
            disabled: !board.some((value) => value > 0 && value < FRUITS.length - 1) || (!isAdminBuild && state.boosters.magnet < 1),
            label: isAdminBuild ? 'Magnet' : `Magnet (${state.boosters.magnet})`,
            onPress: useMagnetBoost,
          },
          {
            label: status === 'ended' ? 'Retry orchard' : 'Reset board',
            onPress: reset,
            tone: 'primary',
          },
        ]}
      />

      <View style={styles.controls}>
        <ActionButton label="Up" onPress={() => handleMove('up')} />
        <View style={styles.row}>
          <ActionButton label="Left" onPress={() => handleMove('left')} />
          <ActionButton label="Right" onPress={() => handleMove('right')} />
        </View>
        <ActionButton label="Down" onPress={() => handleMove('down')} />
      </View>
    </GameSurface>
  );
}

const fruitStyles: Record<number, { backgroundColor: string }> = StyleSheet.create({
  1: { backgroundColor: '#66263f' },
  2: { backgroundColor: '#8b3453' },
  3: { backgroundColor: '#b44b43' },
  4: { backgroundColor: '#db7c37' },
  5: { backgroundColor: '#cbac37' },
  6: { backgroundColor: '#6dac52' },
  7: { backgroundColor: '#5385d1' },
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  tileEmpty: {
    backgroundColor: '#0f1420',
  },
  tileFinal: {
    backgroundColor: '#4f63c8',
  },
  tileLabel: {
    color: tokens.text,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
