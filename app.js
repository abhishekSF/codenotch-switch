const SCALE = 44 / 117;

function px(n) {
  return n * SCALE;
}

function fontSize(capPixels) {
  return px(capPixels) / 0.714;
}

const LAYOUT = {
  bodyDepth: px(186),
  curl: px(103),
  corner: px(78.8),
  padTop: px(69.5),
  padBottom: px(50.1),
  cellSpacing: px(83.5),
  ring: px(117),
  trackStroke: px(15.5),
  progressStroke: px(8),
  glyph: px(46),
  ringLabelGap: px(26.9),
  percentLine: px(45),
  activity: px(72),
  activityStroke: px(5.5),
  cardWidth: px(600),
  cardCorner: px(49.5),
  cardPadding: px(32),
  tailLength: px(75),
  tailHeight: px(87),
  tailGap: px(28),
  barHeight: px(10.5),
  headerGap: px(17),
  headerToBlock: px(21),
  labelToBar: px(16.8),
  barToUsed: px(17.8),
  blockSpacing: px(20),
  sessionRowGap: px(10),
  statusDot: px(17),
  statusDotStroke: px(3.4),
  statusDotGap: px(11),
  hairline: px(2.5),
  orb: px(124),
  orbStroke: px(18),
  orbGap: px(27),
  orbGlyph: px(56),
  percentFont: fontSize(27),
  titleFont: fontSize(26),
  bodyFont: fontSize(18),
};

LAYOUT.cellExtent = LAYOUT.ring + LAYOUT.ringLabelGap + LAYOUT.percentLine;
LAYOUT.orbArc = LAYOUT.curl - LAYOUT.orbGap;

const EDGES = {
  right: {
    title: "Right",
    caption: "Down the right-hand edge, clear of a Dock on that side.",
    vertical: true,
  },
  left: {
    title: "Left",
    caption: "Down the left-hand edge, clear of a Dock on that side.",
    vertical: true,
  },
  top: {
    title: "Top",
    caption: "A wide bar across the top, readings side by side.",
    vertical: false,
  },
  bottom: {
    title: "Bottom",
    caption: "A wide bar along the bottom, readings side by side.",
    vertical: false,
  },
};

