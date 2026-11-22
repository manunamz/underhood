// Writes docs/badges/<level>.svg for the default icon, docs/badges/<icon>/<level>.svg for each candidate,
// and docs/badges/parts/{mech,model}-<mark>.svg (single halves) for the landing page's legend.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { badge, part, LEVELS, MARK_NAMES, LABEL_COLORS } from './badge.js';

export const DEFAULT_ICON = 'sparkles';
const CANDIDATES = ['die', 'curve', 'net', 'paths', 'eye', 'spark', 'sparkles', 'constellation', 'hub'];

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'badges');

const write = (dir, icon) => {
  mkdirSync(dir, { recursive: true });
  for (const level of Object.keys(LEVELS)) {
    writeFileSync(join(dir, `${level}.svg`), badge(level, { icon }));
  }
};

write(out, DEFAULT_ICON);
for (const icon of CANDIDATES) write(join(out, icon), icon);

const colors = join(out, 'colors');
mkdirSync(colors, { recursive: true });
for (const color of Object.keys(LABEL_COLORS)) {
  writeFileSync(join(colors, `${color}.svg`), badge('model-optional', { icon: DEFAULT_ICON, color }));
}

const parts = join(out, 'parts');
mkdirSync(parts, { recursive: true });
for (const [name, icon] of [['mech', 'cog'], ['model', DEFAULT_ICON]]) {
  writeFileSync(join(parts, `${name}.svg`), part(icon));
  for (const mark of MARK_NAMES) writeFileSync(join(parts, `${name}-${mark}.svg`), part(icon, mark));
}
console.log(`wrote badges to ${out}`);
