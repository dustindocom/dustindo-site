DUSTIN DO SITE: HOW TO USE AND EDIT
====================================
Open index.html in any browser. It works with no internet connection.
Edit any file in a plain text editor, save, and refresh the browser.

FOLDERS
  index.html              Home (hero + scroll-driven binder dividers)
  works/index.html        Works list
  works/one/index.html    Project pages (also two, three, misc)
  contact/ and about/     Each has an index.html
  assets/css/style.css    All colors, sizes, breakpoints (see the top of the file)
  assets/js/site.js       Small script (accordion, offline links, footer year)
  assets/img/             Logo, favicon and placeholder images (replace them)

URLS
  Each page is a folder containing index.html, so on a web server the address is
  /works/one/ (no .html). Offline, site.js quietly adds index.html to folder links.

UPLOAD (FTP)
  Upload everything inside this folder to your web root, including the hidden
  .htaccess file, 404.html, robots.txt, sitemap.xml and site.webmanifest.

REPLACE THESE PLACEHOLDERS
  * Domain: search all files for dustindo.com and use your real domain.
  * Email: search for hello@dustindo.com.
  * LinkedIn / Behance links in the footer and contact page.
  * All text on the project, about and contact pages.
  * assets/img/social-share.svg is used by link previews. Many networks want a
    1200x630 JPG or PNG, so swap in one and update the og:image lines.

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

CHANGING COLORS
  Divider colors: the style="--c:#8fa58f" on each <article class="divider"> in index.html,
  and the matching color in works/index.html and each project page.
  Everything else: the :root block at the top of assets/css/style.css.
