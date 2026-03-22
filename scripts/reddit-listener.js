/**
 * SoloFloor — Reddit Listener
 *
 * Three modes of operation:
 *
 * 1. NEW MATCH — fresh post/comment matching keywords
 *    → generates a first-touch draft comment (no product mention)
 *
 * 2. REPLY ACTIVITY — someone replied to our comment (sixmonthrunway)
 *    → generates a follow-up draft that can naturally introduce the system/PDF
 *
 * 3. NO ACTIVITY on a post we already commented on → skip
 *
 * Usage:
 *   node scripts/reddit-listener.js          # runs every 15 min
 *   node scripts/reddit-listener.js --once   # single scan and exit
 *
 * Requires: ANTHROPIC_API_KEY env var
 */

const fs        = require('fs');
const path      = require('path');
const { exec, execSync } = require('child_process');
const readline  = require('readline');
const Anthropic = require('@anthropic-ai/sdk');

const SEEN_PATH      = path.join(__dirname, '../.reddit-seen.json');
const MATCHES_PATH   = path.join(__dirname, '../logs/reddit-matches.json');
const COMMENTED_PATH = path.join(__dirname, '../logs/commented-posts.json');
const DRAFTS_DIR     = path.join(__dirname, '../logs/drafts');
const INTERVAL_MS    = 15 * 60 * 1000;

const OUR_USERNAME = 'sixmonthrunway';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── TARGET SUBREDDITS ───────────────────────────────────────────────────────
const SUBREDDITS = [
  'freelance',
  'freelanceWriters',
  'freelancers',
  'digitalnomad',
  'personalfinance',
  'entrepreneur',
  'smallbusiness',
  'webdev',
  'graphic_design',
  'marketing',
  'copywriting',
  'consulting',
  'forhire',
];

// ─── SIGNAL KEYWORDS ─────────────────────────────────────────────────────────
const SIGNALS = [
  ['feast and famine',      2],
  ['feast or famine',       2],
  ['invoice to invoice',    2],
  ['lumpy income',          2],
  ['inconsistent income',   2],
  ['irregular income',      2],
  ['unpredictable income',  2],
  ['variable income',       2],
  ["can't pay myself",      2],
  ['cant pay myself',       2],
  ['pay myself',            2],
  ['slow month',            2],
  ['dry spell',             2],
  ['slow season',           2],
  ['cash flow',             1],
  ['emergency fund',        1],
  ['save for taxes',        1],
  ['quarterly taxes',       1],
  ['self employment tax',   1],
  ['freelance budget',      1],
  ['financial stress',      1],
  ['no clients',            1],
  ['lost a client',         1],
  ['between projects',      1],
  ['income gap',            1],
  ['saving as a freelancer',1],
  ['living paycheck',       1],
];

function scoreText(text) {
  const lower = text.toLowerCase();
  const matched = [];
  let total = 0;
  for (const [phrase, weight] of SIGNALS) {
    if (lower.includes(phrase)) { matched.push(phrase); total += weight; }
  }
  return { total, matched };
}

// ─── REDDIT API ───────────────────────────────────────────────────────────────
const HEADERS = {
  'User-Agent': 'SoloFloor-Listener/1.0 (market-research; contact: hello@solofloor.io)',
};

async function redditGet(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 429) throw new Error('rate limited');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function searchReddit(query, timeframe = 'month') {
  const q = encodeURIComponent(`"${query}"`);
  const subs = SUBREDDITS.map(s => `subreddit:${s}`).join(' OR ');
  const url = `https://www.reddit.com/search.json?q=${q}+%28${encodeURIComponent(subs)}%29&sort=new&t=${timeframe}&limit=25&type=link`;
  const data = await redditGet(url);
  return data.data.children.map(c => c.data);
}

async function fetchFullPost(permalink) {
  const clean = permalink.replace('https://www.reddit.com', '').replace('https://reddit.com', '').replace(/\/$/, '');
  const data  = await redditGet(`https://www.reddit.com${clean}.json?limit=25`);
  const post  = data[0].data.children[0].data;

  // Flatten all comments including nested replies
  function flattenComments(children) {
    const results = [];
    for (const child of children) {
      if (!child.data || !child.data.body) continue;
      results.push(child.data);
      if (child.data.replies && child.data.replies.data) {
        results.push(...flattenComments(child.data.replies.data.children));
      }
    }
    return results;
  }

  const allComments = flattenComments(data[1].data.children);
  return { post, allComments };
}

