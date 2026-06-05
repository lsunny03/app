import { StackSortGame } from './stack-sort-game';

export function CakeSortGame({ onComplete }: { onComplete: (score: number) => void }) {
  return <StackSortGame variant="cake" onComplete={onComplete} />;
}
