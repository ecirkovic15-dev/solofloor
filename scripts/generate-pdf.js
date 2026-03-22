const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../public/pdf/feast-and-famine-fix.pdf');

const COLORS = {
  navy: '#1B2E4B',
  teal: '#2A7F62',
  lightGray: '#F5F6F8',
  midGray: '#6B7280',
  white: '#FFFFFF',
  accent: '#E8F4F0',
  border: '#D1D5DB',
};

function generate() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 64, right: 64 },
    info: {
      Title: 'The Feast & Famine Fix — A Freelancer\'s Financial Operating System',
      Author: 'SoloFloor',
      Subject: 'Freelancer Financial System',
    },
  });

  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  const pageWidth = doc.page.width - 128; // account for margins

  // ─── COVER PAGE ───────────────────────────────────────────────────
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.navy);

  doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(COLORS.teal);

  doc
    .fill(COLORS.white)
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('SOLOFLOOR', 64, 60, { characterSpacing: 3 });

  doc
    .fill(COLORS.teal)
    .font('Helvetica')
    .fontSize(11)
    .text('solofloor.io', 64, 78);

  doc
    .fill(COLORS.white)
    .font('Helvetica-Bold')
    .fontSize(38)
    .text('The Feast &\nFamine Fix', 64, 180, { lineGap: 6 });

  doc
    .fill(COLORS.teal)
    .font('Helvetica')
    .fontSize(16)
    .text("A Freelancer's Financial Operating System", 64, 290);

  doc
    .fill(COLORS.white)
    .opacity(0.6)
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Stop living invoice-to-invoice. Build the financial\ninfrastructure your business actually needs.',
      64,
      330,
      { lineGap: 4 }
    );

  doc.opacity(1);

  // What's inside box
  doc.rect(64, 460, pageWidth, 180).fill('#243B55');

  doc
    .fill(COLORS.teal)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('WHAT\'S INSIDE', 88, 480, { characterSpacing: 2 });

  const insideItems = [
    'The 5-Account System — stop confusing income with profit',
    'The Tax Vault Formula — never owe the IRS money you\'ve spent',
    'Your 90-Day Buffer Target — the number that kills money panic',
    'The Retainer Conversion Playbook — build predictable monthly income',
    'The 20-Minute Monthly Review — the only financial ritual you need',
  ];

  insideItems.forEach((item, i) => {
    doc
      .fill(COLORS.teal)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('→', 88, 502 + i * 26);
    doc
      .fill(COLORS.white)
      .font('Helvetica')
      .fontSize(11)
      .text(item, 108, 502 + i * 26);
  });

  doc
    .fill(COLORS.white)
    .opacity(0.4)
    .font('Helvetica')
    .fontSize(10)
    .text('© 2026 SoloFloor · solofloor.io · All rights reserved', 64, 720, {
      align: 'center',
      width: pageWidth,
    });

  doc.opacity(1);

  // ─── HELPER FUNCTIONS ─────────────────────────────────────────────
  function addPage() {
    doc.addPage();
  }

  function pageHeader(label) {
    doc
      .fill(COLORS.teal)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('SOLOFLOOR · THE FEAST & FAMINE FIX', 64, 40, { characterSpacing: 1.5 });
    doc
      .fill(COLORS.border)
      .moveTo(64, 54)
      .lineTo(64 + pageWidth, 54)
      .lineWidth(0.5)
      .stroke();
  }

  function sectionTag(text, y) {
    doc.rect(64, y, doc.widthOfString(text) + 16, 20).fill(COLORS.accent);
    doc
      .fill(COLORS.teal)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(text, 72, y + 5, { characterSpacing: 1.5 });
    return y + 28;
  }

  function h1(text, y) {
    doc
      .fill(COLORS.navy)
      .font('Helvetica-Bold')
      .fontSize(26)
      .text(text, 64, y, { width: pageWidth, lineGap: 4 });
    return doc.y + 12;
  }

  function h2(text, y) {
    doc
      .fill(COLORS.navy)
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(text, 64, y, { width: pageWidth });
    return doc.y + 8;
  }

  function body(text, y, opts = {}) {
    doc
      .fill(COLORS.midGray)
      .font('Helvetica')
      .fontSize(11)
      .text(text, 64, y, { width: pageWidth, lineGap: 3, ...opts });
    return doc.y + 10;
  }

  function callout(text, y) {
    const boxH = doc.heightOfString(text, { width: pageWidth - 32 }) + 24;
    doc.rect(64, y, pageWidth, boxH).fill(COLORS.lightGray);
    doc.rect(64, y, 4, boxH).fill(COLORS.teal);
    doc
      .fill(COLORS.navy)
      .font('Helvetica')
      .fontSize(11)
      .text(text, 88, y + 12, { width: pageWidth - 32, lineGap: 3 });
    return y + boxH + 14;
  }

  function bullet(items, y) {
    items.forEach((item) => {
      doc
        .fill(COLORS.teal)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('→', 64, y);
      doc
        .fill(COLORS.midGray)
        .font('Helvetica')
        .fontSize(11)
        .text(item, 84, y, { width: pageWidth - 20, lineGap: 3 });
      y = doc.y + 6;
    });
    return y;
  }

  function divider(y) {
    doc
      .fill(COLORS.border)
      .moveTo(64, y)
      .lineTo(64 + pageWidth, y)
      .lineWidth(0.5)
      .stroke();
    return y + 16;
  }

  function footer(pageNum) {
    doc
      .fill(COLORS.border)
      .font('Helvetica')
      .fontSize(9)
      .text(`${pageNum}`, 64, 800, { align: 'center', width: pageWidth });
  }

  // ─── PAGE 2: THE PROBLEM ──────────────────────────────────────────
  addPage();
  pageHeader();
  let y = 70;

  y = sectionTag('THE PROBLEM', y);
  y = h1('Why Freelancer Finances\nFeel Impossible', y);
  y = body(
    'You didn\'t become a freelancer to think about money all day. But right now, money is probably thinking about you.',
    y
  );
  y = body(
    'Here\'s the pattern almost every freelancer knows: A great month comes in. You exhale. Then a slow month hits and you\'re doing math at midnight, calculating whether you can cover rent. Repeat.',
    y
  );
  y = callout(
    '"This isn\'t a discipline problem. It\'s an infrastructure problem. The financial tools most people use were built for people with the same paycheck on the same date every two weeks. That is not your life."',
    y
  );
  y = body(
    'Your income looks like: $11,000 in March, $3,200 in April, $8,700 in May. The existing system has no idea what to do with that. So it stresses you out instead.',
    y
  );
  y = divider(y);
  y = h2('The research is clear:', y);
  y = bullet(
    [
      '89% of solopreneurs cite financial management as a major pain point',
      '48% have gone at least one month without paying themselves',
      'Only 23% use any form of invoicing system',
      'Most are operating completely financially blind',
    ],
    y
  );
  y = body(
    'This guide gives you the system designed specifically for variable income — one that creates financial stability from the variability, not despite it.',
    y + 6
  );
  footer(2);

  // ─── PAGE 3: THE 5-ACCOUNT SYSTEM ────────────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 1', y);
  y = h1('The 5-Account System', y);
  y = body(
    'Most freelancers run everything through one or two accounts. When income, taxes, operating expenses, and personal pay all live in the same pool, you have no idea what\'s actually yours.',
    y
  );

  const accounts = [
    ['01  Landing Pad', 'Business Checking', 'Every client payment lands here first. This account receives all income. You do not pay yourself from here. Think of it as a holding zone.'],
    ['02  Tax Vault', 'High-Yield Savings', 'The most important account you\'ll open. Every time money hits your Landing Pad, a fixed percentage moves here immediately — before anything else.'],
    ['03  Business Operating', 'Business Checking', 'Pays for software, contractors, equipment, and business expenses. Fund this monthly from your Landing Pad based on average costs.'],
    ['04  The Buffer', 'Personal Savings', 'Your 90-day runway. Built gradually, maintained always. This is what keeps a slow month from becoming a crisis.'],
    ['05  Your Pay', 'Personal Checking', 'Your fixed monthly "salary." One transfer in, on one date, every month. This is the account you live from.'],
  ];

  accounts.forEach(([num, type, desc]) => {
    if (y > 680) { addPage(); pageHeader(); y = 70; }
    doc.rect(64, y, pageWidth, 72).fill(COLORS.lightGray);
    doc.rect(64, y, 4, 72).fill(COLORS.teal);
    doc.fill(COLORS.navy).font('Helvetica-Bold').fontSize(11).text(num, 80, y + 10);
    doc.fill(COLORS.teal).font('Helvetica').fontSize(9).text(type.toUpperCase(), 80, y + 26, { characterSpacing: 1 });
    doc.fill(COLORS.midGray).font('Helvetica').fontSize(10).text(desc, 80, y + 40, { width: pageWidth - 30, lineGap: 2 });
    y += 80;
  });

  footer(3);

  // ─── PAGE 4: THE THREE FORMULAS ───────────────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 2', y);
  y = h1('The Three Core Formulas', y);

  // Formula 1
  y = h2('Formula 1 — Your Base Monthly Pay (BMP)', y);
  y = body('This is the fixed salary you pay yourself every month, regardless of what came in.', y);
  doc.rect(64, y, pageWidth, 90).fill(COLORS.navy);
  doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(9).text('CALCULATION', 80, y + 12, { characterSpacing: 1.5 });
  doc.fill(COLORS.white).font('Helvetica').fontSize(10).text(
    'Step 1: Add up your last 12 months of personal expenses\nStep 2: Divide by 12\nStep 3: Add 10% as a comfort buffer\n= Your Base Monthly Pay',
    80, y + 28, { lineGap: 4 }
  );
  y += 104;
  y = callout('Example: $52,000 annual expenses ÷ 12 = $4,333 + 10% = $4,767/month. Pay yourself this every single month — no exceptions.', y);

  y = divider(y);

  // Formula 2
  y = h2('Formula 2 — Your Tax Vault Percentage (TVP)', y);
  y = body('Freelancers pay self-employment tax (15.3%) plus income tax. Getting this wrong is how people end up owing the IRS money they\'ve already spent.', y);

  const taxRows = [
    ['Under $50,000/yr', '25%'],
    ['$50,000 – $100,000/yr', '30%'],
    ['Over $100,000/yr', '33%'],
    ['Unsure?', 'Use 30% and adjust after your first filing'],
  ];

  doc.rect(64, y, pageWidth, 24).fill(COLORS.navy);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(10).text('Annual Net Income', 80, y + 7);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(10).text('Set Aside', 300, y + 7);
  y += 24;

  taxRows.forEach(([inc, pct], i) => {
    doc.rect(64, y, pageWidth, 22).fill(i % 2 === 0 ? COLORS.lightGray : COLORS.white);
    doc.fill(COLORS.navy).font('Helvetica').fontSize(10).text(inc, 80, y + 6);
    doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(10).text(pct, 300, y + 6);
    y += 22;
  });

  y += 12;
  y = body('The habit: every time a payment clears, move your TVP to the Tax Vault before you do anything else. Automate this if your bank allows it.', y);
  footer(4);

  // ─── PAGE 5: BUFFER + INCOME SMOOTHING ───────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 2 CONTINUED', y);
  y = h2('Formula 3 — Your 90-Day Buffer Target (BBT)', y);
  doc.rect(64, y, pageWidth, 50).fill(COLORS.navy);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(18)
    .text('Base Monthly Pay × 3 = Buffer Target', 64, y + 15, { align: 'center', width: pageWidth });
  y += 64;
  y = callout('Example: $4,767 × 3 = $14,301 target. You don\'t need to hit this overnight. Set a monthly contribution from surplus. Once funded, it covers low months and refills from high months.', y);

  y = divider(y);
  y = sectionTag('PART 3', y);
  y = h1('The Income\nSmoothing Method', y);
  y = body('Once your 5-account system is running, execute this sequence within 48 hours of every client payment clearing:', y);

  const steps = [
    ['Step 1', 'Tax Vault transfer', 'Move your TVP percentage immediately — before anything else.'],
    ['Step 2', 'Operating Account top-up', 'If below your monthly operating budget, top it up.'],
    ['Step 3', 'Buffer contribution', 'Contribute $200–$500 if Buffer is below target.'],
    ['Step 4', 'Remainder holds', 'Leave the rest in the Landing Pad. It builds toward your Pay Day transfer.'],
  ];

  steps.forEach(([num, title, desc]) => {
    if (y > 700) { addPage(); pageHeader(); y = 70; }
    doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(11).text(num, 64, y);
    doc.fill(COLORS.navy).font('Helvetica-Bold').fontSize(11).text(title, 110, y);
    doc.fill(COLORS.midGray).font('Helvetica').fontSize(10).text(desc, 110, y + 15, { width: pageWidth - 46 });
    y = doc.y + 14;
  });

  y = callout('Monthly Pay Day: Pick one date (1st or 15th). Transfer your BMP to your personal account. If the Landing Pad is short, draw from the Buffer. This creates a paycheck experience regardless of when clients pay.', y);
  footer(5);

  // ─── PAGE 6: RETAINER PLAYBOOK ────────────────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 4', y);
  y = h1('The Retainer\nConversion Playbook', y);
  y = body('The fastest way to stabilize freelance income isn\'t better budgeting — it\'s changing your revenue structure. One retainer at $2,000–$3,000/month transforms your financial picture more than any savings habit.', y);

  y = h2('How to identify retainer candidates:', y);
  y = bullet([
    'Clients who have hired you 2+ times for similar work',
    'Clients who frequently ask follow-up questions after projects close',
    'Clients whose business has ongoing needs (content, strategy, maintenance)',
  ], y);

  y = divider(y + 4);
  y = h2('The Conversation Framework', y);
  y = callout(
    '"Based on this project, I can see a few ways to continue building on what we got. I offer a small number of clients a monthly engagement where I [specific service] for a fixed fee. It\'s limited availability, but I wanted to offer it to you first. Would it be worth 15 minutes to explore what that could look like?"',
    y
  );

  y = h2('Retainer Pricing Formula', y);
  doc.rect(64, y, pageWidth, 56).fill(COLORS.navy);
  doc.fill(COLORS.white).font('Helvetica').fontSize(11).text(
    'Estimated monthly hours × hourly rate × 0.85\n(The 0.85 gives the client a loyalty discount and increases their likelihood of saying yes)',
    80, y + 10, { width: pageWidth - 32, lineGap: 4 }
  );
  y += 70;

  y = body('Target: convert at least 1 client per quarter to a retainer. At $1,500–$3,000/month each, two retainer clients eliminate most income volatility.', y);
  footer(6);

  // ─── PAGE 7: MONTHLY REVIEW ───────────────────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 5', y);
  y = h1('The 20-Minute\nMonthly Review', y);
  y = body('Sustainability requires a regular pulse check. Run this on the last day of each month. Total time: 20 minutes.', y);

  const reviewSteps = [
    ['2 min', 'Landing Pad balance', 'Record the current balance. Higher or lower than last month at this time?'],
    ['2 min', 'Tax Vault check', 'Calculate what should be there (income × TVP). If you\'re under, top it up now.'],
    ['2 min', 'Buffer status', 'Current balance vs. your BBT. Did you draw from it? Plan to replenish next month.'],
    ['5 min', 'Business operating expenses', 'Any subscriptions unused? Any surprise charges? Action anything overdue.'],
    ['5 min', 'Pipeline review', 'What invoices are outstanding? Send a follow-up to anything 7+ days past due — today.'],
    ['4 min', 'Income trend', 'Compare this month to last month and same month last year. Note the pattern.'],
  ];

  reviewSteps.forEach(([time, title, desc]) => {
    if (y > 700) { addPage(); pageHeader(); y = 70; }
    doc.rect(64, y, 52, 48).fill(COLORS.teal);
    doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(13).text(time, 64, y + 15, { width: 52, align: 'center' });
    doc.fill(COLORS.navy).font('Helvetica-Bold').fontSize(11).text(title, 126, y + 6);
    doc.fill(COLORS.midGray).font('Helvetica').fontSize(10).text(desc, 126, y + 22, { width: pageWidth - 70 });
    y += 58;
  });

  footer(7);

  // ─── PAGE 8: PRICING + QUICK REFERENCE ───────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('PART 6', y);
  y = h1('The Pricing\nReality Check', y);
  y = body('Most freelancers underprice because they benchmark against competitors instead of their own financial requirements.', y);

  y = h2('True Minimum Rate Calculation', y);
  doc.rect(64, y, pageWidth, 70).fill(COLORS.navy);
  doc.fill(COLORS.white).font('Helvetica').fontSize(11).text(
    'Annual personal expenses ÷ 0.65 ÷ billable hours per year\n= Your True Minimum Hourly Rate\n\nExample: $52,000 ÷ 0.65 ÷ 1,000 billable hours = $80/hour minimum',
    80, y + 10, { lineGap: 4 }
  );
  y += 84;
  y = callout('If your current rate is below this number, you are structurally unable to build a stable financial system — regardless of how well you budget. Pricing is a financial decision, not just a market decision.', y);

  y = divider(y);
  y = sectionTag('QUICK REFERENCE', y);
  y = h2('Your Financial OS at a Glance', y);

  const refRows = [
    ['Landing Pad', 'Receives all income', 'Every 48 hrs — allocate out'],
    ['Tax Vault', 'Self-employment taxes', 'Quarterly tax payments only'],
    ['Operating Account', 'Business expenses', 'Ongoing, business only'],
    ['Buffer', 'Income gap coverage', 'Only when Landing Pad is short'],
    ['Personal Checking', 'Your actual life', 'Monthly Pay Day transfer'],
  ];

  doc.rect(64, y, pageWidth, 22).fill(COLORS.navy);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(9).text('ACCOUNT', 72, y + 7);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(9).text('PURPOSE', 220, y + 7);
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(9).text('WHEN TO TOUCH IT', 370, y + 7);
  y += 22;

  refRows.forEach(([acct, purpose, when], i) => {
    doc.rect(64, y, pageWidth, 22).fill(i % 2 === 0 ? COLORS.lightGray : COLORS.white);
    doc.fill(COLORS.navy).font('Helvetica-Bold').fontSize(9).text(acct, 72, y + 7);
    doc.fill(COLORS.midGray).font('Helvetica').fontSize(9).text(purpose, 220, y + 7);
    doc.fill(COLORS.midGray).font('Helvetica').fontSize(9).text(when, 370, y + 7);
    y += 22;
  });

  footer(8);

  // ─── PAGE 9: YOUR FIRST 7 DAYS + CTA ─────────────────────────────
  addPage();
  pageHeader();
  y = 70;

  y = sectionTag('ACTION PLAN', y);
  y = h1('Your First 7 Days', y);

  const days = [
    ['Day 1–2', 'Open missing accounts. Relay, Mercury, and Novo all allow multiple free business checking accounts — ideal for this system.'],
    ['Day 3', 'Calculate your BMP, TVP, and BBT using the formulas in Parts 1–2. Write them down somewhere permanent.'],
    ['Day 4', 'Set up automation where possible. Even a calendar reminder to run the 48-hour rule manually is enough to start.'],
    ['Day 5–6', 'Identify your top 2 retainer candidates from past clients. Draft your retainer conversation using the framework in Part 4.'],
    ['Day 7', 'Run your first Monthly Financial Review. The numbers will be messy — that\'s fine. You need a starting point.'],
  ];

  days.forEach(([day, action]) => {
    if (y > 680) { addPage(); pageHeader(); y = 70; }
    doc.rect(64, y, pageWidth, 58).fill(COLORS.lightGray);
    doc.rect(64, y, 4, 58).fill(COLORS.teal);
    doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(10).text(day.toUpperCase(), 80, y + 10, { characterSpacing: 1 });
    doc.fill(COLORS.navy).font('Helvetica').fontSize(11).text(action, 80, y + 26, { width: pageWidth - 30, lineGap: 3 });
    y += 66;
  });

  y = divider(y);

  // Final CTA box
  doc.rect(64, y, pageWidth, 120).fill(COLORS.navy);
  doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(10).text('BUILT BY SOLOFLOOR', 80, y + 16, { characterSpacing: 1.5 });
  doc.fill(COLORS.white).font('Helvetica-Bold').fontSize(16).text('Financial systems for the self-employed.', 80, y + 34);
  doc.fill(COLORS.white).opacity(0.7).font('Helvetica').fontSize(11).text(
    'More guides, templates, and tools at solofloor.io\nQuestions? hello@solofloor.io',
    80, y + 58, { lineGap: 4 }
  );
  doc.opacity(1);
  doc.fill(COLORS.teal).font('Helvetica-Bold').fontSize(11).text('solofloor.io →', 80, y + 94);

  footer(9);

  doc.end();

  stream.on('finish', () => {
    console.log(`✓ PDF generated: ${OUTPUT_PATH}`);
  });
}

generate();
