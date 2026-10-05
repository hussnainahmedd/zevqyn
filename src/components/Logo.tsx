import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Zevqyn logo"
      width={32}
      height={32}
      className={cn("h-8 w-8", className)}
      priority
    />
  );
}

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("font-display text-lg font-semibold tracking-tight text-zinc-950", textClassName)}>
        ZEVQYN
      </span>
    </span>
  );
}
