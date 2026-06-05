import { StackSortGame } from './stack-sort-game';

export function ScrewdomGame({ onComplete }: { onComplete: (score: number) => void }) {
  return <StackSortGame variant="screw" onComplete={onComplete} />;
}
