/* ============================================================
   KAILIEFITNESS — CHECKOUT BEHAVIOUR
   Reads window.KF_CONFIG (see config.js) and wires every Buy Now
   button to its payment link. No build step, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.KF_CONFIG || { programs: {}, READY: false };

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
    'transition:opacity .2s ease, transform .2s ease', 'z-index:999'
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

  // ---- Wire the buttons -----------------------------------------
  var buttons = document.querySelectorAll('[data-program]');
  Array.prototype.forEach.call(buttons, function (btn) {
    var name = btn.getAttribute('data-program');
    var entry = CFG.programs && CFG.programs[name];

    if (!entry || !entry.link) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Checkout not configured yet — add your payment link in config.js');
      });
      return;
    }

    btn.setAttribute('href', entry.link);
    btn.setAttribute('rel', 'noopener');
    btn.setAttribute('aria-label', 'Buy ' + name + ' for ' + entry.price);
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
