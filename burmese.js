// ═══ BURMESE TRANSLITERATION ENGINE ═══
// Uses character-by-character mapping with longest-match-first
// Source: burmese.js consonant/vowel/medial/final/combination tables

// ─── CHARACTER TABLES ───


const CONSONANTS = [
  { char: 'က', roman: 'ka', dev: 'क' },
  { char: 'ခ', roman: 'kha', dev: 'ख' },
  { char: 'ဂ', roman: 'ga', dev: 'ग' },
  { char: 'ဃ', roman: 'gha', dev: 'घ' },
  { char: 'င', roman: 'nga', dev: 'ङ' },
  { char: 'ငြ', roman: 'ngra', dev: 'ङ' },
  { char: 'ကျ', roman: 'kya', dev: 'च' },
  { char: 'ကြ', roman: 'kra', dev: 'च' },
  { char: 'ချ', roman: 'khya', dev: 'छ' },
  { char: 'ခြ', roman: 'khra', dev: 'छ' },
  { char: 'ဇ', roman: 'ja', dev: 'ज' },
  { char: 'ဂျ', roman: 'gya', dev: 'ज' },
  { char: 'ဈ', roman: 'jha', dev: 'झ' },
  { char: 'ဂြ', roman: 'gra', dev: 'झ' },
  { char: 'ဉ ', roman: 'nya', dev: 'ञ' },
  { char: 'ဉ', roman: 'nya', dev: 'ञ' },
  { char: 'ည', roman: 'nyya', dev: 'ञ' },
  { char: 'ဋ', roman: 'ṭa', dev: 'ट' },
  { char: 'ဌ', roman: 'ṭha', dev: 'ठ' },
  { char: 'ဍ', roman: 'ḍa', dev: 'ड' },
  { char: 'ဎ', roman: 'ḍha', dev: 'ढ' },
  { char: 'ဏ', roman: 'ṇa', dev: 'ण' },
  { char: 'တ', roman: 'ta', dev: 'त' },
  { char: 'ထ', roman: 'tha', dev: 'थ' },
  { char: 'သ', roman: 'sa', dev: 'थ' },
  { char: 'ဒ', roman: 'da', dev: 'द' },
  { char: 'ဓ', roman: 'dha', dev: 'ध' },
  { char: 'န', roman: 'na', dev: 'न' },
  { char: 'ပ', roman: 'pa', dev: 'प' },
  { char: 'ဖ', roman: 'pha', dev: 'फ' },
  { char: 'ဗ', roman: 'ba', dev: 'ब' },
  { char: 'ဘ', roman: 'bha', dev: 'भ' },
  { char: 'မ', roman: 'ma', dev: 'म' },
  { char: 'ယ', roman: 'ya', dev: 'य' },
  { char: 'ရ', roman: 'ya', dev: 'य' },
  { char: 'လ', roman: 'la', dev: 'ल' },
  { char: 'ဝ', roman: 'wa', dev: 'व' },
  { char: 'ရှ', roman: 'sha', dev: 'श' },
  { char: 'စ', roman: 'ca', dev: 'स' },
  { char: 'ဆ', roman: 'cha', dev: 'स' },
  { char: 'ဿ', roman: 'ssa', dev: 'स्स' },
  { char: 'ဟ', roman: 'ha', dev: 'ह' },
  { char: 'ဠ', roman: 'ḷa', dev: 'ळ' },
  { char: 'အ', roman: 'a', dev: 'अ' },
  // Independent vowels
  { char: 'ဥ', roman: 'u', dev: 'उ' },
  { char: 'ဦ', roman: 'ū', dev: 'ऊ' },
  { char: 'ဧ', roman: 'e', dev: 'ए' },
  { char: 'ဣ', roman: 'i', dev: 'इ' },
  { char: 'ဤ', roman: 'ī', dev: 'ई' },
  { char: 'ဩ', roman: 'o', dev: 'ओ' },
  { char: 'ဪ', roman: 'au', dev: 'औ' },
];

