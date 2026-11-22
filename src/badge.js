// Renders the underhood badge: a label plus a two-item checklist in shields.io "flat" proportions.
//   [ underhood | cog ✓/~/✗ | model-icon ✓/~/✗ ]
// Icons and marks are paths so they look the same wherever the badge is embedded
// (GitHub proxies README images and the viewer's fonts are unknown). The label is
// Verdana text pinned with textLength, the same way shields.io renders its labels.

// Marks mean the same thing on both sides: check = required, tilde = optional
// (the project still works without it), x = absent. Something has to be able to
// run, so if one side is absent the other must be required. That rules out x/x,
// tilde/x and x/tilde, leaving six of the nine combinations.
export const LEVELS = {
  'code-only':      { cog: 'check', model: 'x',     says: 'deterministic code only, no magic' },
  'model-optional': { cog: 'check', model: 'tilde', says: 'deterministic code, optional inference' },
  'fully-loaded':   { cog: 'check', model: 'check', says: 'deterministic code and inference, fully loaded' },
  'code-optional':  { cog: 'tilde', model: 'check', says: 'inference, optional deterministic code' },
  'model-only':     { cog: 'x',     model: 'check', says: 'inference only' },
  'either':         { cog: 'tilde', model: 'tilde', says: 'deterministic code or inference, either alone' },
};

const BG = '#555d59';
const FG = '#fff';

// four-point star with concave sides, centered on (cx, cy) with tip radius r
const star = (cx, cy, r) => {
  const a = 0.086 * r, b = 0.357 * r;
  const pts = [
    [cx, cy - r], [cx + a, cy - b], [cx + b, cy - a], [cx + r, cy],
    [cx + b, cy + a], [cx + a, cy + b], [cx, cy + r],
    [cx - a, cy + b], [cx - b, cy + a], [cx - r, cy],
    [cx - b, cy - a], [cx - a, cy - b], [cx, cy - r],
  ].map(([x, y]) => `${+x.toFixed(2)} ${+y.toFixed(2)}`);
  return `M${pts[0]}C${pts.slice(1, 4).join(' ')}C${pts.slice(4, 7).join(' ')}`
    + `C${pts.slice(7, 10).join(' ')}C${pts.slice(10, 13).join(' ')}z`;
};

