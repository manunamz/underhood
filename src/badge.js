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

// Traffic lights: go, caution, stop. The color says how much the project needs
// that side, not how good the project is.
const MARK_COLORS = {
  check: '#4c9a1f',
  tilde: '#b98a00',
  x: '#c8372d',
};

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

// 16×16 icon paths
const ICONS = {
  cog: `<path fill="${FG}" d="M9.2 1l.4 1.9 1.2.5 1.6-1.1 1.7 1.7-1.1 1.6.5 1.2 1.9.4v2.4l-1.9.4-.5 1.2 1.1 1.6-1.7 1.7-1.6-1.1-1.2.5-.4 1.9H6.8l-.4-1.9-1.2-.5-1.6 1.1-1.7-1.7 1.1-1.6-.5-1.2L.6 9.2V6.8l1.9-.4.5-1.2-1.1-1.6 1.7-1.7 1.6 1.1 1.2-.5L6.8 1zM8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5z"/>`,
  // ✨: a large star with two smaller companions
  sparkles: `<path fill="${FG}" d="${star(9.6, 9.6, 6.2)}${star(3.4, 3.4, 3.2)}${star(2.6, 11.6, 1.9)}"/>`,
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
<rect width="${w}" height="${H}" fill="${mark ? MARK_COLORS[mark] : BG}" clip-path="url(#r)"/>
${body}
</svg>
`;
}

export function badge(level) {
  const lvl = LEVELS[level];
  if (!lvl) throw new Error(`unknown level "${level}" (expected: ${Object.keys(LEVELS).join(', ')})`);
  const label = `underhood: ${lvl.says}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
<title>${label}</title>
<clipPath id="r"><rect width="${W}" height="${H}" rx="3"/></clipPath>
<g clip-path="url(#r)"><rect width="${LABEL_W}" height="${H}" fill="${BG}"/><rect x="${LABEL_W}" width="${SEG}" height="${H}" fill="${MARK_COLORS[lvl.cog]}"/><rect x="${LABEL_W + SEG}" width="${SEG}" height="${H}" fill="${MARK_COLORS[lvl.model]}"/><rect x="${LABEL_W + SEG}" width="1" height="${H}" fill="#000" fill-opacity=".18"/></g>
<g fill="${FG}" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
<text x="${LABEL_W / 2}" y="15" fill="#010101" fill-opacity=".3" textLength="${LABEL_TEXT_W}" lengthAdjust="spacingAndGlyphs">${LABEL}</text>
<text x="${LABEL_W / 2}" y="14" textLength="${LABEL_TEXT_W}" lengthAdjust="spacingAndGlyphs">${LABEL}</text>
</g>
${segment('cog', lvl.cog, LABEL_W)}
${segment('sparkles', lvl.model, LABEL_W + SEG)}
</svg>
`;
}