const VOWELS = [
  { char: 'ါ', roman: 'ā', dev: 'ा' },
  { char: 'ာ', roman: 'ā', dev: 'ा' },
  { char: 'ိ', roman: 'i', dev: 'ि' },
  { char: 'ီ', roman: 'ī', dev: 'ी' },
  { char: 'ု', roman: 'u', dev: 'ु' },
  { char: 'ူ', roman: 'ū', dev: 'ू' },
  { char: 'ေ', roman: 'e', dev: 'े' },
  { char: 'ဲ', roman: 'ai', dev: 'ै' },
  { char: 'ော', roman: 'o', dev: 'ो' },
  { char: 'ို', roman: 'o', dev: 'ो' },
];

const MEDIALS = [
  { char: 'ျ', roman: 'y', dev: '्य' },
  { char: 'ြ', roman: 'y', dev: '्य' },
  { char: 'ွ', roman: 'w', dev: '्व' },
  { char: 'ှ', roman: 'h', dev: '्ह' },
];

const FINALS = [
  { char: '်', roman: '', dev: '्' },
  { char: 'ံ', roman: 'ṃ', dev: 'ं' },
  { char: '့', roman: '', dev: '\u200B' },
  { char: 'း', roman: 'ḥ', dev: 'ः' },
  { char: '္', roman: '', dev: '्' },
  { char: '။', roman: '.', dev: '।' },
  { char: '၊', roman: ',', dev: ',' },
];

const COMBINATIONS = [
  { char: 'ောင်', dev: 'ौंग्' },
  { char: 'ိုင်', dev: 'ैंग्' },
  { char: 'ောက်', dev: 'ौक्' },
  { char: 'ိုက်', dev: 'ैक्' },
  { char: 'ော်', dev: 'ो' },   // "aw" vowel — asat is part of the vowel, not a virama
  { char: 'ုံ', dev: 'ुं' },
  { char: 'ိန်', dev: 'िन्' },
  { char: 'ိမ်', dev: 'िम्' },
  { char: 'ိတ်', dev: 'ित्' },
  { char: 'ိပ်', dev: 'िप्' },
  { char: 'ိက်', dev: 'िक्' },
  { char: 'ုတ်', dev: 'ुत्' },
  { char: 'ုပ်', dev: 'ुप्' },
  { char: 'ုက်', dev: 'ुक्' },
  { char: 'န်', dev: 'न्' },
  { char: 'မ်', dev: 'म्' },
  { char: 'တ်', dev: 'त्' },
  { char: 'ပ်', dev: 'प्' },
  { char: 'က်', dev: 'क्' },
  { char: 'င်', dev: 'ं' },
  { char: 'င်္', dev: 'ं' },
  { char: 'ွန်', dev: 'ुन' },
  { char: 'ုန်', dev: 'ोन' },
  // Vocalic finals — a killed consonant that is really a vowel, not a coda
  { char: 'ည်', dev: 'ी' },   // ‑ည် ≈ [i]  (ချည် chi, ကြည် kyi)
  { char: 'ဉ်', dev: 'ी' },   // ‑ဉ် ≈ [i]
  { char: 'ယ်', dev: 'ै' },   // ‑ယ် ≈ [ɛ]  (ဘယ် bè)
  // Stacked consonant combinations
  { char: '္မ', dev: '्म' },
  { char: '္က', dev: '्क' },
  { char: '္စ', dev: '्स' },
  { char: '္ခ', dev: '्ख' },
  { char: '္ဂ', dev: '्ग' },
  { char: '္တ', dev: '्त' },
  { char: '္ဒ', dev: '्द' },
  { char: '္ပ', dev: '्प' },
  { char: '္ဗ', dev: '्ब' },
  { char: '္န', dev: '्न' },
  { char: '္လ', dev: '्ल' },
  { char: '္သ', dev: '्थ' },
];

// ─── BUILD LOOKUP (longest-match-first) ───

const allMappings = {};

// Add combinations first (they are multi-char sequences)
for (const c of COMBINATIONS) allMappings[c.char] = c.dev;
// Add consonants (some are multi-char like ကျ, ကြ, ရှ)
for (const c of CONSONANTS) allMappings[c.char] = c.dev;
// Add vowels
for (const v of VOWELS) allMappings[v.char] = v.dev;
// Add medials
for (const m of MEDIALS) allMappings[m.char] = m.dev;
// Add finals
for (const f of FINALS) allMappings[f.char] = f.dev;

// Sort keys longest first for greedy matching
const sortedKeys = Object.keys(allMappings).sort((a, b) => b.length - a.length);

