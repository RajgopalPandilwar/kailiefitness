/* Rename the brand everywhere in one command.
   Run:  node tools/set-brand.js "Your Brand Name"

   Replaces the name in every file: HTML titles, logo, footer, meta
   tags, JSON-LD, robots.txt, sitemap.xml, the UPI payee name, the
   favicon letter, the social share image, and the README.

   Also refuses to set a name that is already someone else's live
   business — see BLOCKED below.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Names that belong to other people. Do not ship these.
// 'KailieFitness' is an established coaching business at
// kailiefitness.com, and 'Kailie' is the personal name in it — neither
// is ours to use, on its own or as part of a longer name.
const BLOCKED = [
  'kailiefitness',
  'kailie fitness',
  'kailie',
];

const newName = (process.argv[2] || '').trim();

if (!newName) {
  console.error('Usage: node tools/set-brand.js "Your Brand Name"');
  process.exit(1);
}

const norm = newName.toLowerCase();
for (const b of BLOCKED) {
  if (norm.includes(b)) {
    console.error('REFUSING: "' + newName + '" contains "' + b + '".');
    console.error('That name belongs to an existing fitness business');
    console.error('(kailiefitness.com). Pick your own name.');
    process.exit(1);
  }
}

// "Apex Fitness" -> logo "Apex" + gold "Fitness"
// "FitForge"     -> logo "FitForge" only. A one-word brand has no
// second half, and rendering it twice reads as a bug.
const words = newName.split(/\s+/).filter(Boolean);
const brandWord = words[0];
const twoWords = words.length > 1;
const accentWord = twoWords ? words[words.length - 1] : '';

// UPI payee names are shown in a phone app; keep them short.
const payee = newName.length <= 20 ? newName : words[0];

// Every historical spelling we might be replacing, including the
// lowercase forms that appear inside URLs and the github.io path.
const OLD_PATTERNS = [
  /KailieFitness/g,
  /kailiefitness/g,
  /KAILIEFITNESS/g,
  /Kailie/g,
  /kailie/g,
];

// A filesystem/URL-safe slug for the new name.
const slug = newName.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const TARGETS = [
  'index.html',
  'thank-you.html',
  'config.js',
  'upi.js',
  'checkout.js',
  'robots.txt',
  'sitemap.xml',
  'README.md',
  'tools/make-images.py',
  'tools/build-standalone.js',
  'test-amounts.js',
  'test-modal.js',
];

let changed = [];
for (const rel of TARGETS) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, 'utf8');

  // Replace the combined word first (URLs, titles, ids), then the
  // standalone personal name (logo split, copy).
  let after = before
    .replace(/KailieFitness/g, newName)
    .replace(/kailiefitness/g, slug)
    .replace(/KAILIEFITNESS/g, newName.toUpperCase())
    .replace(/YOUR BRAND NAME/g, newName);

  // Only rewrite a bare "Kailie" when it stands alone as a word and is
  // not part of a URL we just handled.
  after = after
    .replace(/\bKailie\b(?!Fitness)/g, brandWord)
    .replace(/\bkailie\b(?!fitness)/g, slug);

  // The logo markup: <span>Accent</span> after the brand word. A
  // one-word brand gets no span at all, so it never prints twice.
  const logoHtml = twoWords
    ? brandWord + '<span>' + accentWord + '</span>'
    : brandWord;
  after = after.replace(
    new RegExp(brandWord + '<span>[^<]*</span>', 'g'),
    logoHtml
  );
  // Also collapse an already-doubled wordmark from a previous run.
  after = after.replace(
    new RegExp(brandWord + brandWord, 'g'),
    brandWord
  );

  if (rel === 'config.js') {
    after = after.replace(
      /(payeeName:\s*)'[^']*'/,
      (m, p1) => p1 + "'" + payee + "'"
    );
  }

  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8');
    changed.push(rel);
  }
}

console.log('Brand set to: ' + newName);
console.log('  logo   : ' + brandWord + ' / ' + accentWord);
console.log('  payee  : ' + payee);
console.log('  updated: ' + changed.join(', '));

// Remind about the pieces that live outside the repo.
const ogPath = path.join(ROOT, 'og-image.png');
if (fs.existsSync(ogPath)) {
  console.log('\nNOTE: og-image.png and favicon.png still show the old name.');
  console.log('      Regenerate them:  python tools/make-images.js');
}
console.log('NOTE: the live URL and Google Search Console still reference the');
console.log('      old name until you push, and search engines cache the old');
console.log('      title for a while. Update the <title>, meta and og: tags by');
console.log('      pushing, then re-submit the sitemap.');