const GLYPHS = {
  gemini: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.2c.35 3.95 2.55 7.55 6.05 9.8-3.5 2.25-5.7 5.85-6.05 9.8-.35-3.95-2.55-7.55-6.05-9.8C9.45 8.75 11.65 5.15 12 1.2z"/></svg>`,
  chatgpt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.1 6 6 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 6 6 0 0 0 4-2.9 6.06 6.05 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.15-1.64zM2.34 7.9A4.49 4.49 0 0 1 4.7 5.92V11.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0L4 14.02A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.86-5.84-3.39 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.4-.66zm2.01-3.02-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.8.8 0 0 0-.4.68v6.73z"/></svg>`,
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

function css(n) {
  return `${n.toFixed(3)}px`;
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

function bodyLine() {
  return LAYOUT.bodyFont * 1.2;
}

function cardHeight(provider) {
  const header = Math.max(LAYOUT.glyph, LAYOUT.titleFont * 1.15);
  const line = bodyLine();
  const block = 2 * line + LAYOUT.labelToBar + LAYOUT.barHeight + LAYOUT.barToUsed;
  const windows = provider.windows.length;
  let height = 2 * LAYOUT.cardPadding + header + LAYOUT.headerToBlock
    + windows * block + Math.max(0, windows - 1) * LAYOUT.blockSpacing;
  const sessions = provider.activity?.sessions?.length || 0;
  if (sessions) {
    const row = 2 * line + LAYOUT.sessionRowGap;
    height += LAYOUT.blockSpacing + LAYOUT.hairline + LAYOUT.blockSpacing
      + sessions * row + Math.max(0, sessions - 1) * LAYOUT.blockSpacing;
  }
  return height;
}

function notchPath(depth, length, curl, corner) {
  const wanted = Math.min(corner, depth / 2);
  const curlClamped = Math.max(0, Math.min(curl, length / 2, depth - wanted));
  const c = Math.max(0, Math.min(wanted, (length - 2 * curlClamped) / 2));
  const bodyTop = curlClamped;
  const bodyBottom = length - curlClamped;
  const o = 1;
  let d = `M ${depth + o} 0 L ${depth} 0`;
  if (curlClamped > 0) {
    d += ` A ${curlClamped} ${curlClamped} 0 0 1 ${depth - curlClamped} ${bodyTop}`;
  }
  d += ` L ${c} ${bodyTop}`;
  d += ` A ${c} ${c} 0 0 1 0 ${bodyTop + c}`;
  d += ` L 0 ${bodyBottom - c}`;
  d += ` A ${c} ${c} 0 0 1 ${c} ${bodyBottom}`;
  d += ` L ${depth - curlClamped} ${bodyBottom}`;
  if (curlClamped > 0) {
    d += ` A ${curlClamped} ${curlClamped} 0 0 1 ${depth} ${length}`;
  }
  d += ` L ${depth + o} ${length} Z`;
  return d;
}

function ringSvg(fraction, color, activity) {
  const d = LAYOUT.ring;
  const r = d / 2;
  const track = LAYOUT.trackStroke;
  const prog = LAYOUT.progressStroke;
  const radius = r - track / 2;
  const circ = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, fraction)) * circ;
  const innerR = LAYOUT.activity / 2;
  const innerC = 2 * Math.PI * innerR;
  let extra = "";
  if (activity?.sessions?.[0]?.state === "working") {
    extra = `<g class="spin" style="transform-origin:${r}px ${r}px">
        <circle cx="${r}" cy="${r}" r="${innerR}" fill="none" stroke="#00FF88" stroke-width="${LAYOUT.activityStroke}" stroke-linecap="round" stroke-dasharray="${innerC * 0.25} ${innerC}" transform="rotate(-90 ${r} ${r})"/>
      </g>`;
  } else if (activity?.sessions?.[0]?.state === "waiting") {
    extra = `<circle cx="${r}" cy="${r}" r="${innerR}" fill="none" stroke="#F2FF00" stroke-width="${LAYOUT.activityStroke}"/>`;
  }
  return `<svg viewBox="0 0 ${d} ${d}" width="${d}" height="${d}">
      <circle cx="${r}" cy="${r}" r="${radius}" fill="none" stroke="#303030" stroke-width="${track}"/>
      <circle cx="${r}" cy="${r}" r="${radius}" fill="none" stroke="${color}" stroke-width="${prog}" stroke-linecap="round" stroke-dasharray="${dash} ${circ}" transform="rotate(-90 ${r} ${r})"/>
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
  const providers = visibleProviders();
  const tallest = Math.max(px(190), ...providers.map((p) => cardHeight(p) / 2 + LAYOUT.cardCorner));
  const slack = vertical
    ? Math.max(px(190), tallest)
    : Math.max(px(190), LAYOUT.cardWidth / 2 + LAYOUT.cardCorner);
  const tooltip = (vertical ? LAYOUT.cardWidth : Math.max(...providers.map(cardHeight), px(200)))
    + LAYOUT.tailLength + LAYOUT.tailGap;
  const panel = vertical
    ? { width: Math.ceil(tooltip + depth), height: Math.ceil(length + 2 * slack) }
    : { width: Math.ceil(length + 2 * slack), height: Math.ceil(tooltip + depth) };
  return { vertical, padStart, along, body, length, depth, slack, tooltip, panel };
}

function placeNotch(geo) {
  const { depth, length, slack, panel } = geo;
  switch (state.edge) {
    case "left":
      return { left: 0, top: slack, width: depth, height: length };
    case "top":
      return { left: slack, top: 0, width: length, height: depth };
    case "bottom":
      return { left: slack, top: panel.height - depth, width: length, height: depth };
    default:
      return { left: panel.width - depth, top: slack, width: depth, height: length };
  }
}

function ringCenter(index, geo) {
  return LAYOUT.curl + geo.padStart + LAYOUT.ring / 2 + index * (geo.along + LAYOUT.cellSpacing);
}

function cellCenter(index, geo, place) {
  const along = ringCenter(index, geo);
  if (state.edge === "right") return { x: place.left + geo.depth / 2, y: place.top + along };
  if (state.edge === "left") return { x: place.left + geo.depth / 2, y: place.top + along };
  return { x: place.left + along, y: place.top + geo.depth / 2 };
}

function placeWorld(panel) {
  const world = document.getElementById("notch-world");
  const fit = Math.min(1, (window.innerHeight - 8) / panel.height, (window.innerWidth - 8) / panel.width);
  const visW = panel.width * fit;
  const visH = panel.height * fit;
  world.dataset.edge = state.edge;
  world.style.width = css(panel.width);
  world.style.height = css(panel.height);
  world.style.top = "";
  world.style.right = "";
  world.style.left = "";
  world.style.bottom = "";
  world.style.marginLeft = "";
  world.style.marginTop = "";
  if (state.edge === "left") {
    world.style.left = "-1px";
    world.style.top = css((window.innerHeight - visH) / 2);
    world.style.transformOrigin = "top left";
  } else if (state.edge === "top") {
    world.style.top = "0";
    world.style.left = css((window.innerWidth - visW) / 2);
    world.style.transformOrigin = "top left";
  } else if (state.edge === "bottom") {
    world.style.bottom = "0";
    world.style.left = css((window.innerWidth - visW) / 2);
    world.style.transformOrigin = "bottom left";
  } else {
    world.style.right = "-1px";
    world.style.top = css((window.innerHeight - visH) / 2);
    world.style.transformOrigin = "top right";
  }
  world.style.transform = `scale(${fit})`;
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
    btn.addEventListener("click", () => selectProvider(id));
    root.appendChild(btn);
  });

  const visibleIndex = enabledIds.indexOf(state.selected);
  const count = Math.max(enabledIds.length, 1);
  root.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
  thumb.style.width = `calc(100% / ${count})`;
  thumb.style.transform = `translateX(${Math.max(0, visibleIndex) * 100}%)`;
}

function renderSettings() {
  const rows = document.getElementById("account-rows");
  rows.innerHTML = state.providers.map((p) => {
    const on = state.enabled[p.id];
    return `<label class="account">
      <span class="mark">${GLYPHS[p.id]}</span>
      <span class="name">${p.name}</span>
      <span class="switch">
        <input type="checkbox" data-id="${p.id}" ${on ? "checked" : ""}>
        <span></span>
      </span>
      <span class="sub">${on ? p.account : "Signed out — nothing is read."}</span>
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

function statusMark(stateName, color) {
  const d = LAYOUT.statusDot;
  const r = d / 2 - LAYOUT.statusDotStroke / 2;
  const circ = 2 * Math.PI * r;
  const trim = stateName === "working" ? 0.75 : 0.5;
  const spin = stateName === "working" ? "working-ring" : "";
  return `<span class="status">
    <svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">
      <circle class="${spin}" cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="${color}"
        stroke-width="${LAYOUT.statusDotStroke}" stroke-linecap="round"
        stroke-dasharray="${trim * circ} ${circ}" transform="rotate(-90 ${d / 2} ${d / 2})"
        style="transform-origin:${d / 2}px ${d / 2}px"/>
    </svg>
  </span>`;
}

function tooltipHTML(provider, center, geo) {
  const dir = { right: "leading", left: "trailing", top: "down", bottom: "up" }[state.edge];
  const height = cardHeight(provider);
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
          <div class="split"><span>${s.name}</span><span class="right" style="color:${color};display:flex;align-items:center;gap:${css(LAYOUT.statusDotGap)}">${statusMark(s.state, color)}${word}</span></div>
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

  const tailW = dir === "leading" || dir === "trailing" ? LAYOUT.tailLength : LAYOUT.tailHeight;
  const tailH = dir === "leading" || dir === "trailing" ? LAYOUT.tailHeight : LAYOUT.tailLength;

  return `<div class="tooltip ${dir}" data-id="${provider.id}" style="left:${css(left)};top:${css(top)};transform:${transform};">
    <div class="card" style="width:${css(LAYOUT.cardWidth)};border-radius:${css(LAYOUT.cardCorner)};padding:${css(LAYOUT.cardPadding)};min-height:${css(height)}">
      <div class="card-head" style="gap:${css(LAYOUT.headerGap)};font-size:${css(LAYOUT.titleFont)}">
        <span class="mini" style="width:${css(LAYOUT.glyph)};height:${css(LAYOUT.glyph)};display:grid;place-items:center">${GLYPHS[provider.id]}</span>
        ${provider.name} Usage
      </div>
      ${blocks}
      ${sessions}
    </div>
    <div class="tail" style="width:${css(tailW)};height:${css(tailH)}"></div>
  </div>`;
}

function orbHTML(geo, place) {
  const rArc = LAYOUT.orbArc;
  const size = Math.max(LAYOUT.orb, rArc * 2 + LAYOUT.orbStroke);
  let cx;
  let cy;
  if (state.edge === "right") {
    cx = geo.panel.width - LAYOUT.curl;
    cy = place.top + geo.length;
  } else if (state.edge === "left") {
    cx = LAYOUT.curl;
    cy = place.top + geo.length;
  } else if (state.edge === "top") {
    cx = place.left + geo.length;
    cy = LAYOUT.curl;
  } else {
    cx = place.left + geo.length;
    cy = geo.panel.height - LAYOUT.curl;
  }

  const trim = {
    right: 0.75,
    left: 0.5,
    top: 0.5,
    bottom: 0.25,
  }[state.edge];
  const circ = 2 * Math.PI * rArc;
  const rot = -90 + trim * 360;

  return `<button class="orb" id="orb" type="button" aria-label="Settings"
      style="left:${css(cx - size / 2)};top:${css(cy - size / 2)};width:${css(size)};height:${css(size)}">
    <span class="orb-arc">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${rArc}" fill="none" stroke="#000"
          stroke-width="${LAYOUT.orbStroke}" stroke-linecap="round"
          stroke-dasharray="${circ * 0.25} ${circ}"
          transform="rotate(${rot} ${size / 2} ${size / 2})"/>
      </svg>
    </span>
    <span class="orb-disc" style="width:${css(LAYOUT.orb)};height:${css(LAYOUT.orb)};top:50%;left:50%;margin:${css(-LAYOUT.orb / 2)} 0 0 ${css(-LAYOUT.orb / 2)};inset:auto">
      <svg viewBox="0 0 24 24" width="${LAYOUT.orbGlyph}" height="${LAYOUT.orbGlyph}" fill="none" stroke="currentColor" stroke-width="1.7">
        <circle cx="12" cy="12" r="3.1"/>
        <path d="M12 3.2v1.7M12 19.1v1.7M4.9 6.4l1.2 1.2M17.9 16.4l1.2 1.2M3.2 12h1.7M19.1 12h1.7M4.9 17.6l1.2-1.2M17.9 7.6l1.2-1.2"/>
      </svg>
    </span>
  </button>`;
}

function renderNotch() {
  const layer = document.getElementById("notch-layer");
  const providers = visibleProviders();
  const geo = geometry(Math.max(providers.length, 1));
  const place = placeNotch(geo);
  placeWorld(geo.panel);

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
    ? `flex-direction:column;align-items:center;padding:${css(LAYOUT.curl + padStart)} 0 ${css(LAYOUT.curl + LAYOUT.padBottom)};gap:${css(LAYOUT.cellSpacing)};`
    : `flex-direction:row;justify-content:center;align-items:center;padding:0 ${css(LAYOUT.curl + padStart)};gap:${css(LAYOUT.cellSpacing)};`;

  const cells = providers.map((p) => {
    const used = headline(p);
    const color = band(used).color;
    const pct = `${Math.round(used * 100)}%`;
    return `<button class="cell" type="button" data-id="${p.id}" aria-label="${p.name} ${pct}"
        style="gap:${css(LAYOUT.ringLabelGap)};height:${geo.vertical ? css(LAYOUT.cellExtent) : "auto"};width:${geo.vertical ? "auto" : css(LAYOUT.ring)}">
      <span class="ring" style="width:${css(LAYOUT.ring)};height:${css(LAYOUT.ring)}">
        ${ringSvg(used, color, p.activity)}
        <span class="glyph">${GLYPHS[p.id]}</span>
      </span>
      <span class="percent" style="font-size:${css(LAYOUT.percentFont)};height:${css(LAYOUT.percentLine)};line-height:${css(LAYOUT.percentLine)}">${pct}</span>
    </button>`;
  }).join("");

  layer.innerHTML = `
    <div class="notch-wrap" style="left:${css(place.left)};top:${css(place.top)};width:${css(place.width)};height:${css(place.height)};">
      <svg class="shape" viewBox="0 0 ${viewW} ${viewH}" preserveAspectRatio="none">
        <path d="${path}" fill="#000" transform="${shapeTransform}"></path>
      </svg>
      <div class="cells" style="${cellsStyle}">${cells}</div>
    </div>
    ${orbHTML(geo, place)}
  `;

  layer.querySelectorAll(".glyph svg").forEach((el) => {
    el.style.width = css(LAYOUT.glyph);
    el.style.height = css(LAYOUT.glyph);
  });

  layer.querySelector(".cells")?.addEventListener("pointerover", (e) => {
    const btn = e.target.closest(".cell");
    if (btn) selectProvider(btn.dataset.id);
  });
  layer.querySelector(".cells")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".cell");
    if (btn) selectProvider(btn.dataset.id);
  });

  mountTooltip();
}

