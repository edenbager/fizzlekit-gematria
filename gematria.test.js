const test = require('node:test');
const assert = require('node:assert');
const { gematria } = require('./gematria');

test('shalom: standard 376, gadol 936, katan 16, siduri 52', () => {
  const r = gematria('שלום');
  assert.deepStrictEqual([r.standard, r.gadol, r.katan, r.siduri], [376, 936, 16, 52]);
});
test('alef bet gimel = 6 in every method except gadol/katan stay 6 too', () => {
  const r = gematria('אבג');
  assert.deepStrictEqual([r.standard, r.gadol, r.katan, r.siduri], [6, 6, 6, 6]);
});
test('ignores niqqud, spaces, digits and Latin letters', () => {
  assert.strictEqual(gematria('שָׁלוֹם abc 123').standard, 376);
});
test('empty input gives zeros and no letters', () => {
  const r = gematria('hello');
  assert.deepStrictEqual([r.standard, r.letters.length], [0, 0]);
});
test('letter breakdown lists each Hebrew letter with its value', () => {
  assert.deepStrictEqual(gematria('אי').letters, [{ ch: 'א', value: 1 }, { ch: 'י', value: 10 }]);
});