// Find our comment in a post and any replies to it
async function checkForReplies(commentedPost) {
  const { post, allComments } = await fetchFullPost(commentedPost.postUrl);

  // Find our comment
  const ourComment = allComments.find(c => c.author === OUR_USERNAME);
  if (!ourComment) return null;

  // Find replies to our comment
  const replies = allComments.filter(c =>
    c.parent_id === `t1_${ourComment.id}` && c.author !== OUR_USERNAME
  );

  if (replies.length === 0) return null;

  // Only return if there are NEW replies since last check
  const lastCheckedReplyCount = commentedPost.replyCount || 0;
  if (replies.length <= lastCheckedReplyCount) return null;

  return { post, allComments, ourComment, replies, newReplies: replies.slice(lastCheckedReplyCount) };
}

// ─── COMMENT GENERATION ──────────────────────────────────────────────────────
async function generateFirstComment(entry) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  console.log('  Fetching full post for draft...');
  const { post, allComments } = await fetchFullPost(entry.url.replace('https://reddit.com', ''));

  const topComments = allComments.slice(0, 8).map((c, i) => `Comment ${i + 1} by ${c.author}: ${c.body}`).join('\n\n');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are helping someone leave a genuine helpful comment on a Reddit post about freelancing finances. The commenter's username is ${OUR_USERNAME}.

POST TITLE: ${post.title}
POST BODY: ${post.selftext}

EXISTING COMMENTS:
${topComments}

Read the existing comments carefully. Notice the tone — is it frustrated, jokey, practical, overwhelmed? Match it exactly.

Write a single comment that:
- Reacts to something specific in the thread — a word someone used, a situation described, an assumption being made — not generically to the post title
- Sounds like a person dashing off a reply, not composing an answer. Rough edges are fine.
- Is 2-4 sentences. No more. Match the length of the other comments.
- Brings in ONE idea from personal experience: knowing your floor (the bare minimum you need each month), paying yourself a fixed amount regardless of what came in, or keeping a buffer so slow months don't feel like emergencies. Pick whichever fits the thread best — don't cram all three in.
- If the thread has humour or frustration, reflect that. Don't be relentlessly helpful and earnest if everyone else is venting.
- If reacting to a specific commenter's point, tag them naturally using u/username format (e.g. "the framing u/username used" or "what u/username said about X") — only do this if their comment is clearly not deleted
- Does NOT mention any product, tool, website, or SoloFloor
- Does NOT use em dashes — use commas or just end the sentence
- No bullet points, no headers, no "happy to share more" if it sounds tacked on — only add an open offer if it genuinely fits
- Never starts with "I" as the first word

Return only the comment text, nothing else.`
    }],
  });

  return msg.content[0].text.trim();
}

async function generateFollowUp(replyData) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const { post, ourComment, newReplies } = replyData;
  const replyTexts = newReplies.map((r, i) => `Reply ${i + 1} by ${r.author}: ${r.body}`).join('\n\n');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are helping someone follow up on a Reddit comment thread about freelancing finances. The commenter's username is ${OUR_USERNAME}.

ORIGINAL POST: ${post.title}

OUR PREVIOUS COMMENT: ${ourComment.body}

NEW REPLIES TO OUR COMMENT:
${replyTexts}

Write a follow-up reply that:
- Is one paragraph with no line breaks
- Responds directly and naturally to what they said
- Goes one level deeper on the system: the 5-account setup, paying yourself a fixed salary regardless of what came in, the tax set-aside, the 90-day buffer
- If they seem genuinely interested and ask for more detail, you can mention that you put together a short guide on this called the Feast and Famine Fix and offer to share where they can find it — but only if it feels completely natural and they have asked for more
- Otherwise do not mention any product at all
- No em dashes, no bullet points, one flowing paragraph
- Warm and direct, like a real person who has been through this

Return only the reply text, nothing else.`
    }],
  });

  return msg.content[0].text.trim();
}

// ─── DRAFT FILE ───────────────────────────────────────────────────────────────
function saveDraft(entry, comment, type = 'FIRST COMMENT') {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const DRAFT_PATH = path.join(DRAFTS_DIR, `draft-${timestamp}.txt`);

  const lines = [
    `TYPE: ${type}`,
    `POST: ${entry.title || entry.postTitle}`,
    `URL:  ${entry.url || entry.postUrl}`,
    `SUB:  r/${entry.sub}`,
    ``,
    `--- DRAFT COMMENT (copy everything below this line) ---`,
    ``,
    comment,
    ``,
    `--- NEXT STEP ---`,
    `1. Copy the comment above`,
    `2. Visit the URL and post it as u/${OUR_USERNAME}`,
    `3. Tell Claude "posted it" to register and get the next post`,
    ``,
    `--- META ---`,
    `Signal score : ${entry.score || 'n/a'}`,
    `Keywords     : ${(entry.keywords || []).join(', ')}`,
    `Generated    : ${new Date().toLocaleString()}`,
  ];

  fs.writeFileSync(DRAFT_PATH, lines.join('\n'));
  execSync(`open "${DRAFT_PATH}"`);
  console.log(`  Draft saved and opened: ${path.relative(process.cwd(), DRAFT_PATH)}`);
}

