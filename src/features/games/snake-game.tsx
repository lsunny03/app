import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton, GameSurface, StatRow } from './shared';

import { tokens } from '@/features/theme';

const BOARD_SIZE = 12;
const INITIAL_SNAKE = [39, 38, 37];

type Direction = 'up' | 'down' | 'left' | 'right';

function randomFood(excluded: number[]) {
  let value = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
  while (excluded.includes(value)) {
    value = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
  }
  return value;
}

export function SnakeGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('right');
  const [food, setFood] = useState(() => randomFood(INITIAL_SNAKE));
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'ready' | 'running' | 'ended'>('ready');
  const completionRef = useRef(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const row = Math.floor(head / BOARD_SIZE);
        const col = head % BOARD_SIZE;

        const nextHead =
          direction === 'up'
            ? head - BOARD_SIZE
            : direction === 'down'
              ? head + BOARD_SIZE
              : direction === 'left'
                ? head - 1
                : head + 1;

        const invalidHorizontal =
          (direction === 'left' && col === 0) || (direction === 'right' && col === BOARD_SIZE - 1);
        const invalidVertical =
          (direction === 'up' && row === 0) || (direction === 'down' && row === BOARD_SIZE - 1);
        const collided = invalidHorizontal || invalidVertical || currentSnake.includes(nextHead);

        if (collided) {
          setRunning(false);
          setStatus('ended');
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];

        if (nextHead === food) {
          setScore((currentScore) => currentScore + 10);
          setFood(randomFood(nextSnake));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, 220);

    return () => clearInterval(timer);
  }, [direction, food, running]);

  useEffect(() => {
    if (status !== 'ended' || completionRef.current) {
      return;
    }

    completionRef.current = true;
    onComplete(score);
  }, [onComplete, score, status]);

  const cells = useMemo(
    () =>
      Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => ({
        index,
        type: snake.includes(index) ? 'snake' : food === index ? 'food' : 'empty',
      })),
    [food, snake]
  );

  function startGame() {
    setSnake(INITIAL_SNAKE);
    setDirection('right');
    setFood(randomFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('running');
    setRunning(true);
    completionRef.current = false;
  }

  return (
    <GameSurface
      title="Snake Sprint"
      subtitle="Tap into a direction and ride the speed curve. A clean path matters more than raw taps.">
      <StatRow
        items={[
          { label: 'Score', value: String(score) },
          { label: 'Length', value: String(snake.length) },
          { label: 'Status', value: status === 'ready' ? 'Ready' : status === 'running' ? 'Live' : 'Crash' },
        ]}
      />

      <View style={styles.board}>
        {cells.map((cell) => (
          <View
            key={cell.index}
            style={[
              styles.cell,
              cell.type === 'snake'
                ? styles.snakeCell
                : cell.type === 'food'
                  ? styles.foodCell
                  : styles.emptyCell,
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable onPress={() => setDirection('up')} style={styles.arrowButton}>
          <Text style={styles.arrowLabel}>Up</Text>
        </Pressable>
        <View style={styles.middleControls}>
          <Pressable onPress={() => setDirection('left')} style={styles.arrowButton}>
            <Text style={styles.arrowLabel}>Left</Text>
          </Pressable>
          <Pressable onPress={() => setDirection('right')} style={styles.arrowButton}>
            <Text style={styles.arrowLabel}>Right</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => setDirection('down')} style={styles.arrowButton}>
          <Text style={styles.arrowLabel}>Down</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ActionButton
          label={status === 'running' ? 'Restart' : status === 'ended' ? 'Retry' : 'Start'}
          onPress={startGame}
          tone="primary"
        />
        {status === 'ended' ? <Text style={styles.helper}>Run ended. Start again for a fresh payout.</Text> : null}
      </View>
    </GameSurface>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    width: '7.8%',
    aspectRatio: 1,
    borderRadius: 6,
  },
  emptyCell: {
    backgroundColor: '#0f1420',
  },
  snakeCell: {
    backgroundColor: '#7ad66f',
  },
  foodCell: {
    backgroundColor: '#ff6b7a',
  },
  controls: {
    alignItems: 'center',
    gap: 10,
  },
  middleControls: {
    flexDirection: 'row',
    gap: 10,
  },
  arrowButton: {
    backgroundColor: tokens.surfaceStrong,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  arrowLabel: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  helper: {
    color: tokens.subtleText,
    fontSize: 13,
    flex: 1,
    minWidth: 180,
  },
});
