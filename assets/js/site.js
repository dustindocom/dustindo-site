/* DUSTIN DO: SITE SCRIPT
   Small on purpose. You do not need to edit this file; all text, colors and
   images live in the HTML and CSS. Three jobs:
   1. Lets folder links like "works/one/" work when you open the site offline from your computer.
   2. Fills in the current year in the footer.
   3. Runs the binder-divider accordion (scroll-driven; hover and tap also work). */
(function () {
  'use strict';

  /* 1. Offline folder links.
     On a web server, "works/one/" opens works/one/index.html automatically.
     Opened straight from a folder (file://), browsers don't, so add index.html. */
  if (location.protocol === 'file:') {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (/^[a-z][a-z0-9+.\-]*:/i.test(href) || href.charAt(0) === '#') continue; // skip http:, mailto:, #top
      var cut = href.search(/[?#]/);
      var path = cut < 0 ? href : href.slice(0, cut);
      var rest = cut < 0 ? '' : href.slice(cut);
      if (path.slice(-1) === '/') links[i].setAttribute('href', path + 'index.html' + rest);
    }
  }

  /* 2. Footer year */
  var years = document.querySelectorAll('[data-year]');
  for (var y = 0; y < years.length; y++) years[y].textContent = new Date().getFullYear();

  /* 3. Binder dividers, driven by scrolling.
     Think of the dividers as one long page that scrolls normally: each divider is a
     colored edge with its tab, followed by its content. Two rules make it a binder:
       - a divider that would still be below the window stays tucked at the bottom
       - a divider that would scroll off the top docks under the nav and stays there,
         content fixed to its tab, while the next divider slides up over it
     One pixel of scroll moves everything one pixel, so there is no dead scrolling.
     Clicking or tapping a tab (or resting the mouse on it) scrolls to that divider. */
  var runway = document.querySelector('.runway');
  var stage = document.querySelector('.stage');
  if (!runway || !stage || !document.documentElement.classList.contains('js')) return;

  var hero = runway.querySelector('.hero');
  var sheets = Array.prototype.slice.call(runway.querySelectorAll('.sheet'));
  var tabs = Array.prototype.slice.call(runway.querySelectorAll('.sheet__tab'));
  var N = sheets.length;
  var H = [], C = [];                 // H: content height of each divider. C: running total of H.
  var total = 0, vh = 0, runTop = 0, edge = 13, tabH = 40, dock = 120, s = 0;
  var h = sheets.map(function () { return 0; });   // visible content height of each divider right now
  var ticking = false, lastScroll = 0;

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function px(name, fallback) {
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  function measure() {
    vh = stage.offsetHeight;
    tabH = px('--tab-h', 40);
    edge = px('--lip', 12) + 1;                          // height of one divider's colored edge
    dock = px('--header-h', 74) + 6 + tabH;              // top of the first docked edge, just under the tabs
    total = 0;
    for (var i = 0; i < N; i++) {
      H[i] = sheets[i].querySelector('.sheet__inner').offsetHeight;   // the content's own height
      total += H[i];
      C[i] = total;
    }
    runway.style.height = (vh + total) + 'px';           // exactly as much scrolling as the content needs
    runTop = runway.getBoundingClientRect().top + window.pageYOffset;
  }

  function update() {
    ticking = false;
    s = clamp(window.pageYOffset - runTop, 0, total);
    var natural = [], top = [], acc = 0, i;
    for (i = 0; i < N; i++) {
      natural[i] = (vh - N * edge) - s + acc;            // where this edge would be if the page just scrolled
      acc += edge + H[i];
      // tucked at the bottom at most, docked under the nav at least
      top[i] = Math.min(vh - (N - i) * edge, Math.max(dock + i * edge, natural[i]));
    }
    stage.style.setProperty('--hy', (-s * 0.5).toFixed(1) + 'px');
    for (i = 0; i < N; i++) {
      var bottom = i < N - 1 ? top[i + 1] : vh;
      h[i] = Math.max(0, bottom - top[i] - edge);        // how much of this divider's content shows above the next one
      sheets[i].style.setProperty('--y', top[i].toFixed(1) + 'px');
      sheets[i].classList.toggle('is-closed', h[i] < 1);
      tabs[i].style.setProperty('--ty', (top[i] - tabH).toFixed(1) + 'px');
      tabs[i].setAttribute('aria-expanded', h[i] > H[i] / 2 ? 'true' : 'false');
    }
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', function () { lastScroll = Date.now(); cancelHover(); request(); }, { passive: true });
  window.addEventListener('resize', function () { measure(); request(); });
  window.addEventListener('load', function () { measure(); request(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); request(); });
  measure(); update();

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function goTo(pos) { window.scrollTo({ top: runTop + pos, behavior: reduce ? 'auto' : 'smooth' }); }
  function openTarget(i) { return C[i]; }                      // divider i fully shown
  function closeTarget(i) { return i === 0 ? 0 : C[i - 1]; }   // back to the divider before it
  function isCurrent(i) { return Math.abs(s - C[i]) < 3; }
  function toggle(i) { goTo(isCurrent(i) ? closeTarget(i) : openTarget(i)); }

  /* hover: only on devices with a real mouse, only for a deliberate pause,
     and never because the page scrolled under a resting pointer. */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hoverTimer = null;
  function cancelHover() { if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; } }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (e) {
      var fromMouse = e.detail > 0;
      if (canHover && fromMouse && isCurrent(i)) return;   // already open from hovering; a click never closes it
      toggle(i);
    });
    if (canHover) {
      tab.addEventListener('mousemove', function (e) {
        if (!(e.movementX || e.movementY)) return;         // pointer did not really move
        if (Date.now() - lastScroll < 400 || hoverTimer || isCurrent(i)) return;
        hoverTimer = setTimeout(function () { hoverTimer = null; goTo(openTarget(i)); }, 220);
      });
      tab.addEventListener('mouseleave', cancelHover);
    }
  });
})();
