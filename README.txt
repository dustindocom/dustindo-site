DUSTIN DO SITE: HOW TO USE AND EDIT
====================================
Open index.html in any browser. It works with no internet connection.
Edit any file in a plain text editor, save, and refresh the browser.

FOLDERS
  index.html              Home (hero + scroll-driven binder dividers)
  works/index.html        Works list
  works/one/index.html    Project pages (also two, three, misc)
  contact/ and about/     Each has an index.html
  assets/js/shell.js      THE SHARED PARTS: head extras, header + nav, footer (edit once, every page updates)
  assets/css/style.css    All colors, sizes, breakpoints (see the top of the file)
  assets/js/site.js       Small script (accordion, offline links). Loaded by shell.js.
  assets/img/             Logo, favicon and placeholder images (replace them)
  assets/img/stickers/    Placeholder stickers for the tabs and dividers (replace them)

SHARED HEAD, HEADER, NAV AND FOOTER (ONE FILE)
  Open assets/js/shell.js. It has four labelled sections: settings (name, domain, email),
  head extras, header + nav, and footer. The header and footer are plain HTML between
  backtick marks. Change them there and every page changes.

  Every page is now just this:
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>About | Dustin Do</title>
    <meta name="description" content="A sentence about this page.">
    <script src="../assets/js/shell.js"></script>
    </head>
    <body>
    <site-header></site-header>
    <main id="main"> ...this page's own content... </main>
    <site-footer></site-footer>
    </body>
    </html>
  The only thing that changes is the path in the script line: no ../ for the home page,
  ../ for works, contact and about, ../../ for the project pages. To make a new page, copy an
  existing one and change the title, description and content.

  Why the title and description stay in each page: every page needs its own, and search
  engines and link previews read them straight from the page.

  Good to know: the header, nav and footer are added by JavaScript. Visitors with JavaScript
  turned off would not see them, and some link-preview robots do not run JavaScript, so they read
  only the title and description in each page. If you want a picture to show in link previews,
  paste this into the <head> of the pages you share (home first), above the script line:
    <meta property="og:image" content="https://your-domain.com/assets/img/your-1200x630-image.jpg">

URLS
  Each page is a folder containing index.html, so on a web server the address is
  /works/one/ (no .html). Offline, site.js quietly adds index.html to folder links.

UPLOAD (FTP)
  Upload everything inside this folder to your web root, including the hidden
  .htaccess file, 404.html, robots.txt, sitemap.xml and site.webmanifest.

REPLACE THESE PLACEHOLDERS
  * Name, domain and email: the settings at the top of assets/js/shell.js. Also search
    sitemap.xml and robots.txt for dustindo.com, and the contact page for the email.
  * LinkedIn / Behance links: in the footer in shell.js, and on the contact page.
  * All text on the project, about and contact pages.
  * assets/img/social-share.svg is used by link previews. Many networks want a
    1200x630 JPG or PNG, so swap in one and update the og:image line in shell.js.

STICKERS ON THE TABS
  Each tab button in index.html holds an <img class="tab-sticker">. Swap the file in src for your
  own image (a PNG or WebP with a transparent background, ideally square, about 200x200 so it
  stays crisp on high-density screens). The sticker is centered on the tab and hangs above and
  below it. It is sized from the tab's height (--tab-h, 40px), not its width, so it looks the same
  on phones and desktops. A square or roughly square sticker is best on phones, where each tab
  is about 85px wide.
  Per-tab tweaks go in that button's style attribute:
    --sticker-h   height in px (default is 1.7 times the tab height)
    --sx / --sy   nudge sideways / up and down in px (default --sy is -6px)
    --sr          tilt, for example 6deg
  In style.css, :root has --sticker-h (the default size) and --tab-overhang (keeps docked tabs
  far enough below the nav that hanging stickers are not hidden by it).
  The tab's words (one, two, three, misc) stay in the page for screen readers. To show words
  instead of a sticker, delete the <img> and remove has-sticker from that button's class.

STICKERS ON THE DIVIDERS
  Each <article class="sheet"> in index.html has a <div class="sheet__stickers"> frame. Put
  <img class="sticker" ...> lines inside it. Placement is set in the style attribute:
    --l or --r    distance from the left or right edge of the content area, in % (works on any screen)
    --t or --b    distance from the top or bottom edge, in px (negative hangs outside the divider)
    --w           width in px        --rot   tilt in degrees
  The frame is never clipped, so stickers can hang over the divider's edge, over the divider
  above it, and past the content area. The stickers tilt along with their divider. Divider one
  has a demo sticker; delete that <img> line when you have your own.
  Two limits: nothing can show outside the browser window itself, and the dividers are trimmed at
  the bottom edge of the window so they never spill onto the footer.

IMAGE SIZES (CONTENT IS CAPPED AT 1600 PX WIDE)
  Hero ...................... 1600 x 900   (optional 3200 x 1800 for retina)
  Project / divider images .. 1600 x 1000
  Portrait .................. 800 x 1000
  Colors stretch edge to edge on any screen; images never grow past 1600 px,
  so they are never stretched on 2K and 4K monitors. Use JPG or WebP at about
  80% quality. When you swap an image, keep the file name or edit the src.

FOCAL POINT
  Each image tag has style="--fx:800;--fy:380;--iw:1600;--ih:900". fx and fy are
  the pixel position of the spot to keep centered when the frame is cropped
  (for example on a phone). iw and ih are the image's real pixel size.

DIVIDER TILT
  Each divider, with all of its content, is tilted by the --tilt value in its style
  attribute in index.html (for example --tilt:0.45deg). Positive leans clockwise,
  negative the other way. Keep them between 0.1deg and 0.6deg for a casual,
  hand-placed look. The tab for each divider (further down the same block) has the
  same --tilt value, so change both together.

CHANGING COLORS
  Divider colors: the style="--c:#8fa58f" on each <article class="sheet"> and its tab
  in index.html, and the matching color in works/index.html and each project page.
  Everything else: the :root block at the top of assets/css/style.css.