function selectProvider(id) {
  if (!id || !state.enabled[id] || state.selected === id) return;
  state.selected = id;
  renderSwitch();
  mountTooltip();
}

function styleTooltip(layer) {
  layer.querySelectorAll(".block").forEach((el, i) => {
    el.style.marginTop = css(i === 0 ? LAYOUT.headerToBlock : LAYOUT.blockSpacing);
  });
  const sessions = layer.querySelector(".sessions");
  if (sessions) {
    sessions.style.marginTop = css(LAYOUT.blockSpacing);
    sessions.style.paddingTop = css(LAYOUT.blockSpacing);
    sessions.style.borderTopWidth = css(LAYOUT.hairline);
  }
  layer.querySelectorAll(".block .split, .session .split, .used").forEach((el) => {
    el.style.fontSize = css(LAYOUT.bodyFont);
  });
  layer.querySelectorAll(".bar").forEach((el) => {
    el.style.marginTop = css(LAYOUT.labelToBar);
    el.style.height = css(LAYOUT.barHeight);
  });
  layer.querySelectorAll(".used").forEach((el) => {
    el.style.marginTop = css(LAYOUT.barToUsed);
  });
  layer.querySelectorAll(".session + .session").forEach((el) => {
    el.style.marginTop = css(LAYOUT.blockSpacing);
  });
  layer.querySelectorAll(".session").forEach((el) => {
    el.style.display = "grid";
    el.style.gap = css(LAYOUT.sessionRowGap);
  });
  layer.querySelectorAll(".card-head .mini svg").forEach((el) => {
    el.style.width = css(LAYOUT.glyph);
    el.style.height = css(LAYOUT.glyph);
  });
}

