export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────
          Sticky with backdrop blur so content scrolls beneath it cleanly.
          White/95 opacity preserves legibility without fully hiding content. */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Teal accent dot gives logo mark without an image dependency */}
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            <span className="font-bold text-navy text-lg tracking-tight">SoloFloor</span>
          </div>
          <a
            href="#get"
            className="group bg-teal text-white text-sm font-semibold px-5 py-2.5 rounded-lg
                       hover:bg-teal-dark transition-all duration-200 flex items-center gap-1.5"
          >
            Get the System
            {/* Arrow nudges right on hover via group-hover translate */}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────
          Gradient from a whisper of emerald to white gives depth without
          visual noise. Generous padding creates breathing room at the top. */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 to-white">
        {/* Decorative radial glow behind the headline — purely aesthetic */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                     bg-teal/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
          {/* Targeting badge with animated pulse dot */}
          <div className="inline-flex items-center gap-2.5 bg-white border border-emerald-100
                          text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            For freelancers &amp; solopreneurs
          </div>

          {/* Headline — largest element on the page, max size on desktop */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-navy leading-[1.05] tracking-tight mb-7">
            Stop living<br />
            <span className="text-teal">invoice to invoice.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            Built for freelancers with variable income — not salaried employees.
            A 5-account system, three formulas, and a 20-minute monthly ritual
            you can implement this weekend using a free spreadsheet and two bank accounts.
          </p>

          {/* Primary CTA cluster */}
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-16">
            <a
              id="get"
              href="https://gumroad.com"
              className="group relative bg-teal text-white font-bold text-lg px-9 py-4 rounded-xl
                         hover:bg-teal-dark transition-all duration-200
                         shadow-lg shadow-teal/25 hover:shadow-xl hover:shadow-teal/30
                         hover:-translate-y-0.5 flex items-center gap-2"
            >
              Start This Weekend — $27
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            {/* Trust micro-copy stacked beneath the button on mobile */}
            <div className="flex flex-col justify-center gap-1 sm:mt-0 mt-1">
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <span className="text-teal">✓</span> One-time payment · No subscription
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <span className="text-teal">✓</span> Instant PDF download
              </p>
            </div>
          </div>

          {/* Stats bar — three credibility anchors separated by faint vertical dividers */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-10">
            {[
              ['89%', 'of solopreneurs cite finance as their #1 pain point'],
              ['48%', 'have gone a full month without paying themselves'],
              ['1 weekend', 'to set up the full system — free spreadsheet, no app required'],
            ].map(([stat, label], i) => (
              <div key={stat} className={`${i === 0 ? '' : 'pl-6'} ${i === 2 ? '' : 'pr-6'}`}>
                <p className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">{stat}</p>
                <p className="text-sm text-gray-400 mt-1.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ──────────────────────────────────────────────────
          Moved before Problem so Emma self-identifies before evaluating.
          Cards lift on hover to signal interactivity and add tactile depth. */}
      <section className="bg-gray-50/80 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-teal font-semibold text-xs tracking-[0.15em] uppercase mb-4">
            Who It&apos;s For
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-12 leading-tight">
            Built for you if...
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Your income varies significantly month to month',
              "You've had at least one month where you couldn't pay yourself",
              'You want a system — not an app subscription',
              "You're a freelancer, consultant, coach, or solo service provider",
            ].map((item) => (
              /* Hover: lift + shadow + teal border accent */
              <div
                key={item}
                className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100
                           hover:border-teal/30 hover:shadow-md hover:-translate-y-0.5
                           transition-all duration-200 cursor-default"
              >
                {/* Checkmark badge — filled circle for visual weight */}
                <span className="shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-0.5">
                  <span className="text-teal text-xs font-bold">✓</span>
                </span>
                <p className="text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────────────
          Full-bleed navy creates a dramatic visual break and primes Emma
          for the "this is why existing tools fail you" moment. */}
      <section className="bg-navy relative overflow-hidden py-24">
        {/* Subtle radial light in corner — adds depth to the dark section */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-teal font-semibold text-xs tracking-[0.15em] uppercase mb-6">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight max-w-2xl">
            Financial tools were built for<br />
            people with a fixed paycheck.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-12">
            YNAB. Mint. QuickBooks. Every piece of conventional financial advice assumes you get
            paid the same amount on the same date every two weeks. Your income looks like
            $11,000 one month and $3,200 the next. The existing system has no idea what to
            do with that — so it just stresses you out instead.
          </p>

          {/* Blockquote with oversized decorative quote mark for visual drama */}
          <div className="relative border-l-4 border-teal pl-8 mb-8">
            <span
              className="absolute -top-4 -left-2 text-teal/30 text-8xl font-serif leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="text-white text-xl sm:text-2xl font-medium leading-snug italic">
              This isn&rsquo;t a discipline problem.<br />It&rsquo;s an infrastructure problem.
            </blockquote>
          </div>

          {/* Competitor gap — closes the objection loop */}
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            Every existing solution is either a $30/month SaaS subscription built for businesses,
            or generic advice written for people with a salary. This is neither.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ─────────────────────────────────────────────────
          Number badges as filled teal circles give each card a strong
          visual anchor. Cards lift on hover; a teal left border appears
          to signal the active state and reinforce the brand color. */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-teal font-semibold text-xs tracking-[0.15em] uppercase mb-4">
          What&apos;s Inside
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 leading-tight">
          Five systems. One weekend to set up.
        </h2>
        <p className="text-gray-400 text-lg mb-12">20 minutes a month to run.</p>

        <div className="space-y-3">
          {[
            {
              num: '01',
              title: 'The 5-Account System',
              desc: "Separate your money into five accounts with five distinct jobs. After one setup session, you'll know exactly what's yours to spend — without mental math, without spreadsheet anxiety, without checking six accounts.",
            },
            {
              num: '02',
              title: 'The Tax Vault Formula',
              desc: "A dead-simple percentage rule applied the moment each payment lands. After this, every payment you receive is already split. Tax season stops being a surprise and starts being a line item.",
            },
            {
              num: '03',
              title: 'The 90-Day Buffer Target',
              desc: "One number that tells you exactly how much runway you need. Once you hit it, a $3k month doesn't mean a missed rent payment — it means a planned, covered dip. The system absorbs it.",
            },
            {
              num: '04',
              title: 'The Retainer Conversion Playbook',
              desc: "The exact script and framework for converting past clients into predictable monthly income. Two converted clients at $2k/month means your base is covered before you send a single proposal. Everything else is upside.",
            },
            {
              num: '05',
              title: 'The 20-Minute Monthly Review',
              desc: "Last day of the month: 20 minutes, six steps, done. You'll know your tax position, your buffer status, and your outstanding invoices — all before next month starts. No accountant needed.",
            },
          ].map(({ num, title, desc }) => (
            /* group enables child elements to react to parent hover */
            <div
              key={num}
              className="group flex gap-5 p-6 rounded-xl border border-gray-100 bg-white
                         hover:border-l-4 hover:border-l-teal hover:border-t-gray-100
                         hover:border-r-gray-100 hover:border-b-gray-100
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              {/* Number badge — solid teal circle, shrinks slightly on group hover */}
              <span
                className="shrink-0 w-9 h-9 rounded-full bg-teal/10 group-hover:bg-teal
                           flex items-center justify-center transition-colors duration-200"
              >
                <span
                  className="text-xs font-bold text-teal group-hover:text-white
                             transition-colors duration-200"
                >
                  {num}
                </span>
              </span>
              <div className="min-w-0">
                <h3
                  className="font-bold text-navy text-lg mb-1.5
                             group-hover:text-teal transition-colors duration-200"
                >
                  {title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────
          Full-bleed navy background creates a decisive visual close.
          Button has a teal glow ring to draw the eye and signal action.
          Risk-removal copy ("one-time") is repeated to eliminate hesitation. */}
      <section className="bg-navy relative overflow-hidden">
        {/* Decorative glow behind the CTA button */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48
                     bg-teal/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          {/* Urgency label */}
          <div className="inline-flex items-center gap-2 bg-teal/15 text-teal text-xs font-semibold
                          px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />
            Implement this weekend
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            Ready to fix the feast<br />and famine cycle?
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            One-time PDF download. No subscription. No app.<br />
            Just the system — ready to run this weekend.
          </p>

          {/* CTA button — larger on this section, glow ring on hover */}
          <div className="flex flex-col items-center gap-5">
            <a
              href="https://gumroad.com"
              className="group inline-flex items-center gap-3 bg-teal text-white font-bold
                         text-xl px-12 py-5 rounded-2xl hover:bg-teal-dark
                         transition-all duration-200 shadow-2xl shadow-teal/30
                         hover:shadow-teal/50 hover:-translate-y-1
                         ring-0 hover:ring-4 ring-teal/30"
            >
              Start This Weekend — $27
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            {/* Trust cluster beneath the button */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                'One-time payment',
                'Instant download',
                'No subscription ever',
              ].map((item) => (
                <span key={item} className="text-gray-400 text-sm flex items-center gap-1.5">
                  <span className="text-teal text-xs">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="bg-navy border-t border-white/5 py-8">
        <div
          className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row
                     items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            <span className="font-bold text-white text-sm">SoloFloor</span>
          </div>
          <p className="text-gray-500 text-sm">
            Financial systems for the self-employed · hello@solofloor.io
          </p>
        </div>
      </footer>

    </main>
  );
}