// ─── TRANSLITERATION FUNCTION ───

export function toDev(burmese, isLoanword = false) {
  if (!burmese) return '';
  let result = '';
  let i = 0;
  const text = burmese.trim();

  while (i < text.length) {
    let matched = false;
    for (const key of sortedKeys) {
      if (text.startsWith(key, i)) {
        let dev = allMappings[key];
        // Loanwords: standalone ရ → र (English r sound)
        // Native words keep default ရ → य
        if (isLoanword && key === 'ရ') dev = 'र';
        result += dev;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Pass through non-Myanmar characters (spaces, numbers, etc.)
      result += text[i];
      i++;
    }
  }
  return result;
}

// ─── SYLLABLE BREAKDOWN ───

export function breakSyllables(word) {
  if (!word) return [];
  const syllables = [];
  let current = '';

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const code = ch.charCodeAt(0);

    // Myanmar consonant range: U+1000 - U+1021
    if (code >= 0x1000 && code <= 0x1021 && current.length > 0) {
      const next = word[i + 1];
      const nextCode = next ? next.charCodeAt(0) : 0;
      // A base consonant opens a NEW syllable unless it is a killed coda
      // (next is asat ် U+103A or stacker ္ U+1039) or the lower member of a
      // stack (prev char is the stacker ္). Medials attach to their own onset.
      const nextIsKiller = nextCode === 0x103A || nextCode === 0x1039;
      const prevIsStacker = current[current.length - 1] === '္';
      if (!nextIsKiller && !prevIsStacker) {
        syllables.push(current);
        current = ch;
        continue;
      }
    }
    current += ch;
  }
  if (current) syllables.push(current);
  return syllables;
}

// ═══ TONE + SANDHI LAYER (added) ═══
// Source: Burmese_Characters_R005.xlsx (Vowels_tones tone columns, Intermediate
// voicing columns L/N). Everything below is additive to the original engine.

// ─── TONE DETECTION ───

const ASAT   = '်'; // ်  killer / final marker
const DOTBLW = '့'; // ့  creaky-tone dot (auk myit)
const VISRG  = 'း'; // း  high-tone visarga (shay htoe)
const ANUSV  = 'ံ'; // ◌ံ anusvara nasal
const STACK  = '္'; // ္  stacker

// Nasal final consonants — a syllable ending C+ASAT with one of these is a
// NASAL (sonorant) coda, NOT a glottal-stop / checked syllable.
const NASAL_FINALS = new Set(['င', 'ဉ', 'ည', 'ဏ', 'န', 'မ']);
// Vocalic finals: a killed ည/ဉ/ယ at syllable end is a VOWEL, not a coda →
// the syllable is OPEN (low tone, and triggers voicing of the next onset).
const VOCALIC_FINALS = new Set(['ည', 'ဉ', 'ယ']);
function endsWithVocalicFinal(syl) {
  const base = syl.endsWith(ASAT) ? syl[syl.length - 2] : '';
  return VOCALIC_FINALS.has(base);
}

// Low-tone (tone 2) vowel signs. Short ိ ု are creaky (tone 1); their long
// partners ီ ူ and the open signs ာ ေ are low. 'ို' is tested before bare ု.
const LOW_SIGNS = ['ို', 'ာ', 'ါ', 'ီ', 'ူ', 'ေ'];

// Is this syllable "checked" (ends in a stop + asat, e.g. ‑က် ‑တ် ‑ပ် ‑စ်)?
// Nasal finals (‑န် …) and the aw-vowel ‑ော် are open/sonorant → not checked.
export function isChecked(syl) {
  if (!syl.endsWith(ASAT)) return false;
  const base = syl[syl.length - 2];
  if (!base) return false;
  const code = base.charCodeAt(0);
  if (code < 0x1000 || code > 0x1021) return false; // vowel before asat (‑ော්)
  if (VOCALIC_FINALS.has(base)) return false;        // ‑ည် ‑ဉ် ‑ယ် are vowels
  return !NASAL_FINALS.has(base);
}

function hasNasalCoda(syl) {
  if (syl.includes(ANUSV)) return true;
  if (syl.endsWith(ASAT) && NASAL_FINALS.has(syl[syl.length - 2])) return true;
  return false;
}

