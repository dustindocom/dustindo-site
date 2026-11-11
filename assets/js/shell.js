/* DUSTIN DO: SHARED PARTS
   ============================================================================
   This ONE file holds everything that is the same on every page:
     1. the extras in the <head> (stylesheet, icons, share tags)
     2. the header and navigation
     3. the footer
   Change it here and every page updates. Each page keeps only its own <title>,
   its own <meta name="description"> and its own content.

   HOW TO EDIT
     - Change the text and HTML between the backtick ( ` ) marks below.
     - Never type a backtick or the two characters  $ {  inside the HTML.
     - {{root}} is replaced with the right path back to the top folder of the site, so links work
       from any page. {{home}} is the link to the home page. {{name}}, {{email}}, {{domain}}
       and {{year}} come from the settings just below.
     - To add a nav link, copy one <li> line in the header, then change its words, its
       href, and its data-nav word (data-nav lights up the link on its own page).
   ============================================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     1. SETTINGS
     --------------------------------------------------------------------------- */
  var SITE = {
    name: 'Dustin Do - Creative. Designer.',
    domain: 'https://dustindo.com',    // your real address, with no slash at the end
    email: 'me@dustindo.com',
    startYear: 2026                    // the footer shows 2026, and later 2026-2028
  };

  /* ---------------------------------------------------------------------------
     2. HEAD EXTRAS (added to the <head> of every page)
     --------------------------------------------------------------------------- */
  var HEAD = `
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#d5b399">
<meta name="author" content="{{name}}">
<link rel="icon" href="{{root}}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{{root}}site.webmanifest">
<link rel="stylesheet" href="{{root}}assets/css/style.css">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{{name}}">
<meta property="og:title" content="{{title}}">
<meta property="og:description" content="{{description}}">
<meta property="og:image" content="{{domain}}/assets/img/social-share.svg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"{{name}}","url":"{{domain}}/","email":"{{email}}"}</script>
`;

  /* ---------------------------------------------------------------------------
     3. HEADER AND NAVIGATION (appears where a page has <site-header></site-header>)
     --------------------------------------------------------------------------- */
  var HEADER = `
<span id="top"></span>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="site-nav" aria-label="Main">
    <a class="brand" href="{{home}}" data-nav="home" aria-label="Home">
      <img src="{{root}}assets/img/ddlogo.svg" width="95" height="40" alt="">
    </a>
    <ul class="site-nav__links">
      <li><a href="{{root}}works/" data-nav="works">Works</a></li>
      <li><a href="{{root}}contact/" data-nav="contact">Contact</a></li>
      <li><a href="{{root}}about/" data-nav="about">About</a></li>
    </ul>
  </nav>
</header>
`;

  /* ---------------------------------------------------------------------------
     4. FOOTER (appears where a page has <site-footer></site-footer>)
     --------------------------------------------------------------------------- */
  var FOOTER = `
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <img src="{{root}}assets/img/ddlogomark.svg" width="56" height="56" alt="">
      <p class="site-footer__name">{{name}}</p>
      <p>Design portfolio.</p>
    </div>
    <nav aria-label="Footer">
      <h2 class="site-footer__heading">Site</h2>
      <ul>
        <li><a href="{{home}}">Home</a></li>
        <li><a href="{{root}}works/">Works</a></li>
        <li><a href="{{root}}contact/">Contact</a></li>
        <li><a href="{{root}}about/">About</a></li>
      </ul>
    </nav>
    <div>
      <h2 class="site-footer__heading">Say hello</h2>
      <ul>
        <li><a href="mailto:{{email}}">{{email}}</a></li>
        <!-- Add your profiles below. Delete any you do not use. -->
        <li><a href="https://www.linkedin.com/" rel="noopener" target="_blank">LinkedIn</a></li>
        <li><a href="https://www.behance.net/" rel="noopener" target="_blank">Behance</a></li>
      </ul>
    </div>
  </div>
  <div class="site-footer__legal">
    <p>&copy; {{year}} {{name}}. All rights reserved.</p>
    <p>All work, images and text on this site are the property of {{name}} unless noted otherwise. Do not copy, reproduce or redistribute without written permission.</p>
    <p>This site does not use cookies, analytics or trackers.</p>
    <p class="site-footer__credit">Designed by {{name}} <a class="to-top" href="#top">Back to top</a></p>
  </div>
</footer>
`;

  /* ===========================================================================
     5. THE MACHINERY. You should not need to change anything below this line.
     =========================================================================== */

  // Where is the top folder of the site, seen from this page? (Read from the path of this very script tag.)
  var script = document.currentScript;
  var src = script ? script.getAttribute('src') : 'assets/js/shell.js';
  var at = src.lastIndexOf('assets/js/');
  var ROOT = at < 0 ? '' : src.slice(0, at);        // "", "../", "../../" or "/"
  var HOME = ROOT || './';

  // Which section of the site is this page in? (Used to highlight the current nav link.)
  var base = new URL(ROOT || './', location.href).pathname;
  var rel = location.pathname.indexOf(base) === 0 ? location.pathname.slice(base.length) : '';
  var section = rel.split('/')[0].replace(/^index\.html?$/, '') || 'home';

  var now = new Date().getFullYear();
  var year = SITE.startYear < now ? SITE.startYear + '–' + now : String(now);

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var descTag = document.querySelector('meta[name="description"]');
  var VARS = {
    root: ROOT, home: HOME, name: SITE.name, domain: SITE.domain, email: SITE.email, year: year,
    title: esc(document.title), description: esc(descTag ? descTag.getAttribute('content') : '')
  };
  function fill(template) {
    return template.replace(/\{\{(\w+)\}\}/g, function (all, key) { return VARS.hasOwnProperty(key) ? VARS[key] : all; });
  }

  // Add the head extras right now, while the browser is still reading the <head>, so the page never flashes unstyled.
  var extra = '';
  if (location.protocol.indexOf('http') === 0) {       // addresses only make sense on a real web server
    var url = SITE.domain + '/' + rel.replace(/index\.html?$/, '');
    extra = '<link rel="canonical" href="' + url + '"><meta property="og:url" content="' + url + '">';
  }
  document.documentElement.classList.add('js');
  document.write(fill(HEAD) + extra);

  // <site-header> and <site-footer> are filled in as the browser reads them.
  function register(tag, template) {
    if (!window.customElements || customElements.get(tag)) return;
    var html = fill(template);
    customElements.define(tag, class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = html;
        var marked = this.querySelectorAll('[data-nav]');
        for (var i = 0; i < marked.length; i++) {
          if (marked[i].getAttribute('data-nav') === section) marked[i].setAttribute('aria-current', 'page');
        }
      }
    });
  }
  register('site-header', HEADER);
  register('site-footer', FOOTER);

  // Last, load the page behaviors (the binder dividers and offline links).
  document.addEventListener('DOMContentLoaded', function () {
    var behaviors = document.createElement('script');
    behaviors.src = ROOT + 'assets/js/site.js';
    behaviors.onerror = function () { document.documentElement.classList.replace('js', 'no-js'); };   // plain stacked layout if it cannot load
    document.body.appendChild(behaviors);
  });
})();
