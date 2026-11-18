const test = require('node:test');
const assert = require('node:assert');
const { toHebrew, toGregorian, monthsOfYear, numeral } = require('./hebdate');

test('18.11.2026 is 8 Kislev 5787', () => {
  const h = toHebrew(new Date(2026, 10, 18));
  assert.deepStrictEqual([h.day, h.month, h.year], [8, 'כסלו', 5787]);
});
test('letters: 8 -> ח׳, 15 -> ט״ו, 16 -> ט״ז, 25 -> כ״ה, 5787 year part -> תשפ״ז', () => {
  assert.strictEqual(numeral(8), 'ח׳');
  assert.strictEqual(numeral(15), 'ט״ו');
  assert.strictEqual(numeral(16), 'ט״ז');
  assert.strictEqual(numeral(25), 'כ״ה');
  assert.strictEqual(numeral(787), 'תשפ״ז');
});
test('text in letters for 18.11.2026', () => {
  assert.strictEqual(toHebrew(new Date(2026, 10, 18)).letters, 'ח׳ בכסלו תשפ״ז');
});
test('25 Kislev 5787 is 5.12.2026 (Hanukkah day 1)', () => {
  const d = toGregorian(5787, 'כסלו', 25);
  assert.deepStrictEqual([d.getFullYear(), d.getMonth() + 1, d.getDate()], [2026, 12, 5]);
});
test('round trip over 3 years of days', () => {
  for (let i = 0; i < 1100; i += 7) {
    const g = new Date(2026, 0, 1 + i);
    const h = toHebrew(g);
    const back = toGregorian(h.year, h.month, h.day);
    assert.strictEqual(back.getTime(), g.getTime());
  }
});
test('leap year 5784 has 13 months, 5786 has 12', () => {
  assert.strictEqual(monthsOfYear(5784).length, 13);
  assert.strictEqual(monthsOfYear(5786).length, 12);
});
test('impossible date returns null (30 Cheshvan 5787 does not exist or Feb-like)', () => {
  assert.strictEqual(toGregorian(5787, 'כסלו', 45), null);
});