// how far a star of radius r reaches from its center at the given angle,
// found by sampling one side curve (tip to tip) and interpolating on the angle
const SIDE = (() => {
  const a = 0.086, b = 0.357, pts = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64, u = 1 - t;
    // P0 (0,-1), P1 (a,-b), P2 (b,-a), P3 (1,0)
    const x = 3 * u * u * t * a + 3 * u * t * t * b + t ** 3;
    const y = -(u ** 3) - 3 * u * u * t * b - 3 * u * t * t * a;
    pts.push([Math.atan2(-y, x), Math.hypot(x, y)]); // angle runs from π/2 down to 0
  }
  return pts.reverse();
})();
const reach = (r, angle) => {
  const q = ((angle % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
  const i = SIDE.findIndex(([ang]) => ang >= q);
  if (i <= 0) return r * SIDE[0][1];
  const [a0, r0] = SIDE[i - 1], [a1, r1] = SIDE[i];
  return r * (r0 + ((q - a0) / (a1 - a0)) * (r1 - r0));
};

// nodes: [cx, cy, r]; r > 0 draws a star, r = 0 a dot. Edges stop short of both ends.
const graph = (nodes, edges, gap = 0.9) => {
  const lines = edges.map(([a, b]) => {
    const [ax, ay, ar] = nodes[a], [bx, by, br] = nodes[b];
    const ang = Math.atan2(by - ay, bx - ax), len = Math.hypot(bx - ax, by - ay);
    const da = (ar ? reach(ar, ang) : 1.3) + gap, db = (br ? reach(br, ang) : 1.3) + gap;
    const ux = (bx - ax) / len, uy = (by - ay) / len;
    const f = n => +n.toFixed(2);
    return `M${f(ax + ux * da)} ${f(ay + uy * da)}L${f(bx - ux * db)} ${f(by - uy * db)}`;
  }).join('');
  const stars = nodes.filter(n => n[2]).map(([x, y, r]) => star(x, y, r)).join('');
  const dots = nodes.filter(n => !n[2]).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3"/>`).join('');
  return `<path d="${lines}" fill="none" stroke="${FG}" stroke-width="1" stroke-linecap="round" stroke-opacity=".55"/>`
    + `<path fill="${FG}" d="${stars}"/><g fill="${FG}">${dots}</g>`;
};

// 16×16 icon paths
const ICONS = {
  cog: `<path fill="${FG}" d="M9.2 1l.4 1.9 1.2.5 1.6-1.1 1.7 1.7-1.1 1.6.5 1.2 1.9.4v2.4l-1.9.4-.5 1.2 1.1 1.6-1.7 1.7-1.6-1.1-1.2.5-.4 1.9H6.8l-.4-1.9-1.2-.5-1.6 1.1-1.7-1.7 1.1-1.6-.5-1.2L.6 9.2V6.8l1.9-.4.5-1.2-1.1-1.6 1.7-1.7 1.6 1.1 1.2-.5L6.8 1zM8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5z"/>`,
  die: `<rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="${FG}" stroke-width="1.6"/><circle cx="5" cy="5" r="1.3" fill="${FG}"/><circle cx="8" cy="8" r="1.3" fill="${FG}"/><circle cx="11" cy="11" r="1.3" fill="${FG}"/>`,
  curve: `<path d="M.8 14.2h14.4" stroke="${FG}" stroke-width="1.4" stroke-linecap="round"/><path d="M1 13.4C4 13.4 5.2 2 8 2s4 11.4 7 11.4" fill="none" stroke="${FG}" stroke-width="1.7" stroke-linecap="round"/>`,
  paths: `<g fill="none" stroke="${FG}" stroke-linecap="round"><path d="M2.5 8H13" stroke-width="1.2" stroke-opacity=".45"/><path d="M2.5 8C7 8 8 12.5 13 12.5" stroke-width="1.2" stroke-opacity=".45"/><path d="M2.5 8C7 8 8 3.5 13 3.5" stroke-width="2"/></g><g fill="${FG}"><circle cx="2.5" cy="8" r="2"/><circle cx="13.5" cy="3.5" r="1.9"/><circle cx="13.5" cy="8" r="1.2" fill-opacity=".45"/><circle cx="13.5" cy="12.5" r="1.2" fill-opacity=".45"/></g>`,
  eye: `<path d="M.9 8C3.6 3.4 12.4 3.4 15.1 8 12.4 12.6 3.6 12.6.9 8z" fill="none" stroke="${FG}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.6" fill="${FG}"/>`,
  spark: `<path d="M8 1C8.6 5.5 10.5 7.4 15 8 10.5 8.6 8.6 10.5 8 15 7.4 10.5 5.5 8.6 1 8 5.5 7.4 7.4 5.5 8 1z" fill="${FG}"/>`,
  // ✨: a large star with two smaller companions
  sparkles: `<path fill="${FG}" d="${star(9.6, 9.6, 6.2)}${star(3.4, 3.4, 3.2)}${star(2.6, 11.6, 1.9)}"/>`,
  // ✨ as a network: the big star links to both small ones. Each small star sits on one of
  // the big star's diagonals, so its edge leaves through the gap between two arms and
  // reads as aimed at the center (an edge close to an arm looks like part of that arm).
  constellation: graph(
    [[10.2, 8, 5.4], [4.6, 2.6, 2.6], [4.6, 13.6, 1.7]],
    [[0, 1], [0, 2]],
    1.1,
  ),
  // one sparkle as the hub of a small network
  hub: graph(
    [[8, 8, 5], [1.8, 2.2, 0], [14.2, 2.6, 0], [2.4, 14, 0], [13.8, 13.6, 0]],
    [[0, 1], [0, 2], [0, 3], [0, 4]],
  ),
  net: `<g stroke="${FG}" stroke-width="1" stroke-opacity=".85"><path d="M2.5 4.5L8 2.5M2.5 4.5L8 8M2.5 4.5L8 13.5M2.5 11.5L8 2.5M2.5 11.5L8 8M2.5 11.5L8 13.5M8 2.5L13.5 8M8 8L13.5 8M8 13.5L13.5 8"/></g><g fill="${FG}"><circle cx="2.5" cy="4.5" r="1.8"/><circle cx="2.5" cy="11.5" r="1.8"/><circle cx="8" cy="2.5" r="1.8"/><circle cx="8" cy="8" r="1.8"/><circle cx="8" cy="13.5" r="1.8"/><circle cx="13.5" cy="8" r="1.8"/></g>`,
};

const MARKS = {
  check: `<path d="M3 8.6l3.4 3.4L13 4.6" fill="none" stroke="${FG}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  x:     `<path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="${FG}" stroke-width="2.4" stroke-linecap="round"/>`,
  tilde: `<path d="M2.5 9.5C4 6.5 6 6.3 8 8s4 1.5 5.5-1.5" fill="none" stroke="${FG}" stroke-width="2.4" stroke-linecap="round"/>`,
};

// segment = 6 pad + 12 icon + 3 gap + 9 mark + 6 pad
const SEG = 36;
const H = 20;

const LABEL = 'underhood';
const LABEL_TEXT_W = 59; // "underhood" in 11px Verdana
const LABEL_W = 6 + LABEL_TEXT_W + 6;
export const LABEL_COLORS = {
  red: '#b3261e',     // classic car red
  cherry: '#8f1d21',  // darker, like an older paint job
  candy: '#cc1f2f',   // candy apple, a little brighter
};
const W = LABEL_W + SEG * 2;

const place = (svg, x, y, size) =>
  `<g transform="translate(${x} ${y}) scale(${size / 16})">${svg}</g>`;

const segment = (icon, mark, x0) =>
  place(ICONS[icon], x0 + 6, 4, 12) + place(MARKS[mark], x0 + 21, 5.5, 9);

export const MARK_NAMES = Object.keys(MARKS);

// One half of the badge on its own, for explaining each icon and mark.
// Without a mark it draws just the icon tile.
export function part(icon, mark) {
  if (!ICONS[icon]) throw new Error(`unknown icon "${icon}"`);
  if (mark && !MARKS[mark]) throw new Error(`unknown mark "${mark}"`);
  const w = mark ? SEG : 6 + 12 + 6;
  const body = mark ? segment(icon, mark, 0) : place(ICONS[icon], 6, 4, 12);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" role="img" aria-label="${mark ? `${icon} ${mark}` : icon}">
<clipPath id="r"><rect width="${w}" height="${H}" rx="3"/></clipPath>
<rect width="${w}" height="${H}" fill="${BG}" clip-path="url(#r)"/>
${body}
</svg>
`;
}

export function badge(level, { icon = 'sparkles', color = 'red' } = {}) {
  const labelBg = LABEL_COLORS[color] ?? color;
  const lvl = LEVELS[level];
  if (!lvl) throw new Error(`unknown level "${level}" (expected: ${Object.keys(LEVELS).join(', ')})`);
  if (!ICONS[icon]) throw new Error(`unknown icon "${icon}"`);
  const label = `underhood: ${lvl.says}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
<title>${label}</title>
<clipPath id="r"><rect width="${W}" height="${H}" rx="3"/></clipPath>
<g clip-path="url(#r)"><rect width="${LABEL_W}" height="${H}" fill="${labelBg}"/><rect x="${LABEL_W}" width="${SEG * 2}" height="${H}" fill="${BG}"/><rect x="${LABEL_W + SEG}" width="1" height="${H}" fill="#000" fill-opacity=".18"/></g>
<g fill="${FG}" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
<text x="${LABEL_W / 2}" y="15" fill="#010101" fill-opacity=".3" textLength="${LABEL_TEXT_W}" lengthAdjust="spacingAndGlyphs">${LABEL}</text>
<text x="${LABEL_W / 2}" y="14" textLength="${LABEL_TEXT_W}" lengthAdjust="spacingAndGlyphs">${LABEL}</text>
</g>
${segment('cog', lvl.cog, LABEL_W)}
${segment(icon, lvl.model, LABEL_W + SEG)}
</svg>
`;
}
