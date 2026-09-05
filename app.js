const LAYOUT = {
  bodyDepth: 186,
  curl: 103,
  corner: 78.8,
  padTop: 69.5,
  padBottom: 50.1,
  cellSpacing: 83.5,
  ring: 117,
  trackStroke: 15.5,
  progressStroke: 8,
  glyph: 46,
  ringLabelGap: 26.9,
  percentLine: 45,
  cardWidth: 600,
  tailLength: 75,
  tailGap: 28,
  orb: 124,
};

LAYOUT.cellExtent = LAYOUT.ring + LAYOUT.ringLabelGap + LAYOUT.percentLine;

const EDGES = {
  right: {
    title: "Right",
    caption: "Vertical column, welded to the right edge — the original frame.",
    vertical: true,
  },
  left: {
    title: "Left",
    caption: "Same column, mirrored onto the left edge.",
    vertical: true,
  },
  top: {
    title: "Top",
    caption: "Rings sit side by side. A vertical stack would hang too far down.",
    vertical: false,
  },
  bottom: {
    title: "Bottom",
    caption: "Horizontal bar along the bottom edge.",
    vertical: false,
  },
};

const GLYPHS = {
  gemini: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.2c.35 3.95 2.55 7.55 6.05 9.8-3.5 2.25-5.7 5.85-6.05 9.8-.35-3.95-2.55-7.55-6.05-9.8C9.45 8.75 11.65 5.15 12 1.2z"/></svg>`,
  chatgpt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.1 6 6 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 6 6 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.15-1.64zM2.34 7.9A4.49 4.49 0 0 1 4.7 5.92V11.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0L4 14.02A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.86-5.84-3.39 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.4-.66zm2.01-3.02-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.8.8 0 0 0-.4.68v6.73z"/></svg>`,
  grok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.2 4h3.4L12 10.1 16.4 4h3.4L13.8 12 20 20h-3.5L12 13.9 7.5 20H4L10.2 12z"/></svg>`,
};

