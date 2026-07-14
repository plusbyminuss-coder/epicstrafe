# Contributing

Thanks for contributing to EpicStrafe.

## Development

1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Build the shared workspace with `npm run build:shared`.
4. Start the frontend with `npm run dev:frontend`.
5. Keep changes focused and preserve existing API response shapes and database behavior.

## Before opening a pull request

Run:

```bash
npm run lint
npm run build
```

Do not commit credentials, `.env` files, databases, generated builds, or dependency folders. Explain behavior changes and include reproduction steps for bug fixes.

## Design contributions

Keep the interface restrained, responsive, readable in both themes, and consistent with the existing component system. Avoid decorative elements that obscure data or controls.
