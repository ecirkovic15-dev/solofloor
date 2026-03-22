const PDFDocument = require('pdfkit');
const fs   = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../public/pdf/feast-and-famine-fix.pdf');
const BEBAS_PATH  = path.join(__dirname, '../fonts/BebasNeue-Regular.ttf');

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  dark:        '#07111f',
  darkSurface: '#0d1b2e',
  navy:        '#1B2E4B',
  navyMid:     '#243B55',
  teal:        '#3aaa80',
  tealDark:    '#2a8a64',
  tealLight:   '#EBF8F3',
  tealBorder:  '#A7E8CE',
  pageBg:      '#F8FAFC',
  white:       '#FFFFFF',
  worksheetBg: '#F0FBF7',
  amberLight:  '#FEF3C7',
  amber:       '#D97706',
  borderLight: '#E2EBF4',
  textDark:    '#0F1E30',
  textMid:     '#374151',
  textMuted:   '#64748B',
  textFaint:   '#94A3B8',
};

const ML = 56, MR = 56;
const PW_CONST = 595.28;
const CW_CONST = PW_CONST - ML - MR; // ~483

function generate() {
  const hasBebas = fs.existsSync(BEBAS_PATH);
  if (!hasBebas) console.warn('⚠  BebasNeue-Regular.ttf not found — using Helvetica-Bold');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 52, bottom: 52, left: ML, right: MR },
    info: {
      Title:   "The Feast & Famine Fix — A Freelancer's Financial Operating System",
      Author:  'SoloFloor',
      Subject: 'Freelancer Financial System',
    },
  });

  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  const PW = doc.page.width;
  const PH = doc.page.height;
  const CW = PW - ML - MR;

  // ─── TYPOGRAPHY ───────────────────────────────────────────────────────────
  function display(size) {
    return hasBebas ? doc.font(BEBAS_PATH).fontSize(size)
                    : doc.font('Helvetica-Bold').fontSize(size);
  }
  function sans(size, bold) {
    return doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size);
  }
  function dispH(size, text, opts) {
    // Height of a display-font string
    return hasBebas
      ? doc.font(BEBAS_PATH).fontSize(size).heightOfString(text, opts)
      : doc.font('Helvetica-Bold').fontSize(size).heightOfString(text, opts);
  }

  // ─── PAGE CHROME ──────────────────────────────────────────────────────────
  function pageSetup() {
    doc.rect(0, 0, PW, PH).fill(C.pageBg);
    doc.rect(0, 0, PW, 3).fill(C.teal);
    sans(7.5, true).fillColor(C.tealDark).text('SOLOFLOOR', ML, 11, { characterSpacing: 2, lineBreak: false });
    sans(7.5).fillColor(C.textFaint).text('  ·  THE FEAST & FAMINE FIX', ML + 65, 11, { characterSpacing: 0.5, lineBreak: false });
    doc.moveTo(ML, 24).lineTo(ML + CW, 24).lineWidth(0.4).strokeColor(C.borderLight).stroke();
  }

  function footer(n) {
    const fy = PH - 30;
    doc.moveTo(ML, fy).lineTo(ML + CW, fy).lineWidth(0.4).strokeColor(C.borderLight).stroke();
    sans(8).fillColor(C.textFaint).text('solofloor.io', ML, fy + 8, { lineBreak: false });
    sans(8).fillColor(C.textFaint).text(`${n} / 9`, ML + CW - 20, fy + 8, { lineBreak: false });
  }

  // ─── LAYOUT PRIMITIVES ────────────────────────────────────────────────────
  function pill(text, y) {
    const twRaw = hasBebas
      ? doc.font(BEBAS_PATH).fontSize(9).widthOfString(text)
      : doc.font('Helvetica-Bold').fontSize(9).widthOfString(text);
    const tw = twRaw + 18;
    doc.roundedRect(ML, y, tw, 18, 3).fill(C.tealLight);
    display(9).fillColor(C.tealDark).text(text, ML + 9, y + 4, { characterSpacing: 1.5, lineBreak: false });
    return y + 26;
  }

  function h1(text, y) {
    const th = dispH(34, text, { width: CW, lineGap: -2 });
    display(34).fillColor(C.textDark).text(text, ML, y, { width: CW, lineGap: -2 });
    return y + th + 10;
  }

  function h2(text, y) {
    const th = sans(12, true).heightOfString(text, { width: CW });
    sans(12, true).fillColor(C.navy).text(text, ML, y, { width: CW });
    return y + th + 7;
  }

  function body(text, y) {
    const th = sans(10.5).heightOfString(text, { width: CW, lineGap: 2.5 });
    sans(10.5).fillColor(C.textMid).text(text, ML, y, { width: CW, lineGap: 2.5 });
    return y + th + 9;
  }

  function rule(y) {
    doc.moveTo(ML, y).lineTo(ML + CW, y).lineWidth(0.4).strokeColor(C.borderLight).stroke();
    return y + 14;
  }

  function quoteBlock(text, y) {
    const innerW = CW - 28;
    const th = sans(11.5).heightOfString(text, { width: innerW, lineGap: 2.5 });
    const bH = th + 36;
    doc.roundedRect(ML, y, CW, bH, 5).fill(C.darkSurface);
    doc.rect(ML, y, 4, bH).fill(C.teal);
    // Decorative quote mark (Helvetica, at low opacity)
    doc.save();
    doc.font('Helvetica-Bold').fontSize(52).fillColor(C.teal).opacity(0.18)
       .text('\u201C', ML + 10, y + 0, { lineBreak: false });
    doc.restore();
    sans(11.5).fillColor(C.white).text(text, ML + 20, y + 16, { width: innerW, lineGap: 2.5 });
    return y + bH + 12;
  }

  function callout(text, y) {
    const innerW = CW - 26;
    const th = sans(10.5).heightOfString(text, { width: innerW, lineGap: 2.5 });
    const bH = th + 24;
    doc.roundedRect(ML, y, CW, bH, 4).fill(C.tealLight);
    doc.rect(ML, y, 3, bH).fill(C.teal);
    sans(10.5).fillColor(C.textDark).text(text, ML + 14, y + 12, { width: innerW, lineGap: 2.5 });
    return y + bH + 12;
  }

  function warn(text, y) {
    const innerW = CW - 26;
    const th = sans(10.5).heightOfString(text, { width: innerW, lineGap: 2.5 });
    const bH = th + 24;
    doc.roundedRect(ML, y, CW, bH, 4).fill(C.amberLight);
    doc.rect(ML, y, 3, bH).fill(C.amber);
    sans(10.5).fillColor('#7C3800').text(text, ML + 14, y + 12, { width: innerW, lineGap: 2.5 });
    return y + bH + 12;
  }

  function darkBox(lines, y) {
    // lines: [{text, size, color, bold, opacity}]
    // Pre-measure height
    let totalH = 16;
    lines.forEach(({ text, size, bold, opacity }) => {
      const fh = bold
        ? sans(size, true).heightOfString(text, { width: CW - 32, lineGap: 2 })
        : dispH(size, text, { width: CW - 32, lineGap: 2 });
      totalH += fh + (opacity ? 4 : 6);
    });
    const bH = totalH + 10;
    doc.roundedRect(ML, y, CW, bH, 5).fill(C.navy);
    let ty = y + 14;
    lines.forEach(({ text, size, color, bold, opacity }) => {
      if (opacity !== undefined) {
        doc.save();
        doc.opacity(opacity);
      }
      const col = color || C.white;
      const fh = bold
        ? sans(size, true).fillColor(col).heightOfString(text, { width: CW - 32, lineGap: 2 })
        : dispH(size, text, { width: CW - 32, lineGap: 2 });
      if (bold) {
        sans(size, true).fillColor(col).text(text, ML + 14, ty, { width: CW - 32, lineGap: 2 });
      } else {
        display(size).fillColor(col).text(text, ML + 14, ty, { width: CW - 32, lineGap: 2 });
      }
      if (opacity !== undefined) doc.restore();
      ty += fh + (opacity ? 4 : 6);
    });
    return y + bH + 10;
  }

  function bullets(items, y) {
    items.forEach(item => {
      const ih = sans(10.5).heightOfString(item, { width: CW - 22, lineGap: 2.5 });
      display(12).fillColor(C.teal).text('\u2192', ML, y, { lineBreak: false });
      sans(10.5).fillColor(C.textMid).text(item, ML + 22, y, { width: CW - 22, lineGap: 2.5 });
      y += ih + 6;
    });
    return y;
  }

  function wsHeader(label, y) {
    doc.rect(ML, y, CW, 24).fill(C.navy);
    display(9).fillColor(C.teal).text('\u270F  ' + label, ML + 12, y + 7, { characterSpacing: 1.5, lineBreak: false });
    return y + 24;
  }

  function wsBox(y, h) {
    doc.roundedRect(ML, y, CW, h, 3).fill(C.worksheetBg);
    doc.roundedRect(ML, y, CW, h, 3).lineWidth(0.7).strokeColor(C.tealBorder).stroke();
  }

  function dotLine(x1, y1, x2) {
    doc.moveTo(x1, y1).lineTo(x2, y1)
       .lineWidth(0.5).dash(2.5, { space: 2.5 }).strokeColor(C.tealBorder).stroke();
    doc.undash();
  }

  function checkbox(x, y) {
    doc.roundedRect(x, y, 12, 12, 2).lineWidth(0.8).strokeColor(C.teal).stroke();
  }

  // =========================================================================
  // COVER
  // =========================================================================
  doc.rect(0, 0, PW, PH).fill(C.dark);
  doc.rect(0, 0, PW, 4).fill(C.teal);
  doc.rect(0, PH - 4, PW, 4).fill(C.teal);

  doc.circle(ML + 5, 60, 4).fill(C.teal);
  sans(10, true).fillColor(C.white).text('SOLOFLOOR', ML + 16, 55, { characterSpacing: 3, lineBreak: false });
  sans(9).fillColor(C.teal).text('solofloor.io', ML + 16, 70, { lineBreak: false });

  display(84).fillColor(C.white).text('THE FEAST &', ML, 130, { lineGap: -8, lineBreak: false });
  display(84).fillColor(C.teal).text('FAMINE FIX', ML, 208, { lineBreak: false });

  doc.save(); doc.opacity(0.65);
  display(16).fillColor(C.white)
    .text("A FREELANCER'S FINANCIAL OPERATING SYSTEM", ML, 308, { characterSpacing: 1, lineBreak: false });
  doc.restore();

  doc.rect(ML, 336, 56, 2).fill(C.teal);

  doc.save(); doc.opacity(0.45);
  sans(12).fillColor(C.white).text(
    'Stop living invoice-to-invoice.\nBuild the financial infrastructure your business actually needs.',
    ML, 350, { lineGap: 4 }
  );
  doc.restore();

  // What's Inside panel
  const panelY = 440;
  doc.roundedRect(ML, panelY, CW, 228, 6).fill(C.navyMid);
  doc.rect(ML, panelY, 4, 228).fill(C.teal);
  display(10).fillColor(C.teal).text("WHAT'S INSIDE", ML + 16, panelY + 14, { characterSpacing: 2, lineBreak: false });

  [
    ['01', 'The 5-Account System',            'Stop confusing income with profit'],
    ['02', 'The Tax Vault Formula',            "Never owe the IRS money you've already spent"],
    ['03', 'The 90-Day Buffer Target',         'The number that ends money panic'],
    ['04', 'The Retainer Conversion Playbook', 'Build predictable monthly income'],
    ['05', 'The 20-Minute Monthly Review',     'The only financial ritual you need'],
  ].forEach(([num, title, sub], i) => {
    const iy = panelY + 40 + i * 36;
    display(16).fillColor(C.teal).text(num, ML + 16, iy, { lineBreak: false });
    sans(10, true).fillColor(C.white).text(title, ML + 48, iy, { lineBreak: false });
    doc.save(); doc.opacity(0.5);
    sans(8.5).fillColor(C.white).text(sub, ML + 48, iy + 14, { lineBreak: false });
    doc.restore();
  });

  doc.save(); doc.opacity(0.28);
  sans(7.5).fillColor(C.white)
    .text('© 2026 SoloFloor · solofloor.io · All rights reserved', ML, PH - 22, { align: 'center', width: CW });
  doc.restore();

  // =========================================================================
  // PAGE 2 — THE PROBLEM
  // =========================================================================
  doc.addPage(); pageSetup();
  let y = 36;

  y = pill('THE PROBLEM', y);
  y = h1('Why Freelancer Finances\nFeel Impossible', y);
  y = body("You didn't become a freelancer to spend your days thinking about money. But right now, money is probably thinking about you — constantly.", y);
  y = body("Here's the pattern almost every freelancer knows: A strong month arrives. You exhale. Then a slow month hits and you're running calculations at midnight, wondering if you can cover rent. Repeat — indefinitely.", y);
  y = quoteBlock(
    '"This isn\'t a discipline problem.\nIt\'s an infrastructure problem.\n\nThe financial advice most people follow was written for someone with the same paycheck on the same date every two weeks. That is not your life."',
    y
  );
  y = body('Your income might look like: $11,000 in March, $3,200 in April, $8,700 in May. Most financial frameworks were never designed for that reality — so they add to the stress instead of solving it.', y);
  y = rule(y + 2);

  sans(11, true).fillColor(C.navy).text('The research confirms it:', ML, y, { lineBreak: false });
  y += 24;

  // Two stat boxes — fully fixed coordinates, no doc.y dependency
  const sW = (CW - 10) / 2;
  [
    ['68%', 'of solopreneurs have less than 6 months of savings or no safety net'],
    ['48%', 'have experienced a month or more entirely without income'],
  ].forEach(([stat, label], i) => {
    const sx = ML + i * (sW + 10);
    doc.roundedRect(sx, y, sW, 80, 5).fill(C.navy);
    display(48).fillColor(C.teal).text(stat, sx + 12, y + 8, { lineBreak: false });
    doc.save(); doc.opacity(0.7);
    sans(8.5).fillColor(C.white).text(label, sx + 12, y + 54, { width: sW - 24, lineGap: 2 });
    doc.restore();
  });
  y += 92;

  y = callout("This guide gives you a system designed specifically for variable income — one that creates stability from the variability, not despite it. You don't need a salary. You need the right infrastructure.", y);

  footer(2);

  // =========================================================================
  // PAGE 3 — THE 5-ACCOUNT SYSTEM
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 1 OF 5', y);
  y = h1('The 5-Account\nSystem', y);
  y = body("Most freelancers run everything through one or two accounts. When income, taxes, business costs, and personal spending all share the same pool, you genuinely can't tell what's yours — so you guess. Guessing is stressful.", y);

  const accounts = [
    { n:'01', name:'Landing Pad',         type:'Business Checking',
      desc:"Every client payment lands here first. This is a holding zone only — you don't spend directly from here. Money flows out to the four accounts below on a schedule." },
    { n:'02', name:'Tax Vault',           type:'High-Yield Savings',
      desc:"The moment income lands, a fixed percentage moves here immediately — before anything else. This is your tax set-aside, always protected and never touched for operating costs." },
    { n:'03', name:'Business Operating',  type:'Business Checking',
      desc:"Covers software, contractors, equipment, and all business costs. Fund it monthly from your Landing Pad based on average monthly business expenses." },
    { n:'04', name:'The Buffer',          type:'Personal Savings',
      desc:"Your 90-day runway. When a slow month hits, you draw from here instead of panicking. This account is why a bad month stays manageable — not devastating." },
    { n:'05', name:'Your Pay',            type:'Personal Checking',
      desc:"Your fixed monthly salary. One transfer in, on one date, every month. This is the account you actually live from — consistent, predictable, yours." },
  ];

  accounts.forEach(({ n, name, type, desc }) => {
    const descH = sans(9).heightOfString(desc, { width: CW - 24, lineGap: 2 });
    const cH = Math.max(62, descH + 48);
    if (y + cH > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
    const top = y;
    doc.roundedRect(top === y ? ML : ML, y, CW, cH, 4).fill(C.white);
    doc.rect(ML, y, 3, cH).fill(C.teal);
    display(18).fillColor(C.teal).text(n, ML + 12, y + 9, { lineBreak: false });
    sans(10.5, true).fillColor(C.textDark).text(name, ML + 44, y + 9, { lineBreak: false });
    sans(7.5, true).fillColor(C.tealDark).text(type.toUpperCase(), ML + 44, y + 24, { characterSpacing: 0.5, lineBreak: false });
    sans(9).fillColor(C.textMuted).text(desc, ML + 12, y + 39, { width: CW - 24, lineGap: 2 });
    y = top + cH + 6;
  });

  // Worksheet
  if (y + 122 > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
  y = wsHeader('SET UP YOUR 5 ACCOUNTS', y + 4);
  const ws3H = 100;
  wsBox(y, ws3H);
  sans(8.5).fillColor(C.textMuted)
    .text("For each account, note which bank you'll use and check it off once it's open:", ML + 12, y + 8, { width: CW - 24 });
  sans(7.5, true).fillColor(C.tealDark)
    .text('ACCOUNT', ML + 12, y + 22)
    .text('BANK / INSTITUTION', ML + 162, y + 22)
    .text('OPEN?', ML + 388, y + 22);
  ['Landing Pad','Tax Vault','Business Operating','Buffer','Your Pay'].forEach((a, i) => {
    const ry = y + 34 + i * 12;
    sans(8.5).fillColor(C.textMid).text(a + ':', ML + 12, ry, { lineBreak: false });
    dotLine(ML + 162, ry + 9, ML + 375);
    checkbox(ML + 390, ry);
  });
  y += ws3H + 8;

  footer(3);

  // =========================================================================
  // PAGE 4 — THE THREE CORE FORMULAS (BMP + TVP)
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 2 OF 5', y);
  y = h1('The Three\nCore Formulas', y);

  // Formula 1: BMP
  sans(9, true).fillColor(C.tealDark).text('FORMULA 1', ML, y, { characterSpacing: 1.5, lineBreak: false });
  y += 16;
  const f1titleH = dispH(22, 'Your Base Monthly Pay (BMP)', { width: CW });
  display(22).fillColor(C.textDark).text('Your Base Monthly Pay (BMP)', ML, y, { width: CW });
  y += f1titleH + 6;
  y = body('This is the consistent monthly salary you pay yourself — regardless of what came in. The whole system stabilizes around this single number.', y);
  y = darkBox([
    { text: 'THE FORMULA', size: 9, color: C.teal },
    { text: 'Annual personal expenses  ÷  12  +  10%  =  Base Monthly Pay', size: 11, bold: true, color: C.white },
    { text: '(the 10% buffer absorbs small surprises without touching your savings)', size: 8.5, bold: true, color: C.white, opacity: 0.4 },
  ], y);

  y = wsHeader('CALCULATE MY BASE MONTHLY PAY', y);
  const bmpWsH = 90;
  wsBox(y, bmpWsH);
  [
    ['Step 1', 'Add up your last 12 months of personal expenses', 'e.g. $52,000'],
    ['Step 2', 'Divide by 12',                                    'e.g. $4,333'],
    ['Step 3', 'Add 10% comfort buffer',                          'e.g. $4,767'],
  ].forEach(([lbl, desc, ex], i) => {
    const sy = y + 10 + i * 22;
    sans(8, true).fillColor(C.textMuted).text(lbl + ':', ML + 12, sy, { lineBreak: false });
    sans(8.5).fillColor(C.textMid).text(desc, ML + 58, sy, { lineBreak: false });
    sans(8.5).fillColor(C.tealDark).text(ex, ML + CW - 78, sy, { lineBreak: false });
    dotLine(ML + 12, sy + 13, ML + CW - 12);
  });
  sans(10, true).fillColor(C.navy).text('My BMP =', ML + 12, y + 72, { lineBreak: false });
  sans(10, true).fillColor(C.teal).text('$____________  per month', ML + 78, y + 72, { lineBreak: false });
  y += bmpWsH + 14;

  // Formula 2: TVP
  y = rule(y);
  sans(9, true).fillColor(C.tealDark).text('FORMULA 2', ML, y, { characterSpacing: 1.5, lineBreak: false });
  y += 16;
  const f2titleH = dispH(22, 'Your Tax Vault Percentage (TVP)', { width: CW });
  display(22).fillColor(C.textDark).text('Your Tax Vault Percentage (TVP)', ML, y, { width: CW });
  y += f2titleH + 6;
  y = body("Freelancers pay self-employment tax on top of income tax. Setting aside the wrong amount is how you end up owing the IRS money you've already spent.", y);

  // TVP table — all fixed coordinates
  const taxRows = [
    ['Under $50,000 / yr',      '25%', 'Solid starting point while building'],
    ['$50,000 – $100,000 / yr', '30%', 'Most common for established freelancers'],
    ['Over $100,000 / yr',      '33%', 'Higher bracket; more to protect'],
    ['Unsure?',                 '30%', 'Start here; adjust after first filing'],
  ];
  if (y + 120 > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
  doc.rect(ML, y, CW, 22).fill(C.navy);
  sans(7.5, true).fillColor(C.white)
    .text('ANNUAL NET INCOME', ML + 12, y + 7)
    .text('SET ASIDE', ML + 222, y + 7)
    .text('GUIDANCE', ML + 304, y + 7);
  y += 22;
  taxRows.forEach(([inc, pct, note], i) => {
    const rH = 22;
    doc.rect(ML, y, CW, rH).fill(i % 2 === 0 ? C.tealLight : C.white);
    sans(9).fillColor(C.textDark).text(inc, ML + 12, y + 7, { lineBreak: false });
    sans(9, true).fillColor(C.tealDark).text(pct, ML + 222, y + 7, { lineBreak: false });
    sans(8.5).fillColor(C.textMuted).text(note, ML + 304, y + 7, { width: CW - 312, lineBreak: false });
    y += rH;
  });
  y += 10;

  y = wsHeader('MY TAX VAULT PERCENTAGE', y);
  const tvpH = 46;
  wsBox(y, tvpH);
  sans(9, true).fillColor(C.textMid).text('My estimated annual net income:', ML + 12, y + 11, { lineBreak: false });
  dotLine(ML + 200, y + 22, ML + 348);
  sans(9, true).fillColor(C.textMid).text('My TVP:', ML + 12, y + 30, { lineBreak: false });
  ['25%','30%','33%'].forEach((opt, i) => {
    const ox = ML + 64 + i * 68;
    checkbox(ox, y + 28);
    sans(9).fillColor(C.textMid).text(opt, ox + 16, y + 30, { lineBreak: false });
  });
  y += tvpH + 8;

  footer(4);

  // =========================================================================
  // PAGE 5 — BUFFER + INCOME SMOOTHING
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 2  ·  CONTINUED', y);
  sans(9, true).fillColor(C.tealDark).text('FORMULA 3', ML, y, { characterSpacing: 1.5, lineBreak: false });
  y += 16;
  const f3titleH = dispH(22, 'Your 90-Day Buffer Target (BBT)', { width: CW });
  display(22).fillColor(C.textDark).text('Your 90-Day Buffer Target (BBT)', ML, y, { width: CW });
  y += f3titleH + 6;
  y = body('Your Buffer is your financial shock absorber. This single number transforms a slow month from a crisis into a planned, covered dip — because you built the bridge before you needed to cross it.', y);
  y = darkBox([
    { text: 'Base Monthly Pay  ×  3  =  Buffer Target', size: 18, color: C.white },
    { text: 'Example: $4,767 × 3 = $14,301 target', size: 10, bold: true, color: C.teal },
  ], y);

  y = wsHeader('MY 90-DAY BUFFER TARGET', y);
  const bbtH = 58;
  wsBox(y, bbtH);
  sans(10, true).fillColor(C.textDark).text('My BMP:', ML + 12, y + 12, { lineBreak: false });
  sans(10, true).fillColor(C.teal).text('$__________', ML + 74, y + 12, { lineBreak: false });
  sans(10, true).fillColor(C.textDark).text('× 3  =', ML + 170, y + 12, { lineBreak: false });
  sans(10, true).fillColor(C.teal).text('$__________', ML + 218, y + 12, { lineBreak: false });
  sans(8.5).fillColor(C.textMuted).text('My current savings toward this goal:', ML + 12, y + 33, { lineBreak: false });
  dotLine(ML + 218, y + 44, ML + 360);
  sans(8.5).fillColor(C.textMuted).text('Remaining gap:', ML + 12, y + 47, { lineBreak: false });
  dotLine(ML + 100, y + 57, ML + 260);
  y += bbtH + 14;

  y = rule(y);
  y = pill('PART 3 OF 5', y);
  const ism_titleH = dispH(28, 'The Income\nSmoothing Method', { width: CW, lineGap: -2 });
  display(28).fillColor(C.textDark).text('The Income\nSmoothing Method', ML, y, { width: CW, lineGap: -2 });
  y += ism_titleH + 10;
  y = body('Once your 5-account system is running, execute this sequence within 48 hours of every client payment clearing. This habit is what makes the whole system self-sustaining.', y);

  const ismSteps = [
    { n:'1', title:'Tax Vault Transfer',        desc:"Move your TVP percentage immediately — before anything else. This is non-negotiable." },
    { n:'2', title:'Operating Account Top-Up',  desc:"If your Operating Account is below your monthly budget, fund the shortfall now." },
    { n:'3', title:'Buffer Contribution',        desc:"Contribute $200–$500 toward your BBT if you haven't hit the target yet. Every month." },
    { n:'4', title:'Remainder Holds',            desc:"Leave the rest in your Landing Pad — it accumulates toward your next Pay Day transfer." },
  ];

  ismSteps.forEach(({ n, title, desc }) => {
    const descH = sans(9).heightOfString(desc, { width: CW - 56, lineGap: 2 });
    const cH = Math.max(52, descH + 32);
    if (y + cH > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
    const top = y;
    doc.roundedRect(ML, y, CW, cH, 4).fill(C.white);
    doc.circle(ML + 22, y + cH / 2, 13).fill(C.tealLight);
    display(15).fillColor(C.teal).text(n, ML + 22, y + cH / 2 - 8, { width: 0, align: 'center', lineBreak: false });
    sans(10, true).fillColor(C.textDark).text(title, ML + 44, y + 10, { lineBreak: false });
    sans(9).fillColor(C.textMuted).text(desc, ML + 44, y + 26, { width: CW - 56, lineGap: 2 });
    y = top + cH + 6;
  });

  y = callout("Monthly Pay Day: Choose one date (1st or 15th). Transfer your BMP to your personal account on that date, every month. If the Landing Pad is short, draw from the Buffer. This creates a predictable paycheck — regardless of when clients pay.", y);

  footer(5);

  // =========================================================================
  // PAGE 6 — THE RETAINER CONVERSION PLAYBOOK
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 4 OF 5', y);
  y = h1('The Retainer\nConversion Playbook', y);
  y = body("The fastest way to stabilize freelance income isn't better budgeting — it's changing your revenue structure. One retainer at $2,000–$3,000/month does more for your financial stability than any savings habit alone.", y);
  y = h2('How to identify retainer candidates:', y);
  y = bullets([
    'Clients who have hired you 2+ times for similar work',
    'Clients who ask follow-up questions after projects close',
    "Clients whose business has ongoing, repeating needs",
    'Clients who have mentioned wanting more consistent support',
  ], y);
  y = rule(y + 4);
  y = h2('The Conversation Framework', y);
  y = quoteBlock(
    '"Based on this project, I can see a few ways to continue building on what we got. I offer a small number of clients a monthly engagement where I [specific service] for a fixed fee. It\'s limited availability — but I wanted to offer it to you first. Would it be worth 15 minutes to explore what that could look like?"',
    y
  );
  y = h2('Retainer Pricing Formula', y);
  y = darkBox([
    { text: 'Estimated monthly hours  ×  hourly rate  ×  0.85  =  Retainer Price', size: 11, bold: true, color: C.white },
    { text: "The 0.85 gives the client a loyalty discount — and significantly increases the likelihood they say yes.", size: 8.5, bold: true, color: C.white, opacity: 0.45 },
  ], y);
  y = body('Target: convert at least 1 client per quarter. At $1,500–$3,000/month each, two retainer clients eliminate most income volatility before you write a single new proposal.', y);

  if (y + 130 > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
  y = wsHeader('MY RETAINER CANDIDATES', y + 4);
  const rcH = 114;
  wsBox(y, rcH);
  const rcCols = [ML + 12, ML + 162, ML + 296, ML + 388];
  sans(7.5, true).fillColor(C.tealDark)
    .text('CLIENT NAME',    rcCols[0], y + 8)
    .text('LIKELY SERVICE', rcCols[1], y + 8)
    .text('EST. $/MONTH',   rcCols[2], y + 8)
    .text('CONTACTED',      rcCols[3], y + 8);
  for (let i = 0; i < 4; i++) {
    const ry = y + 22 + i * 22;
    dotLine(rcCols[0], ry + 12, rcCols[1] - 8);
    dotLine(rcCols[1], ry + 12, rcCols[2] - 8);
    dotLine(rcCols[2], ry + 12, rcCols[3] - 8);
    checkbox(rcCols[3] + 2, ry);
  }
  y += rcH + 8;

  footer(6);

  // =========================================================================
  // PAGE 7 — THE 20-MINUTE MONTHLY REVIEW
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 5 OF 5', y);
  y = h1('The 20-Minute\nMonthly Review', y);
  y = body('Run this on the last working day of each month. Block it in your calendar now. Total time: 20 minutes — in exchange for complete financial visibility before the next month begins.', y);

  const reviewCards = [
    { time: '2 min', title: 'Landing Pad Balance',        desc: 'Record the current balance. Higher or lower than last month at this time? Note the direction.' },
    { time: '2 min', title: 'Tax Vault Check',             desc: "Calculate what should be there (income × TVP). If you're short, top it up before the month closes." },
    { time: '2 min', title: 'Buffer Status',               desc: 'Current balance vs. BBT. If you drew from it this month, note it — and plan to replenish next month.' },
    { time: '5 min', title: 'Operating Expenses Review',   desc: "Any unused subscriptions? Unexpected charges? Action anything overdue while it's in front of you." },
    { time: '5 min', title: 'Pipeline Review',             desc: 'What invoices are outstanding? Send a follow-up to anything 7+ days past due — today, not tomorrow.' },
    { time: '4 min', title: 'Income Trend',                desc: 'Compare this month to last month and the same month last year. Growing, flat, or flagging?' },
  ];

  reviewCards.forEach(({ time, title, desc }) => {
    const descH = sans(9).heightOfString(desc, { width: CW - 82, lineGap: 2 });
    const cH = Math.max(52, descH + 28);
    if (y + cH > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
    const top = y;
    doc.roundedRect(ML, y, CW, cH, 4).fill(C.white);
    doc.rect(ML, y, 58, cH).fill(C.navy);
    const mid = y + cH / 2;
    const th = dispH(13, time, { width: 58, lineGap: 0 });
    display(13).fillColor(C.teal).text(time, ML, mid - th / 2, { width: 58, align: 'center', lineBreak: false });
    sans(10, true).fillColor(C.textDark).text(title, ML + 68, y + 10, { lineBreak: false });
    sans(9).fillColor(C.textMuted).text(desc, ML + 68, y + 26, { width: CW - 80, lineGap: 2 });
    y = top + cH + 6;
  });

  y += 4;
  if (y + 156 > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
  y = wsHeader('MONTHLY REVIEW CHECKLIST  —  Month: ___________  Year: ______', y);
  const mrH = 148;
  wsBox(y, mrH);
  [
    ['Landing Pad balance recorded',      '2 min'],
    ['Tax Vault checked and topped up',   '2 min'],
    ['Buffer status noted',               '2 min'],
    ['Operating expenses reviewed',       '5 min'],
    ['Outstanding invoices followed up',  '5 min'],
    ['Income trend noted',                '4 min'],
  ].forEach(([label, time], i) => {
    const cy = y + 12 + i * 22;
    checkbox(ML + 10, cy + 1);
    sans(8, true).fillColor(C.tealDark).text(time, ML + 28, cy + 3, { lineBreak: false });
    sans(9).fillColor(C.textMid).text(label, ML + 64, cy + 3, { lineBreak: false });
  });
  y += mrH + 8;

  footer(7);

  // =========================================================================
  // PAGE 8 — PRICING REALITY CHECK + QUICK REFERENCE
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('PART 6', y);
  y = h1('The Pricing\nReality Check', y);
  y = body("Most freelancers underprice because they benchmark against competitors instead of their own financial requirements. This formula shows you the minimum you must charge — not the maximum you could.", y);
  y = h2('True Minimum Rate Calculation', y);
  y = darkBox([
    { text: 'THE FORMULA', size: 9, color: C.teal },
    { text: 'Annual personal expenses  ÷  0.65  ÷  billable hours per year', size: 11, bold: true, color: C.white },
    { text: '= Your True Minimum Hourly Rate', size: 12, color: C.teal },
    { text: 'Example: $52,000 ÷ 0.65 ÷ 1,000 billable hours = $80/hr minimum', size: 8.5, bold: true, color: C.white, opacity: 0.4 },
  ], y);
  y = warn("If your current rate is below this number, you are structurally unable to build a stable financial system — regardless of how well you manage expenses. Pricing is a financial decision, not just a market one.", y);

  y = rule(y);
  y = pill('QUICK REFERENCE', y);
  const qrTitleH = dispH(24, 'Your Financial OS at a Glance', { width: CW });
  display(24).fillColor(C.textDark).text('Your Financial OS at a Glance', ML, y, { width: CW });
  y += qrTitleH + 10;

  doc.rect(ML, y, CW, 22).fill(C.navy);
  sans(7.5, true).fillColor(C.white)
    .text('ACCOUNT',        ML + 12, y + 7)
    .text('PURPOSE',        ML + 182, y + 7)
    .text('WHEN TO USE IT', ML + 356, y + 7);
  y += 22;
  [
    ['Landing Pad',       'Receives all income',           'Every 48hrs — allocate out'],
    ['Tax Vault',         'Self-employment tax reserve',   'Quarterly tax payments only'],
    ['Operating Account', 'Business expenses',             'Ongoing, business only'],
    ['Buffer',            'Income gap coverage',           'Only when Landing Pad is short'],
    ['Personal Checking', 'Your actual life',              'Monthly Pay Day transfer'],
  ].forEach(([acct, purpose, when], i) => {
    const rH = 22;
    doc.rect(ML, y, CW, rH).fill(i % 2 === 0 ? C.tealLight : C.white);
    sans(9, true).fillColor(C.navy).text(acct, ML + 12, y + 7, { lineBreak: false });
    sans(9).fillColor(C.textMuted)
      .text(purpose, ML + 182, y + 7, { lineBreak: false })
      .text(when,    ML + 356, y + 7, { lineBreak: false });
    y += rH;
  });
  y += 14;

  // Three Numbers summary
  doc.roundedRect(ML, y, CW, 70, 5).fill(C.navy);
  display(9).fillColor(C.teal).text('YOUR THREE NUMBERS  —  KEEP THESE VISIBLE', ML + 14, y + 10, { characterSpacing: 1.5, lineBreak: false });
  const third = CW / 3;
  doc.save(); doc.opacity(0.5);
  sans(8, true).fillColor(C.white)
    .text('MY BMP', ML + 14, y + 30)
    .text('MY TVP', ML + 14 + third, y + 30)
    .text('MY BBT', ML + 14 + third * 2, y + 30);
  doc.restore();
  sans(10, true).fillColor(C.teal)
    .text('$_______ / mo', ML + 14, y + 46)
    .text('_______ %',     ML + 14 + third, y + 46)
    .text('$_______',      ML + 14 + third * 2, y + 46);
  y += 84;

  footer(8);

  // =========================================================================
  // PAGE 9 — YOUR FIRST 7 DAYS + CTA
  // =========================================================================
  doc.addPage(); pageSetup();
  y = 36;

  y = pill('ACTION PLAN', y);
  y = h1('Your First 7 Days', y);
  y = body("Here's exactly what to do, starting this weekend. You don't need it to be perfect — you need it to be started. Every system in this guide is designed to work from day one, even if the numbers are rough.", y);

  const days = [
    { day: 'Day 1–2', action: 'Open your missing accounts. Relay, Mercury, and Novo all offer multiple free business checking accounts. For high-yield savings (Tax Vault + Buffer), consider Marcus, SoFi, or Ally.' },
    { day: 'Day 3',   action: 'Calculate your BMP, TVP, and BBT using the worksheets in Parts 1–2. Write them in the "Your Three Numbers" box on page 8. These three numbers are your foundation.' },
    { day: 'Day 4',   action: 'Set up your first automation: a recurring calendar event to run the 48-hour allocation rule after every payment. Even a manual reminder is enough to start.' },
    { day: 'Day 5–6', action: 'Fill in your Retainer Candidates worksheet on page 6. Identify your top 2–3 candidates and draft your retainer conversation using the framework in Part 4.' },
    { day: 'Day 7',   action: 'Run your first Monthly Financial Review using the checklist on page 7. The numbers will be rough — that\'s exactly right. You just need a starting point.' },
  ];

  days.forEach(({ day, action }) => {
    const aH = sans(9).heightOfString(action, { width: CW - 26, lineGap: 2.5 });
    const cH = Math.max(58, aH + 34);
    if (y + cH > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
    const top = y;
    doc.roundedRect(ML, y, CW, cH, 4).fill(C.white);
    doc.rect(ML, y, 3, cH).fill(C.teal);
    display(11).fillColor(C.teal).text(day.toUpperCase(), ML + 12, y + 10, { characterSpacing: 1, lineBreak: false });
    sans(9).fillColor(C.textMid).text(action, ML + 12, y + 27, { width: CW - 26, lineGap: 2.5 });
    y = top + cH + 8;
  });

  y = rule(y + 4);

  if (y + 140 > PH - 65) { doc.addPage(); pageSetup(); y = 36; }
  const ctaH = 132;
  doc.roundedRect(ML, y, CW, ctaH, 6).fill(C.dark);
  doc.rect(ML, y, 4, ctaH).fill(C.teal);
  doc.rect(ML, y + ctaH - 4, CW, 4).fill(C.teal);
  display(10).fillColor(C.teal).text('BUILT BY SOLOFLOOR', ML + 18, y + 16, { characterSpacing: 2, lineBreak: false });
  display(22).fillColor(C.white).text('Financial systems for the self-employed.', ML + 18, y + 34, { lineBreak: false });
  doc.save(); doc.opacity(0.55);
  sans(10).fillColor(C.white)
    .text('More guides and tools at solofloor.io', ML + 18, y + 68, { lineBreak: false })
    .text('Questions or feedback? hello@solofloor.io', ML + 18, y + 83, { lineBreak: false });
  doc.restore();
  display(14).fillColor(C.teal).text('solofloor.io \u2192', ML + 18, y + 106, { lineBreak: false });

  footer(9);

  doc.end();
  stream.on('finish', () => console.log(`\u2713  PDF \u2192 ${OUTPUT_PATH}`));
}

generate();
