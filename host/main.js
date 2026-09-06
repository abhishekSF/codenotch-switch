const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require("electron");
const { execFileSync } = require("child_process");
const path = require("path");

// Linux paints window alpha only if this switch is set before ready.
if (process.platform === "linux") {
  app.commandLine.appendSwitch("enable-transparent-visuals");
}

let overlay = null;
let tray = null;
let lastBounds = null;
let lastLive = [];
let sawReport = false;
let sheetOpen = false;
let lastIgnore = null;
let lastFocusable = null;

function workAreaBounds() {
  const area = screen.getPrimaryDisplay().workArea;
  return { x: area.x, y: area.y, width: area.width, height: area.height };
}

function sameBounds(a, b) {
  return a && b
    && a.x === b.x
    && a.y === b.y
    && a.width === b.width
    && a.height === b.height;
}

function fitWorkArea() {
  if (!overlay || overlay.isDestroyed()) return;
  const next = workAreaBounds();
  if (sameBounds(lastBounds, next)) return;
  lastBounds = next;
  overlay.setBounds(next);
}

function setIgnore(ignore) {
  if (!overlay || overlay.isDestroyed()) return;
  if (ignore === lastIgnore) return;
  lastIgnore = ignore;
  if (ignore) overlay.setIgnoreMouseEvents(true, { forward: true });
  else overlay.setIgnoreMouseEvents(false);
}

function setFocusable(on) {
  if (!overlay || overlay.isDestroyed()) return;
  if (on === lastFocusable) return;
  lastFocusable = on;
  overlay.setFocusable(on);
}

function pointInRects(x, y, rects) {
  for (const box of rects) {
    if (x >= box.x && y >= box.y && x < box.x + box.width && y < box.y + box.height) {
      return true;
    }
  }
  return false;
}

function overlayOrigin() {
  const content = overlay.getContentBounds();
  return { x: content.x, y: content.y };
}

function readCursor() {
  // Electron's cursor point does not move while this window is glass on X11.
  if (process.platform === "linux") {
    try {
      const out = execFileSync("xdotool", ["getmouselocation", "--shell"], {
        encoding: "utf8",
        timeout: 200,
        stdio: ["ignore", "pipe", "ignore"],
      });
      const x = Number(/X=(\d+)/.exec(out)?.[1]);
      const y = Number(/Y=(\d+)/.exec(out)?.[1]);
      if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
    } catch {}
  }
  return screen.getCursorScreenPoint();
}

function cursorOverLive() {
  if (!overlay || overlay.isDestroyed()) return false;
  const cursor = readCursor();
  const origin = overlayOrigin();
  return pointInRects(cursor.x - origin.x, cursor.y - origin.y, lastLive);
}

function applyPointerPolicy(overChrome) {
  if (!sawReport) {
    setIgnore(true);
    setFocusable(false);
    return;
  }
  setIgnore(!overChrome);
  setFocusable(sheetOpen && overChrome);
}

function parseMaskReport(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (raw.coverage === "none") {
    return { coverage: "none", live: [], sheetOpen: false };
  }
  if (raw.coverage !== "regions" || !Array.isArray(raw.live)) return null;
  const live = [];
  for (const box of raw.live) {
    if (!box || typeof box !== "object") continue;
    const x = Number(box.x);
    const y = Number(box.y);
    const width = Number(box.width);
    const height = Number(box.height);
    if (![x, y, width, height].every(Number.isFinite)) continue;
    if (width <= 0 || height <= 0) continue;
    live.push({ x, y, width, height });
  }
  return { coverage: "regions", live, sheetOpen: raw.sheetOpen === true };
}

function receiveMask(raw) {
  const report = parseMaskReport(raw);
  if (!report) return;
  sawReport = true;
  lastLive = report.live;
  sheetOpen = report.sheetOpen;
  applyPointerPolicy(cursorOverLive());
}

function receiveHover(over) {
  if (!sawReport) return;
  applyPointerPolicy(Boolean(over));
}

function createOverlay() {
  const area = workAreaBounds();
  lastBounds = area;
  overlay = new BrowserWindow({
    x: area.x,
    y: area.y,
    width: area.width,
    height: area.height,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    fullscreenable: false,
    show: false,
    type: process.platform === "linux" ? "toolbar" : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  lastIgnore = null;
  lastFocusable = false;
  setIgnore(true);
  overlay.setAlwaysOnTop(true, "screen-saver");
  overlay.setMenuBarVisibility(false);
  overlay.loadFile(path.join(__dirname, "..", "overlay.html"));
  overlay.once("ready-to-show", () => {
    fitWorkArea();
    overlay.show();
  });
  overlay.on("closed", () => {
    overlay = null;
  });
}

function trayIcon() {
  const png = nativeImage.createFromPath(path.join(__dirname, "icon.png"));
  if (!png.isEmpty()) return png;
  return nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVR4nGNgGAWjYBSMgiEG/0EF/4dIwT+Q4n9DpfgfWPE/kOJ/Q6X4H1TxqMWjYBSMggEHAJg0G/3nP2pRAAAAAElFTkSuQmCC"
  );
}

function createTray() {
  tray = new Tray(trayIcon());
  tray.setToolTip("Codenotch Switch");
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: "Settings",
      click: () => {
        if (!overlay || overlay.isDestroyed()) return;
        overlay.webContents.executeJavaScript("openSheet()");
      },
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]));
}

function start() {
  createOverlay();
  createTray();
  screen.on("display-metrics-changed", fitWorkArea);
  screen.on("display-added", fitWorkArea);
  screen.on("display-removed", fitWorkArea);
  setInterval(fitWorkArea, 300);
  setInterval(() => {
    if (sawReport) applyPointerPolicy(cursorOverLive());
  }, 16);
}

ipcMain.on("overlay:mask", (_event, raw) => receiveMask(raw));
ipcMain.on("overlay:hover", (_event, over) => receiveHover(over));

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    fitWorkArea();
  });
  app.whenReady().then(start);
}

app.on("window-all-closed", () => {
  app.quit();
});
