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
  { char: 'ရ', roman: 'ra', dev: 'र' },
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

export function toDev(burmese) {
  if (!burmese) return '';
  let result = '';
  let i = 0;
  const text = burmese.trim();

  while (i < text.length) {
    let matched = false;
    for (const key of sortedKeys) {
      if (text.startsWith(key, i)) {
        result += allMappings[key];
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
      // Don't split if next is a medial
      const isMedial = nextCode >= 0x103B && nextCode <= 0x103E;
      if (!current.endsWith('်') && !isMedial) {
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
