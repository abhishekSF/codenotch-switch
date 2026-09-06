# Codenotch Switch

A desktop overlay replica of [Codenotch](https://github.com/vinzdg/codenotch) by Vinz. The original tracks Claude, Cursor, Codex, and Antigravity. This replica switches Gemini, ChatGPT, and Grok.

Original announcement: [x.com/hivinz_/status/2096256684801060980](https://x.com/hivinz_/status/2096256684801060980)

The product is an always-on-top Electron window over your real desktop. It is not a website.

## How to start

Install dependencies:

```sh
npm install
```

Start the overlay:

```sh
npm start
```

On this Linux VM, start it on the desktop display:

```sh
DISPLAY=:1 npm start
```

On Linux, install `xdotool` if the notch does not receive clicks. The host reads the pointer with it while the window is glass.

Quit from the tray. The tray also has Settings.

You should see the black notch on your real desktop, the Gemini / ChatGPT / Grok switch, and the settings orb. Clicks on empty desktop pass through. Electron loads `overlay.html`.

## What this is

Codenotch pins a black side-notch to a screen edge. Each ring is a model. The arc is how much of the current session you have burned. Hover a ring for the detail card: session window, longer window, reset copy.

This replica keeps that layout and adds:

- A switch for Gemini / ChatGPT / Grok
- One on/off switch per model in Settings
- Edge picker: right, left, top, bottom

Numbers are demo readings in the same shape as the design frame (73% / 21% / 52%). Layout, flares, rings, and colour bands follow `vinzdg/codenotch` (`Design.scale`, `NotchLayout`, `SideNotchShape`). This is a visual replica, not a live quota client.

## Credit

Design, notch geometry, colour bands, and the per-provider switch pattern come from [vinzdg/codenotch](https://github.com/vinzdg/codenotch) by [@hivinz_](https://x.com/hivinz_). Gemini, ChatGPT, and Grok marks are simplified stand-ins, not official logos.
