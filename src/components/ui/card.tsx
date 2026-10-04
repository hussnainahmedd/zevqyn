import { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Card({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-lg border border-white/[0.08] bg-[#0F1511] text-zinc-100",className)} {...p}/>;}
export function CardHeader({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("flex flex-col gap-1 p-5 pb-3",className)} {...p}/>;}
export function CardTitle({className,...p}:HTMLAttributes<HTMLHeadingElement>){return <h3 className={cn("text-base font-semibold tracking-tight",className)} {...p}/>;}
export function CardContent({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("p-5 pt-2",className)} {...p}/>;}
