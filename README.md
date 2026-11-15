# Font comparator

## Development

Run `pnpm dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

## Production

Run `pnpm build` to build the app into `docs/`, published under `/font-comparator/`.

## Fonts

Copy `bin/config.dist.js` to `bin/config.js`, set the Google Fonts API key, then run `pnpm fetch-fonts` to refresh
`src/assets/fonts.json` and `src/assets/categories.json`.

## Testing

Run `pnpm test` to execute the unit tests via [Karma](https://karma-runner.github.io), and `pnpm lint` to lint the code.