// Lexical tone of one syllable: 1 (creaky), 2 (low), 3 (high), 'k' (checked).
export function detectTone(syl) {
  if (syl.includes(DOTBLW)) return 1;                 // ့  creaky always wins
  if (syl.includes(VISRG))  return 3;                 // း  high
  if (isChecked(syl))       return 'k';               // glottal-stop syllable
  if (syl.includes('ော'))   return syl.includes('ော' + ASAT) ? 2 : 3; // ‑ော် low, ‑ော high
  if (syl.includes('ဲ'))    return 3;                 // ‑ဲ default high
  if (LOW_SIGNS.some(s => syl.includes(s))) return 2;
  if (hasNasalCoda(syl) || endsWithVocalicFinal(syl)) return 2; // nasal/vocalic final = low
  return 1;                                           // bare inherent / short ိ ု = creaky
}

// ─── SANDHI VOICING ───
// onset Burmese cluster → { plain, voiced } Devanagari. Defaults follow the
// xlsx (Intermediate L/N) plus the regular-rule additions ဖ→ब, ကျ/ချ→ज, သ→ध.
// Edit here to change voicing output.
const VOICING = [
  { on: 'ကျ', plain: 'च', voiced: 'ज' },
  { on: 'ကြ', plain: 'च', voiced: 'ज' },
  { on: 'ချ', plain: 'छ', voiced: 'ज' },
  { on: 'ခြ', plain: 'छ', voiced: 'ज' },
  { on: 'က',  plain: 'क', voiced: 'ग' },
  { on: 'ခ',  plain: 'ख', voiced: 'ग' },
  { on: 'စ',  plain: 'स', voiced: 'ज़' }, // /s/ → /z/  (xlsx used झ)
  { on: 'ဆ',  plain: 'स', voiced: 'ज़' },
  { on: 'တ',  plain: 'त', voiced: 'द' },
  { on: 'ထ',  plain: 'थ', voiced: 'द' },
  { on: 'ပ',  plain: 'प', voiced: 'ब' },
  { on: 'ဖ',  plain: 'फ', voiced: 'ब' }, // /pʰ/ → /b/  (xlsx left फ)
  { on: 'သ',  plain: 'थ', voiced: 'ध' }, // /θ/ → /ð/   (approx.)
].sort((a, b) => b.on.length - a.on.length);

function matchOnset(syl) {
  for (const v of VOICING) if (syl.startsWith(v.on)) return v;
  return null;
}

// ─── HIGH-LEVEL PRONUNCIATION ───

const TONE_SUP = { 1: '1', 2: '2', 3: '3', k: '' };

// Analyse one orthographic word → [{ burmese, dev, tone, checked, voiced }].
export function analyzeWord(word, { sandhi = true, loanword = false } = {}) {
  const syls = breakSyllables(word);
  const out = [];
  let prevTriggers = false; // previous syllable open/nasal → voices this onset
  for (let i = 0; i < syls.length; i++) {
    const syl = syls[i];
    let dev = toDev(syl, loanword);
    const tone = detectTone(syl);
    const checked = tone === 'k';
    let voiced = false;
    if (sandhi && prevTriggers) {
      const m = matchOnset(syl);
      if (m && dev.startsWith(m.plain)) {
        dev = m.voiced + dev.slice(m.plain.length);
        voiced = true;
      }
    }
    out.push({ burmese: syl, dev, tone, checked, voiced });
    prevTriggers = !checked; // checked (glottal stop) blocks next-onset voicing
  }
  return out;
}

// Full Devanagari pronunciation string.
// opts: { sandhi=true, tones=true, loanword=false, sep='' }
export function toPronunciation(burmese, opts = {}) {
  const { sandhi = true, tones = true, loanword = false, sep = '' } = opts;
  if (!burmese) return '';
  const tokens = burmese.split(/(\s+|[။၊])/); // never voice across a boundary
  let result = '';
  for (const tok of tokens) {
    if (!tok) continue;
    if (/^\s+$/.test(tok) || tok === '။' || tok === '၊') { result += tok; continue; }
    const parts = analyzeWord(tok, { sandhi, loanword }).map(s =>
      tones && s.tone !== 'k' ? s.dev + TONE_SUP[s.tone] : s.dev
    );
    result += parts.join(sep);
  }
  return result;
}
