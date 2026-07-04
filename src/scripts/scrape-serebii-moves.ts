/**
 * scrape-serebii-moves.ts  (v2 - fixed HTML parsing)
 * Scrapes ALL moves from https://www.serebii.net/attackdex-champions/ (by type)
 * Structure discovered:
 *   Cell 0: name (link)
 *   Cell 1: type image  /pokedex-bw/type/{type}.gif
 *   Cell 2: category image /pokedex-bw/type/{category}.png  (other.png = status)
 *   Cell 3: PP
 *   Cell 4: Power (Att.) -- = no power
 *   Cell 5: Accuracy  101 = infallible
 *   Cell 6: Effect description
 *
 * Run: npx tsx src/scripts/scrape-serebii-moves.ts
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TYPES: { slug: string; name: string }[] = [
  { slug: 'normal',   name: 'normal'   },
  { slug: 'fire',     name: 'fire'     },
  { slug: 'water',    name: 'water'    },
  { slug: 'electric', name: 'electric' },
  { slug: 'grass',    name: 'grass'    },
  { slug: 'ice',      name: 'ice'      },
  { slug: 'fighting', name: 'fighting' },
  { slug: 'poison',   name: 'poison'   },
  { slug: 'ground',   name: 'ground'   },
  { slug: 'flying',   name: 'flying'   },
  { slug: 'psychict', name: 'psychic'  },
  { slug: 'bug',      name: 'bug'      },
  { slug: 'rock',     name: 'rock'     },
  { slug: 'ghost',    name: 'ghost'    },
  { slug: 'dragon',   name: 'dragon'   },
  { slug: 'dark',     name: 'dark'     },
  { slug: 'steel',    name: 'steel'    },
  { slug: 'fairy',    name: 'fairy'    },
];

// Multi-hit moves: key (English slug) → [minHits, maxHits]
const MULTI_HIT_MOVES: Record<string, [number, number]> = {
  'barrage': [2, 5], 'bone_rush': [2, 5], 'bullet_seed': [2, 5],
  'comet_punch': [2, 5], 'double_slap': [2, 5], 'fury_attack': [2, 5],
  'fury_swipes': [2, 5], 'icicle_spear': [2, 5], 'pin_missile': [2, 5],
  'rock_blast': [2, 5], 'scale_shot': [2, 5], 'spike_cannon': [2, 5],
  'tail_slap': [2, 5], 'water_shuriken': [2, 5], 'arm_thrust': [2, 5],
  'beat_up': [1, 6], 'population_bomb': [1, 10], 'triple_kick': [1, 3],
  'triple_axel': [1, 3], 'gear_grind': [2, 2], 'double_kick': [2, 2],
  'twineedle': [2, 2], 'dual_wingbeat': [2, 2], 'dual_chop': [2, 2],
  'surging_strikes': [3, 3], 'triple_dive': [3, 3], 'thunder_cage': [4, 5],
  'clangorous_soul': [1, 1],
};

// Variable power moves: key → [minPower, maxPower] or null (no fixed power)
const VARIABLE_POWER_MOVES: Record<string, [number, number] | null> = {
  'fling': [10, 130], 'body_press': [10, 250], 'eruption': [1, 150],
  'water_spout': [1, 150], 'flail': [20, 200], 'reversal': [20, 200],
  'trump_card': [40, 190], 'grass_knot': [20, 120], 'low_kick': [20, 120],
  'heat_crash': [40, 120], 'heavy_slam': [40, 120], 'stored_power': [20, 820],
  'power_trip': [20, 820], 'crush_grip': [1, 120], 'wring_out': [1, 120],
  'electro_ball': [40, 150], 'gyro_ball': [1, 150], 'psywave': [1, 150],
  'natural_gift': [80, 100], 'hidden_power': [60, 60], 'magnitude': [10, 150],
  'night_daze': [85, 85], 'brine': [65, 130], 'venoshock': [65, 130],
  'facade': [70, 140], 'wake_up_slap': [70, 140], 'hex': [65, 130],
  'smelling_salts': [70, 140], 'round': [60, 120], 'echoed_voice': [40, 200],
  'rollout': [30, 480], 'ice_ball': [30, 480],
};

export interface ScrapedMove {
  nameEn: string;
  key: string;
  type: string;
  category: string;
  pp: number | null;
  power: number | null;
  powerMin: number | null;
  powerMax: number | null;
  accuracy: number | null;
  minHits: number | null;
  maxHits: number | null;
  moveClass: 'normal' | 'z-move' | 'max-move';
  available: boolean;
  effect: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(z-move\)\s*/gi, '_z')
    .replace(/['''\-]/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function extractTypeFromImg(src: string): string {
  // /pokedex-bw/type/normal.gif → "normal"
  const match = src.match(/\/type\/([a-z]+)\.gif/i);
  return match ? match[1].toLowerCase() : '';
}

function extractCategoryFromImg(src: string): string {
  // /pokedex-bw/type/physical.png → "physical"
  // /pokedex-bw/type/other.png   → "status"
  // /pokedex-bw/type/special.png → "special"
  const match = src.match(/\/type\/([a-z]+)\.png/i);
  if (!match) return 'status';
  const c = match[1].toLowerCase();
  if (c === 'other') return 'status';
  if (c === 'physical') return 'physical';
  if (c === 'special') return 'special';
  return 'status';
}

function getMoveClass(name: string, catImg: string): 'normal' | 'z-move' | 'max-move' {
  const lower = name.toLowerCase();
  if (lower.includes('(z-move)') || catImg.toLowerCase().includes('zmove')) return 'z-move';
  if (/^(max |g-max )/i.test(name)) return 'max-move';
  return 'normal';
}

// ─── Scraper ──────────────────────────────────────────────────────────────────

async function scrapeType(slug: string, typeName: string): Promise<ScrapedMove[]> {
  const url = `https://www.serebii.net/attackdex-champions/${slug}.shtml`;
  console.log(`  Fetching ${url}...`);

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.serebii.net/',
    },
    timeout: 30000,
  });

  const $ = cheerio.load(response.data);
  const moves: ScrapedMove[] = [];

  $('table.dextable tr').each((_i, row) => {
    const cells = $(row).find('td');
    if (cells.length < 6) return; // header row has th, data rows have td

    const nameCell  = $(cells[0]);
    const typeCell  = $(cells[1]);
    const catCell   = $(cells[2]);
    const ppCell    = $(cells[3]);
    const powCell   = $(cells[4]);
    const accCell   = $(cells[5]);
    const effCell   = cells.length > 6 ? $(cells[6]) : null;

    const name      = nameCell.find('a').first().text().trim() || nameCell.text().trim();
    const typeImgSrc = typeCell.find('img').first().attr('src') || '';
    const catImgSrc  = catCell.find('img').first().attr('src') || '';
    const ppRaw     = ppCell.text().trim();
    const powRaw    = powCell.text().trim();
    const accRaw    = accCell.text().trim();
    const effect    = effCell ? effCell.text().trim() : '';

    if (!name || name === 'Name') return; // skip header row

    // Parse type from img src (fallback to page type)
    const typeFromImg = extractTypeFromImg(typeImgSrc) || typeName;
    const category = extractCategoryFromImg(catImgSrc);
    const moveClass = getMoveClass(name, catImgSrc);
    const key = toKey(name);

    // PP
    const pp = ppRaw === '--' || ppRaw === '' ? null : parseInt(ppRaw) || null;

    // Accuracy: 101 = infallible → null
    const accNum = parseInt(accRaw);
    const accuracy = accRaw === '--' || accRaw === '' || accNum >= 101 ? null : accNum;

    // Power: fixed, variable from table, or from our manual list
    let power: number | null = null;
    let powerMin: number | null = null;
    let powerMax: number | null = null;

    const varEntry = VARIABLE_POWER_MOVES[key];
    if (varEntry !== undefined) {
      powerMin = varEntry ? varEntry[0] : null;
      powerMax = varEntry ? varEntry[1] : null;
    } else {
      const powNum = parseInt(powRaw);
      power = powRaw === '--' || powRaw === '' || isNaN(powNum) ? null : powNum;
    }

    // Multi-hit
    const hitEntry = MULTI_HIT_MOVES[key];
    const minHits = hitEntry ? hitEntry[0] : null;
    const maxHits = hitEntry ? hitEntry[1] : null;

    moves.push({
      nameEn: name,
      key,
      type: typeFromImg,
      category,
      pp,
      power,
      powerMin,
      powerMax,
      accuracy,
      minHits,
      maxHits,
      moveClass,
      available: moveClass === 'normal',
      effect,
    });
  });

  console.log(`    → Found ${moves.length} moves for type: ${typeName}`);
  return moves;
}

async function main() {
  console.log('🕷️  Serebii Pokémon Champions Move Scraper v2\n');

  const allMoves: ScrapedMove[] = [];
  const seenKeys = new Set<string>();
  const duplicates: string[] = [];

  for (const { slug, name } of TYPES) {
    try {
      const moves = await scrapeType(slug, name);
      for (const move of moves) {
        if (!seenKeys.has(move.key)) {
          seenKeys.add(move.key);
          allMoves.push(move);
        } else {
          duplicates.push(`${move.key} (${move.nameEn}) - type: ${move.type}`);
        }
      }
    } catch (err: any) {
      console.error(`  ✗ Error scraping ${name}: ${err.message}`);
    }
    // Be polite to Serebii's server
    await new Promise(r => setTimeout(r, 1500));
  }

  const outPath = path.join(__dirname, '../../scraped_moves.json');
  fs.writeFileSync(outPath, JSON.stringify(allMoves, null, 2), 'utf-8');

  const normalMoves  = allMoves.filter(m => m.moveClass === 'normal');
  const zMoves       = allMoves.filter(m => m.moveClass === 'z-move');
  const maxMoves     = allMoves.filter(m => m.moveClass === 'max-move');
  const variablePow  = allMoves.filter(m => m.powerMin !== null || m.powerMax !== null);
  const multiHit     = allMoves.filter(m => m.minHits !== null);

  console.log('\n─────────────────────────────────────');
  console.log(`✅ Total moves scraped: ${allMoves.length}`);
  console.log(`   ✓ Normal (available): ${normalMoves.length}`);
  console.log(`   ✗ Z-moves:           ${zMoves.length}`);
  console.log(`   ✗ Max-moves:         ${maxMoves.length}`);
  console.log(`   ~ Variable power:    ${variablePow.length}`);
  console.log(`   ~ Multi-hit:         ${multiHit.length}`);
  if (duplicates.length > 0) {
    console.log(`\n⚠ Duplicates skipped (${duplicates.length}):`);
    duplicates.forEach(d => console.log(`   - ${d}`));
  }
  console.log(`\n📁 Output: ${outPath}`);

  // Preview first few moves
  console.log('\n--- Sample output (first 5 normal moves) ---');
  normalMoves.slice(0, 5).forEach(m => {
    const pow = m.powerMin ? `${m.powerMin}-${m.powerMax}` : (m.power ?? '--');
    console.log(`  ${m.nameEn.padEnd(20)} type=${m.type.padEnd(10)} cat=${m.category.padEnd(10)} PP=${m.pp} pow=${pow} acc=${m.accuracy ?? 'infallible'}`);
  });
}

main().catch(console.error);
