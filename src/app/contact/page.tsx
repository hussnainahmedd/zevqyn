"use client";
import { useState } from "react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/services";
import { Mail, MessageSquareHeart, Bug, Handshake, Send, CheckCircle2 } from "lucide-react";

const lightInput =
  "border-zinc-900/15 bg-white text-zinc-950 placeholder:text-zinc-400 focus-visible:ring-indigo-500 shadow-sm";
const lightLabel = "text-zinc-700";

const CHANNELS = [
  { icon: MessageSquareHeart, t: "Support", d: "Stuck on a workspace or upload? Tell us what's happening." },
  { icon: Bug, t: "Bug reports", d: "Found something broken? Tell us exactly what happened." },
  { icon: Handshake, t: "Partnerships", d: "Universities, clubs and communities — let's talk." },
];

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "Support", message: "" });
  const [st, setSt] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !f.email || !f.message) {
      setSt("err");
      setMsg("Please fill name, email and message.");
      return;
    }
    if (f.message.length > 1500) {
      setSt("err");
      setMsg("Message too long (max 1500 characters).");
      return;
    }
    setSt("loading");
    try {
      await api.contact({ name: f.name, email: f.email, subject: f.subject, message: f.message });
      setSt("ok");
      setMsg("Message sent — thanks for reaching out.");
      setF({ name: "", email: "", subject: "Support", message: "" });
    } catch (err) {
      setSt("err");
      setMsg(err instanceof Error ? err.message : "Failed to send. Try again.");
    }
  }

  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[420px] [mask-image:radial-gradient(70%_60%_at_50%_10%,black,transparent)]" />
            <div className="animate-mkt-drift absolute -top-24 right-1/3 h-[320px] w-[480px] rounded-full bg-indigo-200/50 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:pt-24">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">Contact</p>
                <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                  Talk to us.
                </h1>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-600">
                  Support, feedback, partnership or a bug — send it through the form and it lands
                  straight in the team inbox.
                </p>
                <div className="mt-8 space-y-4">
                  {CHANNELS.map((c) => (
                    <div
                      key={c.t}
                      className="flex items-start gap-4 rounded-2xl border border-zinc-900/[0.08] bg-white/80 p-4 backdrop-blur"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{c.t}</p>
                        <p className="mt-0.5 text-sm text-zinc-600">{c.d}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 rounded-2xl bg-zinc-950 p-4 text-white">
                    <Mail className="h-5 w-5 text-indigo-300" />
                    <p className="text-sm text-zinc-300">
                      No account needed — the form below sends your message directly to the team.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140} className="perspective-1400">
                <Tilt max={5}>
                  <form
                    onSubmit={onSubmit}
                    className="preserve-3d rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_48px_96px_-32px_rgba(15,18,45,0.35)] sm:p-9"
                    style={{ transform: "rotateX(4deg)" }}
                  >
                    <h2 className="font-display text-xl font-semibold tracking-tight">Send a message</h2>
                    <p className="mt-1 text-sm text-zinc-500">Tell us what's on your mind.</p>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={lightLabel}>
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={f.name}
                          onChange={(e) => setF({ ...f, name: e.target.value })}
                          required
                          placeholder="Your name"
                          className={lightInput}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className={lightLabel}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={f.email}
                          onChange={(e) => setF({ ...f, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          className={lightInput}
                        />
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <Label htmlFor="subject" className={lightLabel}>
                        Subject
                      </Label>
                      <select
                        id="subject"
                        value={f.subject}
                        onChange={(e) => setF({ ...f, subject: e.target.value })}
                        className="flex h-10 w-full rounded-lg border border-zinc-900/15 bg-white px-3 text-sm text-zinc-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Support</option>
                        <option>Feedback</option>
                        <option>Partnership</option>
                        <option>Bug</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="mt-5 space-y-2">
                      <Label htmlFor="message" className={lightLabel}>
                        Message ({f.message.length}/1500)
                      </Label>
                      <Textarea
                        id="message"
                        rows={6}
                        maxLength={1500}
                        value={f.message}
                        onChange={(e) => setF({ ...f, message: e.target.value })}
                        required
                        placeholder="How can we help?"
                        className={lightInput}
                      />
                    </div>
                    {msg && (
                      <p
                        role="status"
                        className={`mt-4 flex items-center gap-2 text-sm font-medium ${
                          st === "ok" ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {st === "ok" && <CheckCircle2 className="h-4 w-4" />}
                        {msg}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={st === "loading"}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto sm:px-10"
                    >
                      <Send className="h-4 w-4" />
                      {st === "loading" ? "Sending…" : "Send message"}
                    </button>
                  </form>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
