/* Amount-parsing tests for the UPI checkout. Run: node test-amounts.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const el = () => ({
  style: { cssText: '' }, setAttribute() {}, getAttribute() { return null; },
  addEventListener() {}, appendChild() {}, querySelector() { return null; },
  querySelectorAll() { return [] },
  classList: { add() {}, remove() {}, toggle() { return false; }, contains() { return false; } },
  dataset: {}, textContent: '', value: '', hidden: false, innerHTML: ''
});
const doc = {
  createElement: el, getElementById: () => null, querySelectorAll: () => [],
  querySelector: () => null, addEventListener() {}, body: el()
};
const ctx = vm.createContext({
  document: doc, window: {}, location: { search: '' }, navigator: {},
  console, setTimeout, clearTimeout, URLSearchParams, Date, Math
});
ctx.window = ctx; ctx.globalThis = ctx;

const dir = __dirname;
vm.runInContext(fs.readFileSync(path.join(dir, 'config.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'upi.js'), 'utf8'), ctx);

const KF = ctx.window.KF_CONFIG;
const UPI = ctx.window.KF_UPI;

let pass = 0, fail = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS  ' : 'FAIL  ') + label.padEnd(34) +
    '-> ' + String(actual) + (ok ? '' : '   (expected ' + expected + ')'));
}

console.log('\n=== amount parsing ===');
check('rupee with comma',    amt('₹2,499'),      '2499.00');
check('Rs. prefix',          amt('Rs. 2499'),   '2499.00');
check('Rs prefix no dot',    amt('Rs 2499'),     '2499.00');
check('plain digits',        amt('2499'),        '2499.00');
check('no comma',            amt('₹5999'),       '5999.00');
check('decimal paise',       amt('2,499.50'),    '2499.50');
check('dollar sign',         amt('$99'),         '99.00');
check('zero rejected',       amt('₹0'),          null);
check('empty rejected',      amt(''),            null);
check('garbage rejected',    amt('abc'),         null);

function amt(v) {
  const l = UPI.link(v, 'X');
  return l ? new URLSearchParams(l.split('?')[1]).get('am') : null;
}

console.log('\n=== every configured program ===');
for (const [name, cfg] of Object.entries(KF.programs)) {
  const l = UPI.link(cfg.price, name);
  const q = new URLSearchParams(l.split('?')[1]);
  const expected = Number(cfg.price.replace(/[^\d.]/g, '')).toFixed(2);
  check(name, q.get('am'), expected);
  if (q.get('pa') !== KF.payment.upiId) {
    console.log('FAIL  VPA mismatch for ' + name); fail++;
  }
}

console.log('\n=== link shape ===');
const link = UPI.link('₹2,499', 'Fat Loss Blueprint');
check('scheme', link.split(':')[0], 'upi');
check('currency', new URLSearchParams(link.split('?')[1]).get('cu'), 'INR');
check('payee', new URLSearchParams(link.split('?')[1]).get('pn'), KF.payment.payeeName);
check('VPA format', /^[A-Za-z0-9._-]{2,256}@[A-Za-z]{2,64}$/.test(KF.payment.upiId), true);
check('enabled', UPI.enabled, true);

console.log('\n=== bundle math ===');
const solo = ['Fat Loss Blueprint', 'Muscle Building', 'At Home Training', 'Athlete Performance']
  .reduce((s, n) => s + Number(KF.programs[n].price.replace(/[^\d.]/g, '')), 0);
check('solo sum', solo, 10796);
check('bundle', Number(KF.programs['Complete Bundle'].price.replace(/[^\d.]/g, '')), 5999);
check('savings', solo - 5999, 4797);

console.log('\n' + (fail === 0 ? 'ALL ' + pass + ' TESTS PASSED' : pass + ' passed, ' + fail + ' FAILED'));
process.exit(fail === 0 ? 0 : 1);
