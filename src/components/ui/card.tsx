import { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Card({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-2xl border border-zinc-900/[0.08] bg-white text-zinc-950 shadow-sm",className)} {...p}/>;};
export function CardHeader({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("flex flex-col gap-1 p-5 pb-3",className)} {...p}/>;};
export function CardTitle({className,...p}:HTMLAttributes<HTMLHeadingElement>){return <h3 className={cn("font-display text-base font-semibold tracking-tight text-zinc-950",className)} {...p}/>;};
export function CardContent({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("p-5 pt-2",className)} {...p}/>;};
