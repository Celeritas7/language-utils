// ═══ TELUGU TRANSLITERATION ENGINE ═══
// Character-by-character mapping, longest-match-first (same pattern as sinhala.js).
// Telugu is phonemic — no positional voicing rules needed.
// Exports: toDev(text), breakSyllables(word), toPronunciation (alias of toDev)

const CONSONANTS = [
  { char: 'క', dev: 'क' }, { char: 'ఖ', dev: 'ख' }, { char: 'గ', dev: 'ग' }, { char: 'ఘ', dev: 'घ' }, { char: 'ఙ', dev: 'ङ' },
  { char: 'చ', dev: 'च' }, { char: 'ఛ', dev: 'छ' }, { char: 'జ', dev: 'ज' }, { char: 'ఝ', dev: 'झ' }, { char: 'ఞ', dev: 'ञ' },
  { char: 'ట', dev: 'ट' }, { char: 'ఠ', dev: 'ठ' }, { char: 'డ', dev: 'ड' }, { char: 'ఢ', dev: 'ढ' }, { char: 'ణ', dev: 'ण' },
  { char: 'త', dev: 'त' }, { char: 'థ', dev: 'थ' }, { char: 'ద', dev: 'द' }, { char: 'ధ', dev: 'ध' }, { char: 'న', dev: 'न' },
  { char: 'ప', dev: 'प' }, { char: 'ఫ', dev: 'फ' }, { char: 'బ', dev: 'ब' }, { char: 'భ', dev: 'भ' }, { char: 'మ', dev: 'म' },
  { char: 'య', dev: 'य' }, { char: 'ర', dev: 'र' }, { char: 'ఱ', dev: 'ऱ' }, { char: 'ల', dev: 'ल' }, { char: 'ళ', dev: 'ळ' }, { char: 'వ', dev: 'व' },
  { char: 'శ', dev: 'श' }, { char: 'ష', dev: 'ष' }, { char: 'స', dev: 'स' }, { char: 'హ', dev: 'ह' },
  // Independent vowels
  { char: 'అ', dev: 'अ' }, { char: 'ఆ', dev: 'आ' }, { char: 'ఇ', dev: 'इ' }, { char: 'ఈ', dev: 'ई' }, { char: 'ఉ', dev: 'उ' }, { char: 'ఊ', dev: 'ऊ' },
  { char: 'ఋ', dev: 'ऋ' }, { char: 'ౠ', dev: 'ॠ' }, { char: 'ఎ', dev: 'ए' }, { char: 'ఏ', dev: 'ए' }, { char: 'ఐ', dev: 'ऐ' },
  { char: 'ఒ', dev: 'ओ' }, { char: 'ఓ', dev: 'ओ' }, { char: 'ఔ', dev: 'औ' },
];

const VOWELS = [
  { char: 'ా', dev: 'ा' }, { char: 'ి', dev: 'ि' }, { char: 'ీ', dev: 'ी' }, { char: 'ు', dev: 'ु' }, { char: 'ూ', dev: 'ू' },
  { char: 'ృ', dev: 'ृ' }, { char: 'ౄ', dev: 'ॄ' }, { char: 'ె', dev: 'े' }, { char: 'ే', dev: 'े' }, { char: 'ై', dev: 'ै' },
  { char: 'ొ', dev: 'ो' }, { char: 'ో', dev: 'ो' }, { char: 'ౌ', dev: 'ौ' },
];

const FINALS = [
  { char: '్', dev: '्' },   // virama
  { char: 'ం', dev: 'ं' },   // anusvara
  { char: 'ఁ', dev: 'ँ' },   // candrabindu
  { char: 'ః', dev: 'ः' },   // visarga
];

const COMBINATIONS = [
  { char: 'క్ష', dev: 'क्ष' },
  { char: 'జ్ఞ', dev: 'ज्ञ' },
];

const DIGITS = { '౦': '०', '౧': '१', '౨': '२', '౩': '३', '౪': '४', '౫': '५', '౬': '६', '౭': '७', '౮': '८', '౯': '९' };

// ─── BUILD LOOKUP (longest-match-first) ───
const allMappings = {};
for (const c of COMBINATIONS) allMappings[c.char] = c.dev;
for (const c of CONSONANTS) allMappings[c.char] = c.dev;
for (const v of VOWELS) allMappings[v.char] = v.dev;
for (const f of FINALS) allMappings[f.char] = f.dev;
for (const d in DIGITS) allMappings[d] = DIGITS[d];
const sortedKeys = Object.keys(allMappings).sort((a, b) => b.length - a.length);

export function toDev(telugu) {
  if (!telugu) return '';
  const text = telugu.normalize('NFC').trim();
  let result = '';
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const key of sortedKeys) {
      if (text.startsWith(key, i)) { result += allMappings[key]; i += key.length; matched = true; break; }
    }
    if (!matched) { result += text[i]; i++; }
  }
  return result;
}

// ─── SYLLABLE BREAKDOWN ───
export function breakSyllables(word) {
  if (!word) return [];
  const text = word.normalize('NFC');
  const syllables = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.codePointAt(0);
    // Telugu independent vowels U+0C05–0C14, consonants U+0C15–0C39
    const startsSyllable = code >= 0x0C05 && code <= 0x0C39;
    if (startsSyllable && current && !current.endsWith('్')) { syllables.push(current); current = ch; continue; }
    current += ch;
  }
  if (current) syllables.push(current);
  return syllables;
}

export const toPronunciation = toDev;
