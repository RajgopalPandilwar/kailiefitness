/* ============================================================
   KAILIEFITNESS — CHECKOUT BEHAVIOUR
   Reads window.KF_CONFIG (see config.js) and wires every Buy Now
   button to its payment link. No build step, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.KF_CONFIG || {};
  var PROGRAMS = CFG.programs || {};
  var UPI = window.KF_UPI;

  // ---- Toast -----------------------------------------------------
  var toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = [
    'position:fixed', 'left:50%', 'bottom:32px', 'transform:translateX(-50%) translateY(20px)',
    'background:#0A0A0A', 'color:#CBAD62', 'border:1px solid #CBAD62',
    'padding:16px 24px', 'font:600 12px/1.4 Inter,system-ui,sans-serif',
    'letter-spacing:.14em', 'text-transform:uppercase', 'max-width:calc(100vw - 40px)',
    'text-align:center', 'opacity:0', 'pointer-events:none',
    'transition:opacity .2s ease, transform .2s ease', 'z-index:1100'
  ].join(';');
  document.body.appendChild(toast);

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3600);
  }
  window.KFToast = showToast;

  // ---- Buy Now buttons -------------------------------------------
  Array.prototype.forEach.call(document.querySelectorAll('[data-program]'), function (btn) {
    var name = btn.getAttribute('data-program');
    var entry = PROGRAMS[name];
    if (!entry) return;

    var price = entry.price;

    // The page renders a price beside every button; fall back to that
    // only if config is missing, so a typo can never blank it.
    if (!price) {
      var near = btn.parentElement && btn.parentElement.querySelector('.price__now');
      price = near ? near.textContent.trim() : '';
    }

    btn.setAttribute('aria-label', 'Buy ' + name + ' for ' + price + ' via UPI');

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      if (!UPI || !UPI.enabled) {
        showToast('Payment is not configured yet — add your UPI ID in config.js');
        return;
      }
      UPI.open(name, price);
    });
  });

  // ---- Contact links use the configured support address ----------
  if (CFG.supportEmail) {
    var mail = 'mailto:' + CFG.supportEmail;
    Array.prototype.forEach.call(
      document.querySelectorAll('a[href^="mailto:"]'),
      function (a) { a.setAttribute('href', mail); }
    );
  }

  // ---- Year ------------------------------------------------------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Mobile nav ------------------------------------------------
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- FAQ accordion ---------------------------------------------
  Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
    btn.addEventListener('click', function () {
      var item  = btn.parentElement;
      var panel = item.querySelector('.faq__a');
      var isOpen = item.classList.contains('open');

      Array.prototype.forEach.call(
        document.querySelectorAll('.faq__item.open'),
        function (o) {
          o.classList.remove('open');
          o.querySelector('.faq__a').style.maxHeight = null;
          o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        }
      );

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
