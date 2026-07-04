/**
 * scrape-champions-learnsets.ts  v2
 * FIXED: Searches for exact id="Pokémon_Champions" anchor instead of last "Champions" occurrence.
 *
 * Run: npx tsx src/scripts/scrape-champions-learnsets.ts
 * Supports resuming from champions_learnsets.json (skips already-scraped, re-tries 0-move ones)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

const DELAY_MS    = 2000;
const TIMEOUT     = 30000;
const LEARNSETS_OUT = path.join(ROOT, 'champions_learnsets.json');
const MOVES_ES_OUT  = path.join(ROOT, 'champions_moves_es.json');

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
    timeout: TIMEOUT,
  });
  return response.data as string;
}

function extractChampionsMoves(html: string): string[] {
  // The Champions section anchor appears TWICE in the HTML:
  //   1st: inside the Table of Contents
  //   2nd: the actual section heading (this is what we want)
  // Bug fix: use the exact id attribute, NOT the last occurrence of "Champions"
  
  const ANCHOR_VARIANTS = [
    'id="Pokémon_Champions"',
    'id="Pok.C3.A9mon_Champions"',  // URL-encoded variant
  ];

  let sectionStart = -1;

  for (const anchor of ANCHOR_VARIANTS) {
    // Find ALL occurrences
    const positions: number[] = [];
    let pos = 0;
    while ((pos = html.indexOf(anchor, pos)) !== -1) {
      positions.push(pos);
      pos += anchor.length;
    }

    if (positions.length === 0) continue;

    // Use the LAST occurrence (the actual section, not TOC)
    // For both 1 or 2 occurrences, the last is the actual section
    sectionStart = positions[positions.length - 1];
    break;
  }

  if (sectionStart === -1) return [];

  // Find the movnivel table after the section heading
  const afterSection = html.slice(sectionStart);
  const tableStart   = afterSection.indexOf('<table class="movnivel"');
  if (tableStart === -1) return [];

  const tableEnd = afterSection.indexOf('</table>', tableStart) + '</table>'.length;
  const tableHtml = afterSection.slice(tableStart, tableEnd);

  // Parse with cheerio
  const $ = cheerio.load(tableHtml);
  const moves: string[] = [];

  $('tr').each((_, row) => {
    const firstTd = $(row).find('td').first();
    const name    = firstTd.find('a').first().text().trim();
    if (name && name.length > 1 && !moves.includes(name)) {
      moves.push(name);
    }
  });

  return moves;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🕷️  Wikidex Champions Learnset Scraper v2 (fixed)\n');

  const pokemonList: { name: string; slug: string; url: string }[] = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'champions_pokemon_list.json'), 'utf-8')
  );
  console.log(`Total Pokemon: ${pokemonList.length}`);

  // Load existing progress
  const existingMap = new Map<string, { pokemon: string; url: string; moves: string[] }>();
  if (fs.existsSync(LEARNSETS_OUT)) {
    const existing = JSON.parse(fs.readFileSync(LEARNSETS_OUT, 'utf-8'));
    existing.forEach((e: any) => existingMap.set(e.pokemon, e));
    const zeroMoves = existing.filter((e: any) => e.moves.length === 0).map((e: any) => e.pokemon);
    console.log(`Existing progress: ${existingMap.size} done, ${zeroMoves.length} need re-try (0 moves)`);
    console.log(`Re-trying: ${zeroMoves.join(', ')}\n`);
  }

  let errors = 0;
  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    const existing = existingMap.get(pokemon.name);

    // Skip if already done WITH moves (> 0)
    if (existing && existing.moves.length > 0) {
      process.stdout.write(`  [${(i+1).toString().padStart(3)}/${pokemonList.length}] ⏭  ${pokemon.name} (${existing.moves.length} moves)\n`);
      continue;
    }

    // Scrape (either first time or re-try for 0-move entries)
    process.stdout.write(`  [${(i+1).toString().padStart(3)}/${pokemonList.length}] ${pokemon.name.padEnd(22)}... `);
    try {
      const html  = await fetchPage(pokemon.url);
      const moves = extractChampionsMoves(html);
      existingMap.set(pokemon.name, { pokemon: pokemon.name, url: pokemon.url, moves });
      console.log(`✓ ${moves.length} moves`);
    } catch (err: any) {
      console.log(`✗ ERROR: ${err.message}`);
      errors++;
      if (!existingMap.has(pokemon.name)) {
        existingMap.set(pokemon.name, { pokemon: pokemon.name, url: pokemon.url, moves: [] });
      }
    }

    // Save after each
    const learnsets = Array.from(existingMap.values());
    fs.writeFileSync(LEARNSETS_OUT, JSON.stringify(learnsets, null, 2));

    if (i < pokemonList.length - 1) await sleep(DELAY_MS);
  }

  // Aggregate unique moves
  const allMoves = new Set<string>();
  existingMap.forEach(p => p.moves.forEach(m => allMoves.add(m)));
  const uniqueMoves = Array.from(allMoves).sort();
  fs.writeFileSync(MOVES_ES_OUT, JSON.stringify(uniqueMoves, null, 2));

  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Done!`);
  console.log(`   Pokemon: ${existingMap.size} | Errors: ${errors}`);
  console.log(`   Unique moves: ${uniqueMoves.length}`);
  const zeroLeft = Array.from(existingMap.values()).filter(p => p.moves.length === 0);
  if (zeroLeft.length > 0) {
    console.log(`   ⚠  Still 0 moves: ${zeroLeft.map(p => p.pokemon).join(', ')}`);
  }
}

main().catch(console.error);
