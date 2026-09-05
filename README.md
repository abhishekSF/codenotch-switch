# Codenotch Switch

Interactive replica of [Codenotch](https://github.com/vinzdg/codenotch) — Vinz’s side-notch LLM usage tracker — with **Gemini, ChatGPT, and Grok** instead of Claude, Cursor, Codex, and Antigravity.

Original announcement: [x.com/hivinz_/status/2096256684801060980](https://x.com/hivinz_/status/2096256684801060980)

**Live demo:** https://chilly-lichen-8bk6.here.now/

## What this is

Codenotch pins a black side-notch to a screen edge. Each ring is a model. The arc is how much of the current session you have burned. Hover (or tap) a ring for the detail card: session window, longer window, reset copy.

This replica keeps that layout and adds:

- A **switch** for Gemini / ChatGPT / Grok (the control at the bottom left)
- **One on/off switch per model** in Settings, matching Codenotch’s Integrations row
- Edge picker: right, left, top, bottom

Numbers are demo readings in the same shape as the design frame (73% / 21% / 52%). This is a visual replica, not a live quota client.

## Run locally

Open `index.html` in a browser, or:

```sh
python3 -m http.server 4173
```

Then visit http://localhost:4173

## Credit

Design, notch geometry, colour bands, and the per-provider switch pattern come from [vinzdg/codenotch](https://github.com/vinzdg/codenotch) by [@hivinz_](https://x.com/hivinz_). Gemini, ChatGPT, and Grok marks are simplified stand-ins, not official logos.