function band(fraction) {
  if (fraction < 0.5) return { color: "#00FF88" };
  if (fraction < 0.7) return { color: "#F2FF00" };
  return { color: "#FF3F00" };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function clockCopy(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let h = date.getHours();
  h = h % 12 || 12;
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${h}:${pad(date.getMinutes())}`;
}

function resetCopy(resetsAt, now) {
  const seconds = (resetsAt - now) / 1000;
  if (seconds <= 0) return "Resetting…";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Resets in ${Math.max(1, minutes)} min`;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(resetsAt);
  const start = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const apart = Math.round((start(d) - start(new Date(now))) / 86400000);
  if (apart >= 7) return `Resets ${months[d.getMonth()]} ${d.getDate()}`;
  let h = d.getHours();
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `Resets ${days[d.getDay()]} ${h}:${pad(d.getMinutes())} ${am}`;
}

function makeProviders(now) {
  const session = now + 51 * 60 * 1000;
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  const midnight = d.getTime();
  const week = now + 4 * 24 * 3600 * 1000;
  return [
    {
      id: "gemini",
      name: "Gemini",
      account: "Google AI Studio · gemini.google.com",
      windows: [
        { label: "Current session", used: 0.73, resetsAt: session },
        { label: "All models", used: 0.07, resetsAt: midnight },
      ],
      activity: {
        sessions: [{ name: "Brief the Hyderabad brief", detail: "gemini-cli · hydlab", state: "working", since: now - 8 * 60 * 1000 }],
      },
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      account: "Plus · chatgpt.com",
      windows: [
        { label: "Current session", used: 0.21, resetsAt: now + 3 * 3600 * 1000 },
        { label: "Weekly limit", used: 0.18, resetsAt: week },
      ],
      activity: null,
    },
    {
      id: "grok",
      name: "Grok",
      account: "SuperGrok · x.com",
      windows: [
        { label: "Current session", used: 0.52, resetsAt: midnight },
        { label: "Daily quota", used: 0.34, resetsAt: midnight },
      ],
      activity: {
        sessions: [{ name: "Civic solutions pass", detail: "Waiting on you", state: "waiting", since: now - 2 * 60 * 1000 }],
      },
    },
  ];
}

const state = {
  edge: "right",
  enabled: { gemini: true, chatgpt: true, grok: true },
  selected: "gemini",
  now: Date.now(),
  providers: makeProviders(Date.now()),
};

function visibleProviders() {
  return state.providers.filter((p) => state.enabled[p.id]);
}

function headline(provider) {
  return Math.max(...provider.windows.map((w) => w.used));
}

function notchPath(depth, length, curl, corner) {
  const wanted = Math.min(corner, depth / 2);
  const curlClamped = Math.max(0, Math.min(curl, length / 2, depth - wanted));
  const c = Math.max(0, Math.min(wanted, (length - 2 * curlClamped) / 2));
  const bodyTop = curlClamped;
  const bodyBottom = length - curlClamped;
  let d = `M ${depth} 0`;
  if (curlClamped > 0) {
    d += ` A ${curlClamped} ${curlClamped} 0 0 0 ${depth - curlClamped} ${bodyTop}`;
  }
  d += ` L ${c} ${bodyTop}`;
  d += ` A ${c} ${c} 0 0 1 0 ${bodyTop + c}`;
  d += ` L 0 ${bodyBottom - c}`;
  d += ` A ${c} ${c} 0 0 1 ${c} ${bodyBottom}`;
  d += ` L ${depth - curlClamped} ${bodyBottom}`;
  if (curlClamped > 0) {
    d += ` A ${curlClamped} ${curlClamped} 0 0 0 ${depth} ${length}`;
  }
  d += " Z";
  return d;
}

function ringSvg(fraction, color, activity) {
  const r = 58.5;
  const track = LAYOUT.trackStroke;
  const prog = LAYOUT.progressStroke;
  const circ = 2 * Math.PI * (r - track / 2);
  const dash = Math.max(0, Math.min(1, fraction)) * circ;
  const inner = 36;
  const innerC = 2 * Math.PI * inner;
  let extra = "";
  if (activity?.sessions?.[0]?.state === "working") {
    extra = `<circle class="spin" cx="${r}" cy="${r}" r="${inner}" fill="none" stroke="#00FF88" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="${innerC * 0.25} ${innerC}" transform="rotate(-90 ${r} ${r})"/>`;
  } else if (activity?.sessions?.[0]?.state === "waiting") {
    extra = `<circle cx="${r}" cy="${r}" r="${inner}" fill="none" stroke="#F2FF00" stroke-width="5.5" opacity="0.85"/>`;
  }
  return `<svg viewBox="0 0 117 117">
      <circle cx="${r}" cy="${r}" r="${r - track / 2}" fill="none" stroke="#303030" stroke-width="${track}"/>
      <circle cx="${r}" cy="${r}" r="${r - track / 2}" fill="none" stroke="${color}" stroke-width="${prog}" stroke-linecap="round" stroke-dasharray="${dash} ${circ}" transform="rotate(-90 ${r} ${r})"/>
      ${extra}
    </svg>`;
}

function geometry(count) {
  const vertical = EDGES[state.edge].vertical;
  const along = vertical ? LAYOUT.cellExtent : LAYOUT.ring;
  const padStart = vertical ? LAYOUT.padTop : (LAYOUT.padTop + LAYOUT.padBottom) / 2;
  const padEnd = vertical ? LAYOUT.padBottom : (LAYOUT.padTop + LAYOUT.padBottom) / 2;
  const body = padStart + count * along + Math.max(0, count - 1) * LAYOUT.cellSpacing + padEnd;
  const length = body + 2 * LAYOUT.curl;
  const depth = vertical
    ? LAYOUT.bodyDepth
    : 2 * ((LAYOUT.bodyDepth - LAYOUT.ring) / 2) + LAYOUT.cellExtent;
  return { vertical, padStart, along, body, length, depth };
}

function placeNotch(geo) {
  const { depth, length } = geo;
  switch (state.edge) {
    case "left":
      return { left: 0, top: (2000 - length) / 2, width: depth, height: length };
    case "top":
      return { left: (2000 - length) / 2, top: 0, width: length, height: depth };
    case "bottom":
      return { left: (2000 - length) / 2, top: 2000 - depth, width: length, height: depth };
    default:
      return { left: 2000 - depth, top: (2000 - length) / 2, width: depth, height: length };
  }
}

function cellCenter(index, geo, place) {
  const along = LAYOUT.curl + geo.padStart + LAYOUT.ring / 2 + index * (geo.along + LAYOUT.cellSpacing);
  if (state.edge === "right" || state.edge === "left") {
    return { x: place.left + geo.depth / 2, y: place.top + along };
  }
  return { x: place.left + along, y: place.top + geo.depth / 2 };
}

function fitStage() {
  const world = document.getElementById("notch-world");
  const scale = Math.max(0.38, Math.min(window.innerHeight / 2000, window.innerWidth / 1400, 0.72));
  world.style.top = "";
  world.style.right = "";
  world.style.left = "";
  world.style.bottom = "";
  world.style.marginLeft = "";
  if (state.edge === "left") {
    world.style.top = "0";
    world.style.left = "0";
    world.style.transformOrigin = "top left";
  } else if (state.edge === "top") {
    world.style.top = "0";
    world.style.left = "50%";
    world.style.marginLeft = "-1000px";
    world.style.transformOrigin = "top center";
  } else if (state.edge === "bottom") {
    world.style.bottom = "0";
    world.style.left = "50%";
    world.style.marginLeft = "-1000px";
    world.style.transformOrigin = "bottom center";
  } else {
    world.style.top = "0";
    world.style.right = "0";
    world.style.transformOrigin = "top right";
  }
  world.style.transform = `scale(${scale})`;
}

function renderSwitch() {
  const root = document.getElementById("model-switch");
  const thumb = document.getElementById("switch-thumb");
  const ids = ["gemini", "chatgpt", "grok"];
  const enabledIds = ids.filter((id) => state.enabled[id]);
  if (!enabledIds.includes(state.selected) && enabledIds[0]) state.selected = enabledIds[0];

  root.querySelectorAll("button").forEach((b) => b.remove());
  ids.forEach((id) => {
    const p = state.providers.find((x) => x.id === id);
    const on = state.enabled[id];
    const active = state.selected === id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = id;
    btn.className = active ? "active" : "";
    btn.hidden = !on;
    btn.setAttribute("aria-selected", String(active));
    btn.innerHTML = `${GLYPHS[id]} ${p.name}`;
    btn.addEventListener("click", () => {
      state.selected = id;
      render();
    });
    root.appendChild(btn);
  });

  const visibleIndex = enabledIds.indexOf(state.selected);
  const count = Math.max(enabledIds.length, 1);
  root.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
  thumb.style.width = `calc((100% - 8px) / ${count})`;
  thumb.style.transform = `translateX(${Math.max(0, visibleIndex) * 100}%)`;
}

function renderSettings() {
  const rows = document.getElementById("account-rows");
  rows.innerHTML = state.providers.map((p) => {
    const on = state.enabled[p.id];
    return `<label class="account">
      <span class="mark">${GLYPHS[p.id]}</span>
      <span class="meta">
        <span class="name">${p.name}</span>
        <span class="sub">${on ? p.account : "Signed out — nothing is read."}</span>
      </span>
      <span class="switch">
        <input type="checkbox" data-id="${p.id}" ${on ? "checked" : ""}>
        <span></span>
      </span>
    </label>`;
  }).join("");

  rows.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.id;
      state.enabled[id] = input.checked;
      const vis = visibleProviders();
      if (!vis.find((p) => p.id === state.selected) && vis[0]) state.selected = vis[0].id;
      render();
    });
  });

  const seg = document.getElementById("edge-seg");
  seg.innerHTML = Object.entries(EDGES).map(([id, e]) =>
    `<button type="button" data-edge="${id}" class="${state.edge === id ? "active" : ""}">${e.title}</button>`
  ).join("");
  seg.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.edge = btn.dataset.edge;
      render();
    });
  });
  document.getElementById("edge-caption").textContent = EDGES[state.edge].caption;
}