// ─── COMMENTED POSTS TRACKING ─────────────────────────────────────────────────
function loadCommented() {
  try { return JSON.parse(fs.readFileSync(COMMENTED_PATH, 'utf8')); }
  catch { return []; }
}

function saveCommented(list) {
  fs.mkdirSync(path.dirname(COMMENTED_PATH), { recursive: true });
  fs.writeFileSync(COMMENTED_PATH, JSON.stringify(list, null, 2));
}

// Call this manually to register a post you've commented on
// Or it's called automatically when a draft is generated for a new match
function registerCommentedPost(entry, seen) {
  const list = loadCommented();
  const existing = list.find(p => p.postId === entry.id);
  if (!existing) {
    list.unshift({
      postId:     entry.id,
      postTitle:  entry.title,
      postUrl:    entry.url,
      sub:        entry.sub,
      commentedAt: new Date().toISOString(),
      replyCount: 0,
      lastActivity: new Date().toISOString(),
    });
    saveCommented(list);
    if (seen) seen.add(entry.id);
    console.log(`  Registered post for reply monitoring: r/${entry.sub}`);
  }
}

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────
function loadSeen() {
  const ids = new Set();
  try { JSON.parse(fs.readFileSync(SEEN_PATH, 'utf8')).forEach(id => ids.add(id)); } catch {}
  // Always treat already-commented posts as seen
  try { JSON.parse(fs.readFileSync(COMMENTED_PATH, 'utf8')).forEach(p => ids.add(p.postId)); } catch {}
  return ids;
}

function saveSeen(seen) {
  fs.writeFileSync(SEEN_PATH, JSON.stringify([...seen].slice(-20000)));
}

