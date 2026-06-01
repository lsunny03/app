import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { GameSlug } from './game-library';
import { APP_VARIANT, IS_ADMIN_BUILD, MONETIZATION_ENABLED, type AppVariant } from './monetization/app-variant';
import {
  REWARDED_ADS_SUPPORTED,
  showSponsoredBonusAd,
} from './monetization/rewarded-ads';

type BoosterKey = 'freeze' | 'undo' | 'shuffle' | 'magnet';

type SponsoredBonusState = {
  claimCount: number;
  claimDayKey: string | null;
  lastClaimAt: number | null;
};

type AppState = {
  adsSeen: number;
  boosters: Record<BoosterKey, number>;
  coins: number;
  lastPlayed: GameSlug | null;
  bestScores: Record<GameSlug, number>;
  sessionsPlayed: number;
  sponsoredBonus: SponsoredBonusState;
};

type SponsoredBonusAvailability = {
  canClaim: boolean;
  cooldownMs: number;
  message: string;
  remainingClaims: number;
  supported: boolean;
};

type GameAppContextValue = {
  appVariant: AppVariant;
  buyBooster: (key: BoosterKey) => void;
  claimSponsoredBonus: () => Promise<{ granted: boolean; message: string }>;
  claimingSponsoredBonus: boolean;
  consumeBooster: (key: BoosterKey) => boolean;
  isAdminBuild: boolean;
  loading: boolean;
  monetizationEnabled: boolean;
  resetProgress: () => void;
  recordSession: (slug: GameSlug, score: number) => void;
  sponsoredBonus: SponsoredBonusAvailability;
  state: AppState;
};

const STORAGE_KEY = 'pocket-arcade-state-v2';
const SPONSORED_BONUS_COINS = 35;
const SPONSORED_BONUS_COOLDOWN_MS = 5 * 60 * 1000;
const MAX_DAILY_SPONSORED_BONUSES = 6;

const defaultState: AppState = {
  adsSeen: 0,
  coins: 120,
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
  sessionsPlayed: 0,
  sponsoredBonus: {
    claimCount: 0,
    claimDayKey: null,
    lastClaimAt: null,
  },
};

export const SHOP_BOOSTERS: {
  cost: number;
  description: string;
  emoji: string;
  key: BoosterKey;
  title: string;
}[] = [
  {
    cost: 40,
    description: 'Pause snake pressure for a beat while you reset your path.',
    emoji: '❄️',
    key: 'freeze',
    title: 'Freeze',
  },
  {
    cost: 55,
    description: 'Reverse one mistake in puzzle runs without resetting the whole board.',
    emoji: '↩️',
    key: 'undo',
    title: 'Undo',
  },
  {
    cost: 70,
    description: 'Re-roll a puzzle board when it turns messy without ending the run.',
    emoji: '🔀',
    key: 'shuffle',
    title: 'Shuffle',
  },
  {
    cost: 60,
    description: 'Pull the strongest fruit one tier higher to keep merge chains alive.',
    emoji: '🧲',
    key: 'magnet',
    title: 'Magnet',
  },
];

const GameAppContext = createContext<GameAppContextValue | null>(null);

function getDayKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function formatCooldown(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getSponsoredBonusAvailability(state: AppState, now: number): SponsoredBonusAvailability {
  if (IS_ADMIN_BUILD) {
    return {
      canClaim: false,
      cooldownMs: 0,
      message: 'Rewarded ads are disabled in the admin build.',
      remainingClaims: 0,
      supported: false,
    };
  }

  const today = getDayKey(now);
  const todayClaims = state.sponsoredBonus.claimDayKey === today ? state.sponsoredBonus.claimCount : 0;
  const remainingClaims = Math.max(0, MAX_DAILY_SPONSORED_BONUSES - todayClaims);
  const cooldownMs = state.sponsoredBonus.lastClaimAt
    ? Math.max(0, SPONSORED_BONUS_COOLDOWN_MS - (now - state.sponsoredBonus.lastClaimAt))
    : 0;

  if (!REWARDED_ADS_SUPPORTED) {
    return {
      canClaim: false,
      cooldownMs,
      message: 'Rewarded ads are available in iOS and Android builds.',
      remainingClaims,
      supported: false,
    };
  }

  if (remainingClaims === 0) {
    return {
      canClaim: false,
      cooldownMs,
      message: 'Daily sponsored bonus limit reached. Come back tomorrow.',
      remainingClaims,
      supported: true,
    };
  }

  if (cooldownMs > 0) {
    return {
      canClaim: false,
      cooldownMs,
      message: `Next rewarded bonus in ${formatCooldown(cooldownMs)}.`,
      remainingClaims,
      supported: true,
    };
  }

  return {
    canClaim: true,
    cooldownMs: 0,
    message: `${remainingClaims} rewarded bonus${remainingClaims === 1 ? '' : 'es'} left today.`,
    remainingClaims,
    supported: true,
  };
}

export function GameAppProvider({ children }: PropsWithChildren) {
  const [bonusClockMs, setBonusClockMs] = useState(() => Date.now());
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [claimingSponsoredBonus, setClaimingSponsoredBonus] = useState(false);

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
          sponsoredBonus: {
            ...current.sponsoredBonus,
            ...parsed.sponsoredBonus,
          },
        }));
      })
      .catch(() => undefined)
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

  useEffect(() => {
    if (IS_ADMIN_BUILD) {
      return;
    }

    const timer = setInterval(() => {
      setBonusClockMs(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sponsoredBonus = getSponsoredBonusAvailability(state, bonusClockMs);

  const value = useMemo<GameAppContextValue>(
    () => ({
      appVariant: APP_VARIANT,
      buyBooster: (key) => {
        const config = SHOP_BOOSTERS.find((booster) => booster.key === key);
        if (!config) {
          return;
        }

        setState((current) => {
          if (!IS_ADMIN_BUILD && current.coins < config.cost) {
            return current;
          }

          return {
            ...current,
            coins: IS_ADMIN_BUILD ? current.coins : current.coins - config.cost,
            boosters: {
              ...current.boosters,
              [key]: current.boosters[key] + 1,
            },
          };
        });
      },
      claimSponsoredBonus: async () => {
        const availability = getSponsoredBonusAvailability(state, Date.now());
        if (!availability.canClaim) {
          return {
            granted: false,
            message: availability.message,
          };
        }

        setClaimingSponsoredBonus(true);
        try {
          const result = await showSponsoredBonusAd();
          if (!result.completed) {
            return {
              granted: false,
              message: result.message || 'Rewarded ad was not completed.',
            };
          }

          const claimTime = Date.now();
          const dayKey = getDayKey(claimTime);

          setState((current) => {
            const dayClaimCount =
              current.sponsoredBonus.claimDayKey === dayKey ? current.sponsoredBonus.claimCount : 0;

            return {
              ...current,
              adsSeen: current.adsSeen + 1,
              coins: current.coins + SPONSORED_BONUS_COINS,
              sponsoredBonus: {
                claimCount: dayClaimCount + 1,
                claimDayKey: dayKey,
                lastClaimAt: claimTime,
              },
            };
          });

          return {
            granted: true,
            message: `+${SPONSORED_BONUS_COINS} coins added to your wallet.`,
          };
        } catch (error) {
          return {
            granted: false,
            message: error instanceof Error ? error.message : 'Rewarded ad failed to load.',
          };
        } finally {
          setClaimingSponsoredBonus(false);
        }
      },
      claimingSponsoredBonus,
      consumeBooster: (key) => {
        let consumed = false;

        setState((current) => {
          if (IS_ADMIN_BUILD) {
            consumed = true;
            return current;
          }

          if (current.boosters[key] < 1) {
            return current;
          }

          consumed = true;
          return {
            ...current,
            boosters: {
              ...current.boosters,
              [key]: current.boosters[key] - 1,
            },
          };
        });

        return consumed;
      },
      isAdminBuild: IS_ADMIN_BUILD,
      loading,
      monetizationEnabled: MONETIZATION_ENABLED,
      recordSession: (slug, score) => {
        setState((current) => {
          const earned = Math.max(8, Math.floor(score / 10) + 10);

          return {
            ...current,
            coins: current.coins + earned,
            lastPlayed: slug,
            sessionsPlayed: current.sessionsPlayed + 1,
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
      sponsoredBonus,
      state,
    }),
    [claimingSponsoredBonus, loading, sponsoredBonus, state]
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
