import { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Badge({className,...p}:HTMLAttributes<HTMLSpanElement>){return <span className={cn("inline-flex items-center rounded-full border border-zinc-900/10 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700",className)} {...p}/>;};
