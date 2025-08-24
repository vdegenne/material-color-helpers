# @vdegenne/material-color-helpers

- Provides `applyThemeString` and `applyTheme`.
- Provides `themeFromSourceColor`(through `@vdegenne/material-color-helpers/material.js`) which can be used to supply a theme object to `applyTheme`.

(You can also find `themeFromSourceColor` in official `@material/material-color-utilities` package which is installed and available as a peer dependency.)

The reason for providing `themeFromSourceColor` as an external object is because it doesn't work well with tree shaking for some reasons.
This ensures minimal code when using `applyThemeString` or `applyTheme` alone.
