import { cn } from "@/lib/utils";

// A seal stamp reading 歩 — "ayu(mu)", to walk.
export default function Hanko({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-9 place-items-center rounded-[6px] bg-crimson font-mincho text-[22px] font-bold leading-none text-paper shadow-[inset_0_0_0_2px_var(--crimson),inset_0_0_0_3.5px_var(--paper)] -rotate-3",
        className
      )}
    >
      歩
    </span>
  );
}