function tooltipHTML(provider, center, geo) {
  const dir = { right: "leading", left: "trailing", top: "down", bottom: "up" }[state.edge];
  const blocks = provider.windows.map((w) => {
    const color = band(w.used).color;
    return `<div class="block">
      <div class="split"><span>${w.label}</span><span class="right">${resetCopy(w.resetsAt, state.now)}</span></div>
      <div class="bar"><span style="width:${Math.max(2, w.used * 100)}%;background:${color}"></span></div>
      <div class="used">${Math.round(w.used * 100)}% Used</div>
    </div>`;
  }).join("");

  const sessions = provider.activity?.sessions?.length
    ? `<div class="sessions">${provider.activity.sessions.map((s) => {
        const color = s.state === "working" ? "#00FF88" : "#F2FF00";
        const word = s.state === "working" ? "working" : "waiting";
        return `<div class="session">
          <div class="split"><span>${s.name}</span><span class="right" style="color:${color}"><span class="dot" style="border-color:${color}"></span>${word}</span></div>
          <div class="split"><span class="right">${s.detail}</span><span class="right">${Math.max(1, Math.round((state.now - s.since) / 60000))} min</span></div>
        </div>`;
      }).join("")}</div>`
    : "";

  let left;
  let top;
  let transform = "";
  if (dir === "leading") {
    left = center.x - geo.depth / 2 - LAYOUT.tailGap - LAYOUT.cardWidth - LAYOUT.tailLength;
    top = center.y;
    transform = "translateY(-50%)";
  } else if (dir === "trailing") {
    left = center.x + geo.depth / 2 + LAYOUT.tailGap;
    top = center.y;
    transform = "translateY(-50%)";
  } else if (dir === "down") {
    left = center.x;
    top = center.y + geo.depth / 2 + LAYOUT.tailGap;
    transform = "translateX(-50%)";
  } else {
    left = center.x;
    top = center.y - geo.depth / 2 - LAYOUT.tailGap;
    transform = "translate(-50%, -100%)";
  }

  return `<div class="tooltip ${dir}" style="left:${left}px;top:${top}px;transform:${transform};">
    <div class="card">
      <div class="card-head"><span class="mini">${GLYPHS[provider.id]}</span>${provider.name} Usage</div>
      ${blocks}
      ${sessions}
    </div>
    <div class="tail"></div>
  </div>`;
}

