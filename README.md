# Doxygen Materialized

<!-- markdownlint-disable -->
This repo contains some of my customizations for adapting Doxygen's HTML output using some Material Design.

## How to Use

1. Simply copy over this repo's doxygen-materialized folder into a doxygen project.

   The destination of this folder can be anywhere (within the Doxyfile's `INPUT` path), but I recommend keeping all documentation related files in a separate folder like "docs".
2. Modify your project's Doxyfile. This can be done in 1 of 2 ways.

  - Add the following line to your project's doxyfile (preferably at the end of the file):
  ```txt
  @INCLUDE = doxygen-materialized/doxyfile_overrides.ini
  ```
  - Change or add the following lines to your project's Doxyfile:
  ```txt
  HTML_HEADER = doxygen-materialized/templates/header.html
  HTML_FOOTER = doxygen-materialized/templates/footer.html
  HTML_EXTRA_STYLESHEET = doxygen-materialized/css/theme.css
  HTML_EXTRA_FILES += doxygen-materialized/favicon.ico
  HTML_EXTRA_FILES += doxygen-materialized/css/doxygen-materialized.css.map
  HTML_EXTRA_FILES += doxygen-materialized/js/materialize.min.js
  HTML_EXTRA_FILES += doxygen-materialized/js/clipboard.min.js
  HTML_EXTRA_FILES += doxygen-materialized/js/theme_header_script.js
  HTML_EXTRA_FILES += doxygen-materialized/js/theme_header_script.js.map
  HTML_EXTRA_FILES += doxygen-materialized/js/theme_footer_script.js
  HTML_EXTRA_FILES += doxygen-materialized/js/theme_footer_script.js.map
  ```

If your project is already using customized header, footer, and layout files, then you might just consider this repository an inspiration to copy from, since this repository carries an MIT License.
- Note that material icons have been embedded via CSS, and they are subject to Google's Apache
  License v2. The material icons used by this theme are not distributed with this theme's
  assets, rather they are fetched (by the browser) when the generated HTML is loaded.
- The distributed JS dependencies also use a MIT license, namely the materialize-css framework
  and clipboard.js. These distributed minified scripts have not been altered, they are just served with the generated html for performance and connectivity reasons.


## Features

- re-styled admonitions (includes appropriate icons in admonitions' titles)
- integrated support for dark theme (with toggle switch) that works with the user's OS settings
- added "scroll-to-top" button which appears at 360px (approximately 5 scroll wheel "notches")
  from the top of the page. This is made compatible with and without GENERATE_TREEVIEW enabled.
- add a favicon (in *doxygen_overrides/header.html*) which can easily be change by
  replacing/changing the *doxygen_overrides/favicon.ico* file.
- added copy-to-clipboard button for all code blocks (which have been re-styled in the process)
- moved site indexing tabs into the slide out nav menu (toggled via the navbar's hamburger
  button). This feature requires `DISABLE_INDEX` set to `NO` in the project's Doxyfile.
