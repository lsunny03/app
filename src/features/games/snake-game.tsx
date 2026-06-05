import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BoosterRow, ActionButton, GameSurface, StatRow } from './shared';

import { useGameApp } from '@/features/game-app-context';
import { tokens } from '@/features/theme';

const BOARD_SIZE = 12;
const INITIAL_SNAKE = [39, 38, 37];
const FREEZE_DURATION_MS = 4000;

type Direction = 'up' | 'down' | 'left' | 'right';

function randomFood(excluded: number[]) {
  let value = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
  while (excluded.includes(value)) {
    value = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
  }
  return value;
}

export function SnakeGame({ onComplete }: { onComplete: (score: number) => void }) {
  const { consumeBooster, isAdminBuild, state } = useGameApp();
  const [freezeUntil, setFreezeUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
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
      if (Date.now() < freezeUntil) {
        return;
      }

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
  }, [direction, food, freezeUntil, running]);

  useEffect(() => {
    if (status !== 'ended' || completionRef.current) {
      return;
    }

    completionRef.current = true;
    onComplete(score);
  }, [onComplete, score, status]);

  useEffect(() => {
    if (!running && freezeUntil <= Date.now()) {
      return;
    }

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 200);

    return () => clearInterval(timer);
  }, [freezeUntil, running]);

  const cells = useMemo(
    () =>
      Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => ({
        index,
        type: snake.includes(index) ? 'snake' : food === index ? 'food' : 'empty',
      })),
    [food, snake]
  );

  function startGame() {
    setFreezeUntil(0);
    setNow(Date.now());
    setSnake(INITIAL_SNAKE);
    setDirection('right');
    setFood(randomFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('running');
    setRunning(true);
    completionRef.current = false;
  }

  function useFreezeBoost() {
    if (status !== 'running') {
      return;
    }

    if (!consumeBooster('freeze')) {
      return;
    }

    setFreezeUntil(Date.now() + FREEZE_DURATION_MS);
  }

  const freezeBoosts = isAdminBuild ? 'Admin' : String(state.boosters.freeze);
  const freezeActive = now < freezeUntil;

  return (
    <GameSurface
      title="Snake Sprint"
      subtitle="Tap into a direction and ride the speed curve. Freeze buys a short reset window when a run gets tight.">
      <StatRow
        items={[
          { label: 'Score', value: String(score) },
          { label: 'Length', value: String(snake.length) },
          { label: 'Freeze', value: freezeBoosts },
          {
            label: 'Status',
            value:
              status === 'ready'
                ? 'Ready'
                : status === 'running'
                  ? freezeActive
                    ? 'Frozen'
                    : 'Live'
                  : 'Crash',
          },
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

      <BoosterRow
        items={[
          {
            disabled: status !== 'running' || (!isAdminBuild && state.boosters.freeze < 1),
            label: isAdminBuild ? 'Freeze' : `Freeze (${state.boosters.freeze})`,
            onPress: useFreezeBoost,
          },
          {
            label: status === 'running' ? 'Restart' : status === 'ended' ? 'Retry' : 'Start',
            onPress: startGame,
            tone: 'primary',
          },
        ]}
      />

      <View style={styles.controls}>
        <ActionButton label="Up" onPress={() => setDirection('up')} />
        <View style={styles.middleControls}>
          <ActionButton label="Left" onPress={() => setDirection('left')} />
          <ActionButton label="Right" onPress={() => setDirection('right')} />
        </View>
        <ActionButton label="Down" onPress={() => setDirection('down')} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helper}>
          {freezeActive
            ? 'Freeze is active. Use the pause to plan your next turn.'
            : 'Rewarded ads now live on the home screen while freeze remains a real consumable here.'}
        </Text>
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
    backgroundColor: '#efe2d2',
  },
  snakeCell: {
    backgroundColor: '#a5d09a',
  },
  foodCell: {
    backgroundColor: '#eda7b5',
  },
  controls: {
    alignItems: 'center',
    gap: 10,
  },
  middleControls: {
    flexDirection: 'row',
    gap: 10,
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
