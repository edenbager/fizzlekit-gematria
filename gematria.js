// gematria.js - turns Hebrew text into number values. Runs in the browser and in node (for tests).
(function (root) {
  // base value of each letter; final forms (sofit) share the base value in "standard"
  const BASE = { 'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,'ק':100,'ר':200,'ש':300,'ת':400 };
  const FINAL = { 'ך':'כ', 'ם':'מ', 'ן':'נ', 'ף':'פ', 'ץ':'צ' };
  const FINAL_GADOL = { 'ך':500, 'ם':600, 'ן':700, 'ף':800, 'ץ':900 }; // "mispar gadol"
  const ORDER = 'אבגדהוזחטיכלמנסעפצקרשת';

  function gematria(text) {
    const letters = [];
    let standard = 0, gadol = 0, katan = 0, siduri = 0;
    for (const ch of String(text)) {              // niqqud, spaces, digits, Latin: skipped
      const base = FINAL[ch] || ch;
      if (!(base in BASE)) continue;
      const v = BASE[base];
      letters.push({ ch, value: v });
      standard += v;
      gadol += FINAL_GADOL[ch] || v;
      katan += Number(String(v)[0]);              // 10 -> 1, 300 -> 3 (drop the zeros)
      siduri += ORDER.indexOf(base) + 1;          // place in the alphabet, 1 to 22
    }
    return { standard, gadol, katan, siduri, letters };
  }

  if (typeof module !== 'undefined') module.exports = { gematria };
  else root.gematria = gematria;
})(this);
