<!-- docs/README.md -->
# Project Documentation

All of this project's markdown documentation lives in this `docs/` folder, outside of the front-end source tree.

## Organization
- `docs/getting-started.md`  — Getting started guide
- `docs/architecture.md`     — Architecture overview
- `docs/style-guide.md`      — Coding and style guidelines
- `docs/your-doc.md`         — Any other documentation you add

## Stripping Chat Comments
If you copied content from ChatGPT and need to remove interstitial prompts and replies, use the `strip-chat.js` script:
```bash
node ../scripts/strip-chat.js docs/raw-doc.md docs/clean-doc.md
```
This will read `raw-doc.md`, strip out any lines beginning with ChatGPT/User prompts, and write the cleaned version to `clean-doc.md`.