// Writes site/badges/<level>.svg
// and site/badges/parts/{mech,model}-<mark>.svg (single halves) for the landing page's legend.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { badge, part, LEVELS, MARK_NAMES } from './badge.js';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'site', 'badges');

mkdirSync(out, { recursive: true });
for (const level of Object.keys(LEVELS)) writeFileSync(join(out, `${level}.svg`), badge(level));

const parts = join(out, 'parts');
mkdirSync(parts, { recursive: true });
for (const [name, icon] of [['mech', 'cog'], ['model', 'sparkles']]) {
  writeFileSync(join(parts, `${name}.svg`), part(icon));
  for (const mark of MARK_NAMES) writeFileSync(join(parts, `${name}-${mark}.svg`), part(icon, mark));
}
console.log(`wrote badges to ${out}`);
