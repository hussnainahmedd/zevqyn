import Link from "next/link";
import { Logo } from "./Logo";

export function MktShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mkt min-h-screen bg-[#FBFAF7] font-sans text-zinc-950 antialiased">
      {children}
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/[0.07] bg-[#FBFAF7]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
          <Link href="/features" className="transition hover:text-zinc-950">
            Features
          </Link>
          <Link href="/how-it-works" className="transition hover:text-zinc-950">
            How it works
          </Link>
          <Link href="/resources" className="transition hover:text-zinc-950">
            Resources
          </Link>
          <Link href="/about" className="transition hover:text-zinc-950">
            About
          </Link>
          <Link href="/founder" className="transition hover:text-zinc-950">
            Founder
          </Link>
          <Link href="/contact" className="transition hover:text-zinc-950">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-900/5 hover:text-zinc-950"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] transition hover:bg-zinc-800"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-900/[0.07] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
                Z
              </span>
              <p className="font-display text-lg font-semibold tracking-tight">ZEVQYN</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Research smarter. Build proof. Grow your career. Built for students, developers and early-career
              professionals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:gap-12 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-zinc-950">Product</p>
              <ul className="mt-3 space-y-2.5 text-zinc-500">
                <li>
                  <Link href="/features" className="transition hover:text-zinc-950">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="transition hover:text-zinc-950">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition hover:text-zinc-950">
                    Start building
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Company</p>
              <ul className="mt-3 space-y-2.5 text-zinc-500">
                <li>
                  <Link href="/about" className="transition hover:text-zinc-950">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/founder" className="transition hover:text-zinc-950">
                    Founder
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-zinc-950">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition hover:text-zinc-950">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Resources</p>
              <ul className="mt-3 space-y-2.5 text-zinc-500">
                <li>
                  <Link href="/resources" className="transition hover:text-zinc-950">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="transition hover:text-zinc-950">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-950">Legal</p>
              <ul className="mt-3 space-y-2.5 text-zinc-500">
                <li>
                  <Link href="/privacy-policy" className="transition hover:text-zinc-950">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-zinc-950">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="transition hover:text-zinc-950">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="transition hover:text-zinc-950">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-zinc-900/[0.07] pt-6 text-xs text-zinc-400">
          © {new Date().getFullYear()} ZEVQYN — online software product.
        </p>
      </div>
    </footer>
  );
}
