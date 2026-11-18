// hebdate.js - Gregorian <-> Hebrew dates using the browser's built-in Hebrew calendar (Intl).
// Runs in browsers and in node (tests). No data leaves the machine.
(function (root) {
  const fmt = new Intl.DateTimeFormat('he-u-ca-hebrew-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });

  function parts(date) {
    const p = {};
    for (const x of fmt.formatToParts(date)) p[x.type] = x.value;
    return { day: Number(p.day), month: p.month, year: Number(p.year) };
  }

  // 1..999 as Hebrew letters (15 and 16 are written ט״ו and ט״ז, not י״ה / י״ו)
  function numeral(n) {
    const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    const hund = ['', 'ק', 'ר', 'ש', 'ת'];
    let out = '';
    let h = Math.floor(n / 100);
    while (h > 4) { out += 'ת'; h -= 4; }
    out += hund[h];
    let rest = n % 100;
    if (rest === 15) out += 'טו';
    else if (rest === 16) out += 'טז';
    else out += tens[Math.floor(rest / 10)] + ones[rest % 10];
    return out.length === 1 ? out + '׳' : out.slice(0, -1) + '״' + out.slice(-1);
  }

  function toHebrew(date) {
    const p = parts(date);
    const letters = `${numeral(p.day)} ב${p.month} ${numeral(p.year % 1000)}`;
    return { ...p, text: `${p.day} ב${p.month} ${p.year}`, letters };
  }

  // Walk the days of the Gregorian years that overlap Hebrew year y (Sept y-3761 to Oct y-3760).
  function eachDayOf(year, fn) {
    const start = new Date(year - 3761, 7, 1);
    for (let i = 0; i < 460; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const p = parts(d);
      if (p.year === year && fn(d, p) === true) return d;
    }
    return null;
  }

  function monthsOfYear(year) {
    const names = [];
    eachDayOf(year, (d, p) => { if (!names.includes(p.month)) names.push(p.month); });
    return names;
  }

  function toGregorian(year, month, day) {
    return eachDayOf(year, (d, p) => p.month === month && p.day === Number(day));
  }

  const api = { toHebrew, toGregorian, monthsOfYear, numeral };
  if (typeof module !== 'undefined') module.exports = api; else root.hebdate = api;
})(this);
