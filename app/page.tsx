export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-navy text-lg tracking-tight">SoloFloor</span>
          <a
            href="#get"
            className="bg-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-dark transition-colors"
          >
            Get the Guide →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
          For freelancers &amp; solopreneurs
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-navy leading-tight mb-6">
          Stop living<br />
          <span className="text-teal">invoice to invoice.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          The Feast &amp; Famine Fix is a step-by-step financial operating system
          built for freelancers with variable income. Set it up once. Run it
          in 20 minutes a month.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start mb-12">
          <a
            id="get"
            href="https://gumroad.com"
            className="bg-teal text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-teal-dark transition-colors"
          >
            Get the Guide — $27
          </a>
          <p className="text-sm text-gray-400 mt-3 sm:mt-5">
            One-time payment · Instant download · PDF
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-10">
          {[
            ['89%', 'of solopreneurs cite finance as their #1 pain point'],
            ['48%', 'have gone a full month without paying themselves'],
            ['9 pages', 'of actionable systems — no fluff, no app required'],
          ].map(([stat, label]) => (
            <div key={stat}>
              <p className="text-3xl font-bold text-navy">{stat}</p>
              <p className="text-sm text-gray-400 mt-1 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-teal font-semibold text-sm tracking-widest mb-6">THE PROBLEM</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Financial tools were built for<br />
            people with a fixed paycheck.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-10">
            YNAB. Mint. QuickBooks. Every piece of conventional financial advice assumes you get
            paid the same amount on the same date every two weeks. Your income looks like
            $11,000 one month and $3,200 the next. The existing system has no idea what to
            do with that — so it just stresses you out instead.
          </p>
          <blockquote className="border-l-4 border-teal pl-6 text-gray-200 text-lg italic">
            &ldquo;This isn&rsquo;t a discipline problem. It&rsquo;s an infrastructure problem.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-teal font-semibold text-sm tracking-widest mb-4">WHAT&apos;S INSIDE</p>
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12">
          Five systems. One weekend to set up.<br />20 minutes a month to run.
        </h2>

        <div className="space-y-4">
          {[
            {
              num: '01',
              title: 'The 5-Account System',
              desc: 'Separate your money into five accounts with five distinct jobs. Stop confusing income with profit — and stop wondering if you can actually afford something.',
            },
            {
              num: '02',
              title: 'The Tax Vault Formula',
              desc: "A dead-simple percentage rule that means you never owe the IRS money you've already spent. Set it once, automate it, forget about tax panic forever.",
            },
            {
              num: '03',
              title: 'The 90-Day Buffer Target',
              desc: 'One number that tells you exactly how much runway you need. Once funded, a slow month becomes a minor inconvenience instead of a crisis.',
            },
            {
              num: '04',
              title: 'The Retainer Conversion Playbook',
              desc: 'The exact script and framework for converting past clients into predictable monthly income. Two retainer clients eliminates most income volatility.',
            },
            {
              num: '05',
              title: 'The 20-Minute Monthly Review',
              desc: 'A six-step monthly ritual that keeps the whole system running. No accountant needed. No software required. Just 20 minutes on the last day of the month.',
            },
          ].map(({ num, title, desc }) => (
            <div
              key={num}
              className="flex gap-6 p-6 rounded-xl border border-gray-100 hover:border-teal/30 hover:bg-emerald-50/30 transition-colors"
            >
              <span className="text-2xl font-bold text-teal/40 shrink-0 w-8">{num}</span>
              <div>
                <h3 className="font-bold text-navy text-lg mb-1">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-teal font-semibold text-sm tracking-widest mb-4">WHO IT&apos;S FOR</p>
          <h2 className="text-3xl font-bold text-navy mb-10">Built for you if...</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Your income varies significantly month to month',
              "You've had at least one month where you couldn't pay yourself",
              'You know you should be better with money but no guide fits your life',
              'You\'re tired of generic budgeting advice written for employees',
              'You want a system — not an app subscription',
              'You\'re a freelancer, consultant, coach, or solo service provider',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <span className="text-teal font-bold mt-0.5">✓</span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
          Ready to fix the feast<br />and famine cycle?
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
          One-time PDF download. No subscription. No app. Just the system — ready to implement this weekend.
        </p>
        <a
          href="https://gumroad.com"
          className="inline-block bg-teal text-white font-bold text-xl px-10 py-5 rounded-xl hover:bg-teal-dark transition-colors mb-4"
        >
          Get the Guide — $27
        </a>
        <p className="text-gray-400 text-sm">Instant download after purchase</p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-navy">SoloFloor</span>
          <p className="text-gray-400 text-sm">
            Financial systems for the self-employed · hello@solofloor.io
          </p>
        </div>
      </footer>
    </main>
  );
}
