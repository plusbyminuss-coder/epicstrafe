# Changelog

## Unreleased

### Changed

- Refreshed the responsive visual system, navigation, home page, cards, tables, forms, maps, settings, and footer.
- Added restrained translucent surfaces for supported browsers.
- Added a public development API proxy for frontend-only contributors.
- Standardized the repository's root commands on npm workspaces.
- Added Docker Compose provisioning for both MySQL databases and all required tables.

### Fixed

- Added the missing navigation typography import.
- Prevented optional comparison replay data from blocking initial playback.
- Added replay asset retries, request timeouts, stream-stall handling, and reliable loading errors.
- Released replay WebAssembly resources when navigating away.

### Credits

- Interface redesign and replay reliability improvements by **@quadrics on Discord**.
