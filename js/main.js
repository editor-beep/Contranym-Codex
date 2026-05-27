(function () {
  'use strict';

  // ── Curtain transition ────────────────────────────────────────
  var curtain = document.querySelector('.curtain');

  if (curtain) {
    // Reveal: fade the curtain out after load
    requestAnimationFrame(function () {
      curtain.classList.add('curtain--out');
    });

    // Intercept internal link clicks
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:)/.test(href)) return;
      if (link.getAttribute('aria-disabled') === 'true') return;

      e.preventDefault();

      curtain.classList.remove('curtain--out');
      curtain.classList.add('curtain--in');

      var navigated = false;
      function go() {
        if (!navigated) { navigated = true; window.location.href = href; }
      }

      curtain.addEventListener('transitionend', go, { once: true });
      setTimeout(go, 450); // fallback if transitionend misfires
    });
  }

  // ── Hero flip card ────────────────────────────────────────────
  var flipCard = document.querySelector('.hero-flip-card');

  if (flipCard) {
    function toggle() {
      var flipped = flipCard.classList.toggle('is-flipped');
      flipCard.setAttribute('aria-pressed', String(flipped));
    }

    flipCard.addEventListener('click', toggle);
    flipCard.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  // ── Card tilt on mousemove ────────────────────────────────────
  var MAX_TILT = 2.5; // degrees

  document.querySelectorAll('.codex-entry:not([aria-disabled])').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        'perspective(700px) rotateX(' + (-y * MAX_TILT * 2).toFixed(2) + 'deg) ' +
        'rotateY(' + (x * MAX_TILT * 2).toFixed(2) + 'deg) translateZ(6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ── Random specimen ───────────────────────────────────────────
  var SPECIMENS = ['bound.html'];

  var randomBtn = document.querySelector('.random-specimen');
  if (randomBtn) {
    randomBtn.addEventListener('click', function () {
      var current = window.location.pathname.split('/').pop() || 'index.html';
      var pool = SPECIMENS.filter(function (s) { return s !== current; });
      var target = pool.length ? pool[Math.floor(Math.random() * pool.length)] : SPECIMENS[0];
      window.location.href = target;
    });
  }

})();
