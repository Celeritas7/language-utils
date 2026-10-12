// ═══ BURMESE TRANSLITERATION ENGINE ═══
// Single source of truth for Burmese → Devanagari conversion
// Uses longest-match-first algorithm
// R007: handles stacking mark ္ (U+1039), kinzi င်္, great-sa ဿ; tone marks no longer emit digits.
// R008: modern pronunciation — ရ → य, ြ medial = ျ (y), စ/ဆ → स, final nasals -န် -မ် -င် → nasalised vowel (ं),
//        ော် → ो, -က် after inherent a → ेक्, ိ before a stacked consonant → े.
//        Velar + ျ/ြ is palatalised: ကျ/ကြ → च, ချ/ခြ → छ, ဂျ/ဂြ → ज (ကျောင်း → चाउं).

const CM = { // Consonant Map
  'က':'क','ခ':'ख','ဂ':'ग','ဃ':'घ','င':'ङ',
  'စ':'स','ဆ':'स','ဇ':'ज','ဈ':'झ','ည':'ञ',
  'ဋ':'ट','ဌ':'ठ','ဍ':'ड','ဎ':'ढ','ဏ':'ण',
  'တ':'त','ထ':'थ','ဒ':'द','ဓ':'ध','န':'न',
  'ပ':'प','ဖ':'फ','ဗ':'ब','ဘ':'भ','မ':'म',
  'ယ':'य','ရ':'य','လ':'ल','ဝ':'व','သ':'थ',
  'ဟ':'ह','ဠ':'ळ','အ':'अ','ဿ':'थ्थ'
};

const CC = { // Conjunct Clusters
  'ကျ':'च','ကြ':'च','ကွ':'क्व','ကျွ':'च्व',
  'ချ':'छ','ခြ':'छ','ခွ':'ख्व',
  'ဂျ':'ज','ဂြ':'ज','ဂွ':'ग्व',
  'စျ':'स्य','ဆွ':'स्व',
  'တျ':'त्य','တြ':'त्य','တွ':'त्व',
  'ထွ':'थ्व','ဒွ':'द्व',
  'ပျ':'प्य','ပြ':'प्य','ပွ':'प्व',
  'ဖျ':'फ्य','ဖြ':'फ्य',
  'ဗျ':'ब्य','ဗြ':'ब्य','ဗွ':'ब्व',
  'ဘျ':'भ्य','ဘွ':'भ्व',
  'မျ':'म्य','မြ':'म्य','မွ':'म्व',
  'လျ':'ल्य','လွ':'ल्व',
  'သျ':'थ्य','သြ':'थ्य','သွ':'थ्व',
  'ဟွ':'ह्व','ရွ':'य्व',
  'ကြွ':'च्व','ချွ':'छ्व','ပြွ':'प्य्व','မြွ':'म्य्व',
  // Medial ha ှ (stored after the consonant): voiceless / sh sounds
  'ရှ':'श','ယှ':'श','လျှ':'श','မှ':'ह्म','နှ':'ह्न','လှ':'ह्ल','ငှ':'ह्ङ','ညှ':'ह्ञ','ဝှ':'ह्व',
  'ှ':'ह'
};

const VM = { // Vowel Map
  'ာ':'ा','ါ':'ा','ိ':'ि','ီ':'ी','ု':'ु','ူ':'ू',
  'ေ':'े','ဲ':'ै','ော':'ो','ို':'ो',
  'ံ':'ं','်':'्',
  'ွန်':'ुं','ွတ်':'ुत्','ွပ':'ुप','ွက်':'ुक्',
  'ိုက်':'ाइक्','ည်':'ी','ည့်':'ी','စ်':'ित्','ောက်':'ाउक्',
  // Final nasals = nasalised vowel, not a consonant
  'န်':'ं','မ်':'ं','ိန်':'ें','ိမ်':'ें','ုန်':'ों','ုမ်':'ों','င်':'िं','ောင်':'ाउं','ိုင်':'ाइं',
  // ော + asat (လိမ္မော်) is just the vowel ो
  'ော်':'ो',
  // Glottal-stop finals: -က် after inherent a is /ɛʔ/ (အနက် → अनेक्); ိက် /eɪʔ/, ုက် /oʊʔ/
  'က်':'ेक्','ိက်':'ेक्','ုက်':'ोक्',
  // ိ before a stacked consonant is /eɪ/ → े (လိမ္မော် → लेम्मो)
  'ိက္':'ेक्','ိစ္':'ेस्','ိတ္':'ेत्','ိဒ္':'ेद्','ိန္':'ेन्','ိပ္':'ेप्','ိမ္':'ेम्',
  // Stacking
  'င်္':'ं',   // kinzi — nasal carried onto the next (stacked) consonant
  '္':'्',     // stacking mark — lower consonant joins as a conjunct
  // Tone marks — no Devanagari equivalent; drop instead of emitting digits
  'း':'','့':''
};

const DIGITS = { '၀':'०','၁':'१','၂':'२','၃':'३','၄':'४','၅':'५','၆':'६','၇':'७','၈':'८','၉':'९' };

const OVR = { // Common overrides (colloquial voicing)
  'မြန်မာ':'म्यन्मा','ပါ':'बा','တယ်':'दे','လဲ':'ले',
  'ပြီ':'प्यी','ဘူး':'बू','လား':'ला',
  'ကောင်း':'काउं','ဟုတ်':'हुत्','ရောက်':'याउक्',
  'ချင်':'छिं','သွား':'थ्वा','စား':'सा'
};

// Build sorted key list (longest first) for each map
const allKeys = {};
for (const map of [OVR, CC, VM, CM, DIGITS]) {
  for (const k of Object.keys(map)) {
    allKeys[k] = map[k];
  }
}
const sortedKeys = Object.keys(allKeys).sort((a, b) => b.length - a.length);

export function toDev(burmese) {
  if (!burmese) return '';
  let result = '';
  let i = 0;
  const text = burmese.normalize('NFC').trim();

  while (i < text.length) {
    let matched = false;
    for (const key of sortedKeys) {
      if (text.startsWith(key, i)) {
        result += allKeys[key];
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += text[i];
      i++;
    }
  }
  // Collapse virama doubled by asat + stacking (e.g. ်္)
  return result.replace(/््+/g, '्');
}

// Syllable breakdown - splits a Burmese word into syllable components
export function breakSyllables(word) {
  if (!word) return [];
  const syllables = [];
  let current = '';

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const code = ch.charCodeAt(0);

    // Myanmar consonant range: U+1000 - U+1021 (+ ဿ U+103F)
    if (((code >= 0x1000 && code <= 0x1021) || code === 0x103F) && current.length > 0) {
      // A consonant followed by asat (်) or stacking mark (္) closes the previous syllable;
      // a consonant after ္ is the stacked lower half and stays in the cluster.
      const next = word[i + 1];
      if (next !== '်' && next !== '္' && !current.endsWith('္')) {
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

// Back-compat alias for older callers
export const toPronunciation = toDev;
