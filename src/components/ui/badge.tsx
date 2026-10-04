import { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Badge({className,...p}:HTMLAttributes<HTMLSpanElement>){return <span className={cn("inline-flex items-center rounded-full border border-white/10 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300",className)} {...p}/>;}
