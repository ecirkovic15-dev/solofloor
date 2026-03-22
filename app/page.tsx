export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-background)", color: "var(--color-text)" }}>

      {/* ── NAV ────────────────────────────────────────────────────────
          Dark glass: backdrop-blur on near-black bg mirrors Sonder's
          sticky dark nav. Border separates without heavy contrast. */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          background: "color-mix(in srgb, var(--color-background) 85%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Bebas Neue wordmark with teal dot — Sonder-style condensed brand mark */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--color-teal)" }} />
            <span className="font-display text-xl tracking-wide" style={{ color: "var(--color-text)" }}>
              SoloFloor
            </span>
          </div>

          {/* Nav CTA — btn-teal-sm handles hover via pure CSS */}
          <a
            href="#get"
            className="group btn-teal-sm flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Get the System
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────
          Sonder pattern: radial glow at focal point, massive Bebas Neue
          headline, muted subtext, gradient CTA button. Grid texture adds
          depth to the dark field without imagery. */}
      <section className="relative overflow-hidden">
        {/* Radial teal glow — replaces Sonder's warm gold glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, var(--color-teal-glow) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Fine grid texture — Sonder uses subtle dark grain/texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
          {/* Targeting badge — teal pill with ping dot, Sonder uses accent labels */}
          <div
            className="inline-flex items-center gap-2.5 text-xs font-semibold px-4 py-2 rounded-full mb-10 tracking-widest uppercase border"
            style={{
              background: "var(--color-teal-muted)",
              borderColor: "var(--color-teal)",
              color: "var(--color-teal)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "var(--color-teal)" }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-teal)" }} />
            </span>
            For freelancers &amp; solopreneurs
          </div>

          {/* Bebas Neue headline — 9xl on desktop, mirrors Sonder's max-scale display type */}
          <h1 className="font-display leading-none tracking-wide mb-6 text-7xl sm:text-8xl lg:text-[9rem]">
            <span style={{ color: "var(--color-text)" }}>Stop living</span>
            <br />
            <span style={{ color: "var(--color-teal)" }}>invoice to</span>
            <br />
            <span style={{ color: "var(--color-teal)" }}>invoice.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Built for freelancers with variable income — not salaried employees.
            A 5-account system, three formulas, and a 20-minute monthly ritual
            you can implement this weekend using a free spreadsheet and two bank accounts.
          </p>

          {/* Primary CTA — gradient button + trust micro-copy */}
          <div className="flex flex-col sm:flex-row gap-5 items-start mb-20">
            <a
              id="get"
              href="https://gumroad.com"
              className="group btn-teal flex items-center gap-3 font-bold text-lg px-10 py-4 rounded-xl"
              style={{ boxShadow: "0 8px 32px var(--color-teal-glow)" }}
            >
              Start This Weekend — $27
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <div className="flex flex-col gap-1 justify-center">
              {["One-time payment · No subscription", "Instant PDF download"].map((t) => (
                <p key={t} className="text-sm flex items-center gap-1.5" style={{ color: "var(--color-muted)" }}>
                  <span style={{ color: "var(--color-teal)" }}>✓</span> {t}
                </p>
              ))}
            </div>
          </div>

          {/* Stats — Bebas Neue numbers as authority anchors, Sonder style */}
          <div className="grid grid-cols-3 border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
            {[
              ["89%", "of solopreneurs cite finance as their #1 pain point"],
              ["48%", "have gone a full month without paying themselves"],
              ["1 weekend", "to set up the full system — free tools, no app required"],
            ].map(([stat, label], i) => (
              <div
                key={stat}
                className={`${i === 0 ? "pr-8" : i === 2 ? "pl-8 border-l" : "px-8 border-l"}`}
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="font-display text-4xl sm:text-5xl leading-none mb-1.5" style={{ color: "var(--color-teal)" }}>
                  {stat}
                </p>
                <p className="text-sm leading-snug" style={{ color: "var(--color-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────
          Dark surface cards with card-hover CSS class for teal border +
          glow on hover. Sonder's program cards follow this pattern. */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-teal)" }}>
            Who It&apos;s For
          </p>
          <h2 className="font-display text-5xl sm:text-6xl leading-none mb-12" style={{ color: "var(--color-text)" }}>
            Built for you if...
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Your income varies significantly month to month",
              "You've had at least one month where you couldn't pay yourself",
              "You want a system — not an app subscription",
              "You're a freelancer, consultant, coach, or solo service provider",
            ].map((item) => (
              <div
                key={item}
                className="group card-hover flex items-start gap-4 p-5 rounded-xl border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold"
                  style={{ background: "var(--color-teal-muted)", color: "var(--color-teal)" }}
                >
                  ✓
                </span>
                {/* card-text class brightens on parent card-hover:hover via CSS */}
                <p className="card-text leading-snug transition-colors duration-200" style={{ color: "var(--color-muted)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────
          Surface-2 bg creates a visual break. Sonder alternates between
          bg-background and bg-card to create section rhythm.
          Oversized quote mark is an editorial flourish from their style. */}
      <section className="py-24 relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
        <div
          className="absolute -top-32 -right-32 w-96 h-96 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, var(--color-teal-glow), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "var(--color-teal)" }}>
            The Problem
          </p>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none mb-10 max-w-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Financial tools were built for people with a fixed paycheck.
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mb-12" style={{ color: "var(--color-muted)" }}>
            YNAB. Mint. QuickBooks. Every piece of conventional financial advice assumes you get
            paid the same amount on the same date every two weeks. Your income looks like
            $11,000 one month and $3,200 the next. The existing system has no idea what to
            do with that — so it just stresses you out instead.
          </p>

          {/* Oversized quote mark + blockquote — editorial drama from Sonder's style */}
          <div className="relative pl-8 border-l-4 mb-10" style={{ borderColor: "var(--color-teal)" }}>
            <span
              className="absolute -top-6 -left-3 text-9xl leading-none select-none font-serif"
              style={{ color: "var(--color-teal)", opacity: 0.2 }}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="text-2xl sm:text-3xl font-medium italic leading-snug" style={{ color: "var(--color-text)" }}>
              This isn&rsquo;t a discipline problem.<br />
              It&rsquo;s an infrastructure problem.
            </blockquote>
          </div>

          <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--color-muted)" }}>
            Every existing solution is either a $30/month SaaS subscription built for businesses,
            or generic advice written for people with a salary. This is neither.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────
          Five system cards with Bebas Neue card titles, number badges,
          and card-hover CSS for teal border + glow on hover.
          Sonder's program listing follows this exact card pattern. */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-teal)" }}>
            What&apos;s Inside
          </p>
          <h2 className="font-display text-5xl sm:text-6xl leading-none mb-2" style={{ color: "var(--color-text)" }}>
            Five systems.
          </h2>
          <p className="font-display text-3xl sm:text-4xl leading-none mb-14" style={{ color: "var(--color-muted)" }}>
            One weekend to set up. 20 minutes a month to run.
          </p>

          <div className="space-y-3">
            {[
              {
                num: "01",
                title: "The 5-Account System",
                desc: "Separate your money into five accounts with five distinct jobs. After one setup session, you'll know exactly what's yours to spend — without mental math, without spreadsheet anxiety, without checking six accounts.",
              },
              {
                num: "02",
                title: "The Tax Vault Formula",
                desc: "A dead-simple percentage rule applied the moment each payment lands. After this, every payment you receive is already split. Tax season stops being a surprise and starts being a line item.",
              },
              {
                num: "03",
                title: "The 90-Day Buffer Target",
                desc: "One number that tells you exactly how much runway you need. Once you hit it, a $3k month doesn't mean a missed rent payment — it means a planned, covered dip. The system absorbs it.",
              },
              {
                num: "04",
                title: "The Retainer Conversion Playbook",
                desc: "The exact script and framework for converting past clients into predictable monthly income. Two converted clients at $2k/month means your base is covered before you send a single proposal. Everything else is upside.",
              },
              {
                num: "05",
                title: "The 20-Minute Monthly Review",
                desc: "Last day of the month: 20 minutes, six steps, done. You'll know your tax position, your buffer status, and your outstanding invoices — all before next month starts. No accountant needed.",
              },
            ].map(({ num, title, desc }) => (
              <div
                key={num}
                className="card-hover flex gap-5 p-6 rounded-xl border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                {/* Teal number badge — Bebas Neue numeral in accent circle */}
                <div
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{ background: "var(--color-teal-muted)", borderColor: "var(--color-border)" }}
                >
                  <span className="font-display text-sm leading-none" style={{ color: "var(--color-teal)" }}>
                    {num}
                  </span>
                </div>
                <div className="min-w-0">
                  {/* Card title in Bebas Neue — Sonder uses display type for program names */}
                  <h3 className="font-display text-2xl leading-none mb-2" style={{ color: "var(--color-text)" }}>
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────
          Surface section break for visual rhythm. Sonder's CTA sections
          are centered, dramatic, single-focus. Teal glow replaces gold. */}
      <section className="relative overflow-hidden py-32" style={{ background: "var(--color-surface)" }}>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, var(--color-teal-glow), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Urgency badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-10 tracking-widest uppercase border"
            style={{ background: "var(--color-teal-muted)", borderColor: "var(--color-teal)", color: "var(--color-teal)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--color-teal)" }} />
            Implement this weekend
          </div>

          {/* Bebas Neue headline — full-width dramatic close */}
          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none mb-6" style={{ color: "var(--color-text)" }}>
            Ready to fix the<br />
            <span style={{ color: "var(--color-teal)" }}>feast &amp; famine</span>
            <br />cycle?
          </h2>

          <p className="text-lg mb-12 max-w-md mx-auto leading-relaxed" style={{ color: "var(--color-muted)" }}>
            One-time PDF download. No subscription. No app.<br />
            Just the system — ready to run this weekend.
          </p>

          <div className="flex flex-col items-center gap-6">
            <a
              href="https://gumroad.com"
              className="group btn-teal inline-flex items-center gap-3 font-bold text-xl px-14 py-5 rounded-2xl"
              style={{ boxShadow: "0 12px 48px var(--color-teal-glow)" }}
            >
              Start This Weekend — $27
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["One-time payment", "Instant download", "No subscription ever"].map((item) => (
                <span key={item} className="text-sm flex items-center gap-1.5" style={{ color: "var(--color-muted)" }}>
                  <span style={{ color: "var(--color-teal)" }}>✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────
          Minimal dark footer — Sonder style: brand mark + one utility line. */}
      <footer className="border-t py-8" style={{ background: "var(--color-background)", borderColor: "var(--color-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--color-teal)" }} />
            <span className="font-display text-lg tracking-wide" style={{ color: "var(--color-text)" }}>
              SoloFloor
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Financial systems for the self-employed · hello@solofloor.io
          </p>
        </div>
      </footer>

    </main>
  );
}
