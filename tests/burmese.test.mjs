// Run with: node --test tests/burmese.test.mjs
// The repository ships browser-ready ESM .js files without a package.json.
// Importing through a data URL lets Node test the module without changing
// how existing consumers resolve those files.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../burmese.js', import.meta.url), 'utf8');
const { toDev, toPronunciation, sandhi } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

const flaggedWords = [
  ['ပီဇာ', 'पीजा', 'पीझा'],
  ['ဒိန်ခဲ', 'देंखै', 'देंघे'],
  ['ကြက်ဥ', 'चेʼउ', "च'ऊ"],
  ['ဒိန်ချဥ်', 'देंछिं', "देंछ'"],
  ['ဟမ်ဘာဂါ', 'हंभागा', 'हॅभागा']
];

for (const [burmese, literal, preferred] of flaggedWords) {
  test(`learner pronunciation for ${burmese}`, () => {
    assert.equal(toPronunciation(burmese), preferred);
    assert.equal(toDev(burmese), literal, 'literal transliteration must not change');
    assert.equal(
      toPronunciation(burmese, { sandhi: false }),
      literal,
      'explicit literal mode must not use learner overrides'
    );
  });
}

test('learner overrides work for complete words in spaced text', () => {
  assert.equal(toPronunciation('  ပီဇာ  ဒိန်ခဲ  '), 'पीझा  देंघे');
});

test('rule-based pronunciation remains available without learner overrides', () => {
  assert.equal(sandhi('ဒိန်ခဲ'), 'ဒိန်ဂဲ');
  assert.equal(toPronunciation('ဒိန်ခဲ', { learnerOverrides: false }), 'देंगै');
});

test('unflagged words keep their existing pronunciation', () => {
  assert.equal(toPronunciation('ကောင်း'), 'काउं');
  assert.equal(toPronunciation(''), '');
  assert.equal(toPronunciation(null), '');
});