function loadMatches() {
  try { return JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf8')); }
  catch { return []; }
}

function saveMatches(matches) {
  fs.mkdirSync(path.dirname(MATCHES_PATH), { recursive: true });
  fs.writeFileSync(MATCHES_PATH, JSON.stringify(matches.slice(0, 500), null, 2));
}

// ─── CORE SCAN ───────────────────────────────────────────────────────────────
// High-signal phrases to search for directly — weight-2 keywords only
const SEARCH_QUERIES = [
  'feast and famine freelance',
  'inconsistent income freelance',
  'irregular income freelance',
  'pay myself freelance',
  'cash flow self employed',
  'slow month freelance',
  'freelance budget',
];

async function scanForNewMatches(seen, matches) {
  let newCount = 0;

  for (const query of SEARCH_QUERIES) {
    try {
      console.log(`  Searching: "${query}"...`);
      const posts = await searchReddit(query, 'month');

      for (const post of posts) {
        if (seen.has(post.id)) continue;

        const { total, matched } = scoreText(`${post.title} ${post.selftext || ''}`);
        if (total >= 2) {
          const sub = post.subreddit;
          const entry = {
            type: 'post', sub, id: post.id,
            title:    post.title,
            snippet:  (post.selftext || '').slice(0, 400).trim(),
            url:      `https://reddit.com${post.permalink}`,
            score:    total, keywords: matched,
            upvotes:  post.score, comments: post.num_comments,
            posted:   new Date(post.created_utc * 1000).toISOString(),
            found:    new Date().toISOString(),
          };
          matches.unshift(entry);
          newCount++;
          printMatch(entry);

          try {
            const comment = await generateFirstComment(entry);
            if (comment) {
              seen.add(entry.id); // mark seen so we don't re-draft it
              saveDraft(entry, comment, 'FIRST COMMENT');
              return newCount + 1; // stop after one — run again for the next
            }
          } catch (err) {
            console.warn(`  ⚠  Draft generation failed: ${err.message}`);
          }
        }
      }

      await sleep(2000);

    } catch (err) {
      console.warn(`  ⚠  Search "${query}": ${err.message}`);
      if (err.message === 'rate limited') await sleep(90000);
    }
  }

  return newCount;
}

async function scanForReplies() {
  const commented = loadCommented();
  if (commented.length === 0) return 0;

  console.log(`  Checking ${commented.length} commented post(s) for replies...`);
  let replyCount = 0;

  for (const commentedPost of commented) {
    try {
      const replyData = await checkForReplies(commentedPost);

      if (replyData) {
        console.log(`\n💬 REPLY  r/${commentedPost.sub}  "${commentedPost.postTitle.slice(0, 60)}"`);
        replyData.newReplies.forEach(r => {
          console.log(`  ${r.author}: ${r.body.slice(0, 100)}...`);
        });

        const followUp = await generateFollowUp(replyData);
        if (followUp) {
          saveDraft(
            { title: commentedPost.postTitle, url: commentedPost.postUrl, sub: commentedPost.sub, keywords: [], score: 'reply' },
            followUp,
            'FOLLOW-UP REPLY'
          );
        }

        // Update reply count
        commentedPost.replyCount = replyData.replies.length;
        commentedPost.lastActivity = new Date().toISOString();
        replyCount++;
      } else {
        console.log(`  No new replies on r/${commentedPost.sub} — "${commentedPost.postTitle.slice(0, 50)}"`);
      }

      await sleep(1100);
    } catch (err) {
      console.warn(`  ⚠  Reply check failed for ${commentedPost.postUrl}: ${err.message}`);
    }
  }

  saveCommented(commented);
  return replyCount;
}

// ─── OUTPUT ───────────────────────────────────────────────────────────────────
function printMatch(entry) {
  const label = entry.type === 'post' ? '📌 POST' : '💬 COMMENT';
  console.log(`\n${label}  r/${entry.sub}  [signal: ${entry.score}]`);
  console.log(`  "${entry.title}"`);
  console.log(`  Keywords: ${entry.keywords.join(', ')}`);
  console.log(`  ${entry.url}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function waitForConfirm(entry, seen) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\n  → Visit: ${entry.url}`);
    rl.question('  Posted the comment? Press Enter to register it (or type "skip" to move on): ', answer => {
      rl.close();
      if (answer.trim().toLowerCase() !== 'skip') {
        seen.add(entry.id);
        const list = loadCommented();
        if (!list.find(p => p.postId === entry.id)) {
          list.unshift({ postId: entry.id, postTitle: entry.title, postUrl: entry.url, sub: entry.sub, commentedAt: new Date().toISOString(), replyCount: 0, lastActivity: new Date().toISOString() });
          saveCommented(list);
        }
        saveSeen(seen);
        console.log('  Registered for reply monitoring.\n');
      } else {
        console.log('  Skipped.\n');
      }
      resolve();
    });
  });
}
function timestamp() { return new Date().toLocaleTimeString('en-AU', { hour12: false }); }

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function run() {
  // --posted <url>  — register a URL as commented on (for reply monitoring)
  const postedIdx = process.argv.indexOf('--posted');
  if (postedIdx !== -1) {
    const url = process.argv[postedIdx + 1];
    if (!url) { console.error('Usage: --posted <url>'); process.exit(1); }
    const postId = url.split('/comments/')[1]?.split('/')[0] || url;
    const list = loadCommented();
    const alreadyIn = list.find(p => p.postUrl === url);
    if (!alreadyIn) {
      list.unshift({ postId, postTitle: url, postUrl: url, sub: url.split('/r/')[1]?.split('/')[0] || '?', commentedAt: new Date().toISOString(), replyCount: 0, lastActivity: new Date().toISOString() });
      saveCommented(list);
    }
    // Also mark as seen so it never gets re-drafted
    const seen = loadSeen();
    seen.add(postId);
    saveSeen(seen);
    console.log(`Registered for reply monitoring: ${url}`);
    return;
  }

  const once = process.argv.includes('--once');

  console.log('┌─────────────────────────────────────────────┐');
  console.log('│  SoloFloor — Reddit Listener                │');
  console.log('│  Monitoring freelancer financial pain        │');
  console.log('└─────────────────────────────────────────────┘');
  console.log(`Subreddits : ${SUBREDDITS.length} (search-scoped)`);
  console.log(`Searches   : ${SEARCH_QUERIES.length} queries × last month`);
  console.log(`Username   : ${OUR_USERNAME}`);
  console.log(`Mode       : ${once ? 'single scan' : 'continuous (every 15 min)'}`);
  console.log(`AI drafts  : ${process.env.ANTHROPIC_API_KEY ? 'enabled' : 'disabled (set ANTHROPIC_API_KEY)'}\n`);

  do {
    console.log(`[${timestamp()}] Scanning for new matches...`);
    const seen    = loadSeen();
    const matches = loadMatches();
    const newMatches = await scanForNewMatches(seen, matches);
    saveSeen(seen);
    saveMatches(matches);
    console.log(`  ${newMatches} new match(es)`);

    console.log(`\n[${timestamp()}] Checking commented posts for replies...`);
    const newReplies = await scanForReplies();
    console.log(`  ${newReplies} post(s) with new replies`);

    console.log(`\n[${timestamp()}] Done.`);

    if (!once) {
      console.log(`Next scan at ${new Date(Date.now() + INTERVAL_MS).toLocaleTimeString()}...\n`);
      await sleep(INTERVAL_MS);
    }
  } while (!once);
}

run().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
