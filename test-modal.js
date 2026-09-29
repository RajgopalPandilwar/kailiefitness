/* DOM-level check: does the modal open, populate and generate a real QR?
   Run: node test-modal.js */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const config = fs.readFileSync(path.join(dir, 'config.js'), 'utf8');
const upi = fs.readFileSync(path.join(dir, 'upi.js'), 'utf8');
const checkout = fs.readFileSync(path.join(dir, 'checkout.js'), 'utf8');

// qrcodejs is vendored at the site root, so load the real shipped file
// rather than a node_modules copy — this tests what users actually get.
const qrPath = path.join(dir, 'qrcode.min.js');

const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com/' });
const { window } = dom;

let pass = 0, fail = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS  ' : 'FAIL  ') + label.padEnd(40) + '-> ' + String(actual) +
    (ok ? '' : '   (expected ' + expected + ')'));
}

window.eval(config);
window.eval(upi);
window.eval(checkout);

console.log('\n=== bootstrap ===');
check('KF_UPI exposed', typeof window.KF_UPI, 'object');
check('UPI enabled', window.KF_UPI.enabled, true);

const doc = window.document;
const KF = window.KF_CONFIG;
const modal = doc.getElementById('upiModal');
check('modal in DOM', !!modal, true);
check('starts hidden', modal.classList.contains('is-open'), false);
check('aria-hidden set', modal.getAttribute('aria-hidden'), 'true');

console.log('\n=== open a program ===');
const btn = doc.querySelector('[data-program="Complete Bundle"]');
check('buy button exists', !!btn, true);
check('aria-label set', btn.getAttribute('aria-label'),
  'Buy Complete Bundle for ₹5,999 via UPI');

btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

check('modal now open', modal.classList.contains('is-open'), true);
check('aria-hidden cleared', modal.getAttribute('aria-hidden'), 'false');
check('program name', doc.getElementById('upiProgram').textContent, 'Complete Bundle');
check('amount shown', doc.getElementById('upiAmount').textContent, '₹5,999');
check('VPA shown', doc.getElementById('upiVpa').textContent, KF.payment.upiId);

const openHref = doc.getElementById('upiOpenApp').getAttribute('href');
console.log('\n' + openHref + '\n');
const q = new URLSearchParams(openHref.split('?')[1]);
check('app link scheme', openHref.split(':')[0], 'upi');
check('app link amount', q.get('am'), '5999.00');
check('app link payee VPA', q.get('pa'), KF.payment.upiId);
check('app link currency', q.get('cu'), 'INR');

console.log('\n=== QR code ===');
if (fs.existsSync(qrPath)) {
  window.eval(fs.readFileSync(qrPath, 'utf8'));
  check('QRCode library loaded', typeof window.QRCode, 'function');

  // re-open now that QRCode is defined
  doc.getElementById('upiModal').classList.remove('is-open');
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

  const qrHost = doc.getElementById('upiQr');
  // qrcodejs renders a <table> of divs by default, or an <img> when
  // type:'img' is passed. Accept either — not canvas.
  const rendered = qrHost.querySelectorAll('table, img');
  check('QR rendered', rendered.length > 0, true);
  check('QR not fallback text', /upi__qr-fallback/.test(qrHost.innerHTML), false);

  if (rendered.length) {
    console.log('      rendered <' + rendered[0].tagName.toLowerCase() + '> with ' +
      rendered[0].children.length + ' cells');
  }
} else {
  console.log('FAIL  vendored qrcode.min.js missing — QR would not render');
  fail++;
}

console.log('\n=== close ===');
doc.querySelector('.modal__close').dispatchEvent(
  new window.MouseEvent('click', { bubbles: true, cancelable: true }));
check('closed on X', modal.classList.contains('is-open'), false);
check('body scroll restored', doc.body.style.overflow, '');

console.log('\n=== every button opens the right program and amount ===');
for (const b of doc.querySelectorAll('[data-program]')) {
  const name = b.getAttribute('data-program');
  b.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

  const shown = doc.getElementById('upiProgram').textContent;
  const amt = new URLSearchParams(
    doc.getElementById('upiOpenApp').getAttribute('href').split('?')[1]).get('am');
  const expectedAmt = window.KF_UPI.cleanAmount(window.KF_CONFIG.programs[name].price);
  const opened = modal.classList.contains('is-open');

  check(name + ' modal', opened, true);
  check(name + ' name', shown, name);
  check(name + ' amount', amt, expectedAmt);
  window.KF_UPI.close();
}

console.log('\n' + (fail === 0 ? 'ALL ' + pass + ' CHECKS PASSED' : pass + ' passed, ' + fail + ' FAILED'));
process.exit(fail === 0 ? 0 : 1);