function orbHTML(geo, place) {
  let left;
  let top;
  if (state.edge === "right") {
    left = 2000 - LAYOUT.curl - LAYOUT.orb / 2;
    top = place.top + geo.length - LAYOUT.orb / 2;
  } else if (state.edge === "left") {
    left = LAYOUT.curl - LAYOUT.orb / 2;
    top = place.top + geo.length - LAYOUT.orb / 2;
  } else if (state.edge === "top") {
    left = place.left + geo.length - LAYOUT.orb / 2;
    top = LAYOUT.curl - LAYOUT.orb / 2;
  } else {
    left = place.left + geo.length - LAYOUT.orb / 2;
    top = 2000 - LAYOUT.curl - LAYOUT.orb / 2;
  }
  return `<button class="orb" id="orb" type="button" aria-label="Settings" style="left:${left}px;top:${top}px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
      <circle cx="12" cy="12" r="3.1"/>
      <path d="M12 3.2v1.7M12 19.1v1.7M4.9 6.4l1.2 1.2M17.9 16.4l1.2 1.2M3.2 12h1.7M19.1 12h1.7M4.9 17.6l1.2-1.2M17.9 7.6l1.2-1.2"/>
    </svg>
  </button>`;
}

function renderNotch() {
  const layer = document.getElementById("notch-layer");
  const providers = visibleProviders();
  const geo = geometry(Math.max(providers.length, 1));
  const place = placeNotch(geo);
  const selected = providers.find((p) => p.id === state.selected) || providers[0];
  const selectedIndex = Math.max(0, providers.findIndex((p) => p.id === state.selected));

  const path = notchPath(
    geo.vertical ? geo.depth : geo.length,
    geo.vertical ? geo.length : geo.depth,
    LAYOUT.curl,
    LAYOUT.corner
  );

  let shapeTransform = "";
  let viewW = geo.depth;
  let viewH = geo.length;
  if (state.edge === "left") {
    shapeTransform = `translate(${geo.depth},0) scale(-1,1)`;
  } else if (state.edge === "top") {
    viewW = geo.length;
    viewH = geo.depth;
    shapeTransform = `translate(0 ${geo.depth}) rotate(-90)`;
  } else if (state.edge === "bottom") {
    viewW = geo.length;
    viewH = geo.depth;
    shapeTransform = `rotate(90) translate(0 ${-geo.length})`;
  }

  const padStart = geo.padStart;
  const cellsStyle = geo.vertical
    ? `flex-direction:column;align-items:center;padding:${LAYOUT.curl + padStart}px 0 ${LAYOUT.curl + LAYOUT.padBottom}px;gap:${LAYOUT.cellSpacing}px;`
    : `flex-direction:row;justify-content:center;align-items:center;padding:0 ${LAYOUT.curl + padStart}px;gap:${LAYOUT.cellSpacing}px;`;

  const cells = providers.map((p) => {
    const used = headline(p);
    const color = band(used).color;
    const pct = `${Math.round(used * 100)}%`;
    return `<button class="cell ${geo.vertical ? "" : "horizontal-cell"}" type="button" data-id="${p.id}" aria-label="${p.name} ${pct}">
      <span class="ring">
        ${ringSvg(used, color, p.activity)}
        <span class="glyph">${GLYPHS[p.id]}</span>
      </span>
      <span class="percent">${pct}</span>
    </button>`;
  }).join("");

  const center = providers.length ? cellCenter(selectedIndex, geo, place) : { x: 0, y: 0 };
  const tip = selected ? tooltipHTML(selected, center, geo) : "";

  layer.innerHTML = `
    <div class="notch-wrap" style="left:${place.left}px;top:${place.top}px;width:${place.width}px;height:${place.height}px;">
      <svg class="shape" viewBox="0 0 ${viewW} ${viewH}" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;">
        <path d="${path}" fill="#000" transform="${shapeTransform}"></path>
      </svg>
      <div class="cells" style="position:absolute;inset:0;display:flex;${cellsStyle}">${cells}</div>
    </div>
    ${orbHTML(geo, place)}
    ${tip}
  `;

  layer.querySelectorAll(".cell").forEach((btn) => {
    const select = () => {
      state.selected = btn.dataset.id;
      render();
    };
    btn.addEventListener("mouseenter", select);
    btn.addEventListener("click", select);
  });
}

function openSheet() {
  document.getElementById("sheet-backdrop").hidden = false;
}

function closeSheet() {
  document.getElementById("sheet-backdrop").hidden = true;
}

function render() {
  document.getElementById("clock").textContent = clockCopy(new Date(state.now));
  fitStage();
  renderSwitch();
  renderSettings();
  renderNotch();
  document.getElementById("orb")?.addEventListener("click", openSheet);
}

document.getElementById("settings-fab").addEventListener("click", openSheet);
document.getElementById("sheet-close").addEventListener("click", closeSheet);
document.getElementById("sheet-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "sheet-backdrop") closeSheet();
});

window.addEventListener("resize", fitStage);
fitStage();
render();

setInterval(() => {
  state.now = Date.now();
  document.getElementById("clock").textContent = clockCopy(new Date(state.now));
}, 1000);
