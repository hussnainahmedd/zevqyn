import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">{children}</p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const a = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <Reveal className={`flex max-w-2xl flex-col ${a}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">{sub}</p>}
    </Reveal>
  );
}

export function CTABand({
  title,
  sub,
  cta,
  href,
}: {
  title: string;
  sub: string;
  cta: string;
  href: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 300px at 20% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(500px 280px at 85% 100%, rgba(52,211,153,0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">{sub}</p>
            <Link
              href={href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
