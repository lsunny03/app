import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { GameSlug } from './game-library';

type BoosterKey = 'freeze' | 'undo' | 'shuffle' | 'magnet';

type AppState = {
  coins: number;
  adminMode: boolean;
  adsSeen: number;
  sessionsPlayed: number;
  lastPlayed: GameSlug | null;
  bestScores: Record<GameSlug, number>;
  boosters: Record<BoosterKey, number>;
};

type GameAppContextValue = {
  loading: boolean;
  state: AppState;
  buyBooster: (key: BoosterKey) => void;
  redeemSponsoredBonus: () => void;
  recordSession: (slug: GameSlug, score: number) => void;
  resetProgress: () => void;
  toggleAdminMode: (value: boolean) => void;
};

const STORAGE_KEY = 'pocket-arcade-state-v1';

const defaultState: AppState = {
  coins: 120,
  adminMode: false,
  adsSeen: 0,
  sessionsPlayed: 0,
  lastPlayed: null,
  bestScores: {
    snake: 0,
    'fruit-merge': 0,
    'cake-sort': 0,
    screwdom: 0,
  },
  boosters: {
    freeze: 1,
    undo: 1,
    shuffle: 1,
    magnet: 1,
  },
};

export const SHOP_BOOSTERS: {
  key: BoosterKey;
  title: string;
  emoji: string;
  cost: number;
  description: string;
}[] = [
  {
    key: 'freeze',
    title: 'Freeze',
    emoji: '❄️',
    cost: 40,
    description: 'Pause snake pressure for a beat while you reset your path.',
  },
  {
    key: 'undo',
    title: 'Undo',
    emoji: '↩️',
    cost: 55,
    description: 'Reverse one mistake in puzzle runs without resetting the whole board.',
  },
  {
    key: 'shuffle',
    title: 'Shuffle',
    emoji: '🔀',
    cost: 70,
    description: 'Re-roll a puzzle board when it starts cold or turns messy.',
  },
  {
    key: 'magnet',
    title: 'Magnet',
    emoji: '🧲',
    cost: 60,
    description: 'Adds extra score value to merge runs and future premium hooks.',
  },
];

const GameAppContext = createContext<GameAppContextValue | null>(null);

export function GameAppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!mounted || !value) {
          return;
        }

        const parsed = JSON.parse(value) as Partial<AppState>;
        setState((current) => ({
          ...current,
          ...parsed,
          bestScores: {
            ...current.bestScores,
            ...parsed.bestScores,
          },
          boosters: {
            ...current.boosters,
            ...parsed.boosters,
          },
        }));
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [loading, state]);

  const value = useMemo<GameAppContextValue>(
    () => ({
      loading,
      state,
      buyBooster: (key) => {
        const config = SHOP_BOOSTERS.find((booster) => booster.key === key);
        if (!config) {
          return;
        }

        setState((current) => {
          if (!current.adminMode && current.coins < config.cost) {
            return current;
          }

          return {
            ...current,
            coins: current.adminMode ? current.coins : current.coins - config.cost,
            boosters: {
              ...current.boosters,
              [key]: current.boosters[key] + 1,
            },
          };
        });
      },
      redeemSponsoredBonus: () => {
        setState((current) => {
          if (current.adminMode) {
            return current;
          }

          return {
            ...current,
            coins: current.coins + 35,
            adsSeen: current.adsSeen + 1,
          };
        });
      },
      recordSession: (slug, score) => {
        setState((current) => {
          const earned = current.adminMode
            ? Math.max(15, Math.floor(score / 8) + 12)
            : Math.max(8, Math.floor(score / 10) + 10);

          return {
            ...current,
            coins: current.coins + earned,
            sessionsPlayed: current.sessionsPlayed + 1,
            lastPlayed: slug,
            bestScores: {
              ...current.bestScores,
              [slug]: Math.max(current.bestScores[slug], score),
            },
          };
        });
      },
      resetProgress: () => {
        setState(defaultState);
      },
      toggleAdminMode: (value) => {
        setState((current) => ({
          ...current,
          adminMode: value,
        }));
      },
    }),
    [loading, state]
  );

  return <GameAppContext.Provider value={value}>{children}</GameAppContext.Provider>;
}

export function useGameApp() {
  const context = useContext(GameAppContext);

  if (!context) {
    throw new Error('useGameApp must be used within GameAppProvider');
  }

  return context;
}