function mountTooltip() {
  const layer = document.getElementById("notch-layer");
  const providers = visibleProviders();
  if (!providers.length) {
    layer.querySelector(".tooltip")?.remove();
    return;
  }
  const geo = geometry(providers.length);
  const place = placeNotch(geo);
  const selected = providers.find((p) => p.id === state.selected) || providers[0];
  const selectedIndex = Math.max(0, providers.findIndex((p) => p.id === selected.id));
  const center = cellCenter(selectedIndex, geo, place);
  const html = tooltipHTML(selected, center, geo);
  const existing = layer.querySelector(".tooltip");
  if (existing) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const next = tmp.firstElementChild;
    existing.style.left = next.style.left;
    existing.style.top = next.style.top;
    existing.style.transform = next.style.transform;
    existing.className = next.className;
    existing.innerHTML = next.innerHTML;
  } else {
    layer.insertAdjacentHTML("beforeend", html);
  }
  styleTooltip(layer);
}

function openSheet() {
  document.getElementById("sheet-backdrop").hidden = false;
}

function closeSheet() {
  document.getElementById("sheet-backdrop").hidden = true;
}

function render() {
  document.getElementById("clock").textContent = clockCopy(new Date(state.now));
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

window.addEventListener("resize", render);
render();

setInterval(() => {
  state.now = Date.now();
  document.getElementById("clock").textContent = clockCopy(new Date(state.now));
}, 1000);
