export const GAME_LIBRARY = [
  {
    slug: 'snake',
    title: 'Snake Sprint',
    emoji: '🐍',
    accent: '#a6ce9b',
    description: 'Arcade snake with fast directional controls and escalating coin payout.',
    monetizationHook: 'Rewarded break',
  },
  {
    slug: 'fruit-merge',
    title: 'Fruit Merge',
    emoji: '🍓',
    accent: '#efb1c0',
    description: '2048-style merging with fruit tiers, combo scoring, and quick replay loops.',
    monetizationHook: 'Premium boost',
  },
  {
    slug: 'cake-sort',
    title: 'Cake Sort',
    emoji: '🍰',
    accent: '#efcf92',
    description: 'Layer sorting puzzle with clean taps, replayable shuffles, and move efficiency.',
    monetizationHook: 'Undo booster',
  },
  {
    slug: 'screwdom',
    title: 'Screwdom Lite',
    emoji: '🔩',
    accent: '#c6b5df',
    description: 'Compact screw-sorting prototype with denser bins and trickier color routing.',
    monetizationHook: 'Shuffle booster',
  },
] as const;

export type GameSlug = (typeof GAME_LIBRARY)[number]['slug'];

export const GAME_LIBRARY_MAP = Object.fromEntries(
  GAME_LIBRARY.map((game) => [game.slug, game])
) as Record<GameSlug, (typeof GAME_LIBRARY)[number]>;

export function isGameSlug(value: string): value is GameSlug {
  return GAME_LIBRARY.some((game) => game.slug === value);
}
