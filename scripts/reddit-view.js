/**
 * SoloFloor — Reddit Match Viewer
 *
 * Pretty-prints saved Reddit matches with suggested response angles.
 *
 * Usage:
 *   node scripts/reddit-view.js           # show all matches
 *   node scripts/reddit-view.js --top 10  # show top N by signal score
 *   node scripts/reddit-view.js --new     # show last 24 hours only
 */

const fs   = require('fs');
const path = require('path');

const MATCHES_PATH = path.join(__dirname, '../logs/reddit-matches.json');

function load() {
  if (!fs.existsSync(MATCHES_PATH)) {
    console.log('No matches yet. Run: node scripts/reddit-listener.js --once');
    process.exit(0);
  }
  return JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf8'));
}

function timeSince(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const h  = Math.floor(ms / 36e5);
  const d  = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'just now';
}

// Generic response angles — prompts for what to say, not a script to copy-paste
const ANGLES = [
  'Share the 5-account framework as a concept (no product pitch) — see if it lands',
  'Ask what system they currently use — genuine curiosity opens doors',
  'Validate the problem ("this is infrastructure, not discipline") and see if they agree',
  'Mention the tax vault concept specifically if tax stress is mentioned',
  'If they\'re asking for recommendations, mention SoloFloor naturally as one option',
];

function responseAngle(match) {
  // Pick an angle based on which keywords matched
  const kws = match.keywords.join(' ');
  if (kws.includes('tax'))          return ANGLES[3];
  if (kws.includes('no clients') || kws.includes('slow'))  return ANGLES[1];
  if (kws.includes('pay myself'))   return ANGLES[2];
  if (match.score >= 4)             return ANGLES[4];
  return ANGLES[0];
}

function print(matches, limit) {
  const shown = limit ? matches.slice(0, limit) : matches;

  console.log(`\n SoloFloor Reddit Matches — ${matches.length} total\n`);
  console.log('═'.repeat(60));

  shown.forEach((m, i) => {
    const type  = m.type === 'post' ? '📌' : '💬';
    const age   = timeSince(m.found);
    const score = '●'.repeat(Math.min(m.score, 5));

    console.log(`\n${i + 1}. ${type}  r/${m.sub}  ${score}  (${age})`);
    console.log(`   ${m.title}`);

    if (m.snippet) {
      const preview = m.snippet.replace(/\n+/g, ' ').slice(0, 200);
      console.log(`\n   "${preview}${m.snippet.length > 200 ? '...' : ''}"`);
    }

    console.log(`\n   Keywords  : ${m.keywords.join(', ')}`);
    console.log(`   Upvotes   : ${m.upvotes}  |  Posted: ${timeSince(m.posted)}`);
    console.log(`   URL       : ${m.url}`);
    console.log(`\n   → Response angle: ${responseAngle(m)}`);
    console.log('\n' + '─'.repeat(60));
  });

  if (limit && matches.length > limit) {
    console.log(`\n  ... and ${matches.length - limit} more. Run without --top to see all.`);
  }

  console.log(`\nTo act: visit the URL, leave a genuine helpful comment.`);
  console.log(`Don't pitch. Add value first. Mention SoloFloor only if directly relevant.\n`);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
let matches = load();

const topArg  = process.argv.indexOf('--top');
const newFlag = process.argv.includes('--new');
const limit   = topArg !== -1 ? parseInt(process.argv[topArg + 1], 10) || 10 : null;

if (newFlag) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  matches = matches.filter(m => new Date(m.found).getTime() > cutoff);
  console.log(`Filtered to last 24 hours: ${matches.length} matches`);
}

// Sort by score desc, then by recency
matches.sort((a, b) => b.score - a.score || new Date(b.found) - new Date(a.found));

print(matches, limit);
