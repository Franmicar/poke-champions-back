/**
 * Script que parsea la página de Wikidex de objetos de Pokémon Champions,
 * descarga todas las imágenes y actualiza el campo `sprite` en MongoDB.
 *
 * Ejecutar desde el directorio backend:
 *   npx tsx src/scripts/download-item-sprites.ts
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

import Item from '../models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SPRITES_DIR = path.resolve(__dirname, '../../../frontend/public/assets/items');
const CHAMPIONS_PAGE = 'https://www.wikidex.net/wiki/Lista_de_objetos_de_Pok%C3%A9mon_Champions';

// Descarga texto de una URL
function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PokemonChampionsBot/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location!).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Convierte URL de thumbnail a URL de imagen completa
// De: .../thumb/a/b/latest/TIMESTAMP/File.png/32px-File.png
// A:  .../a/b/latest/TIMESTAMP/File.png
function thumbToFull(thumbUrl: string): string {
  return thumbUrl.replace('/thumb/', '/').replace(/\/\d+px-[^/]+$/, '');
}

// Parsea el HTML de la página y extrae {name, imgUrl} de cada fila
function parseItemsFromHtml(html: string): Array<{ name: string; imgUrl: string }> {
  const result: Array<{ name: string; imgUrl: string }> = [];

  // Dividir por filas <tr>
  const rows = html.split('<tr>');
  for (const row of rows) {
    // Solo filas con imagen de objeto
    if (!row.includes('noagrandar') && !row.includes('mw-file-element')) continue;

    // Extraer src de la imagen
    const imgMatch = row.match(/src="(https:\/\/images\.wikidexcdn\.net[^"]+\/\d+px-[^"]+)"/);
    if (!imgMatch) continue;

    // Extraer nombre del item (primer <b><a> en la fila)
    const nameMatch = row.match(/<b><a[^>]*>([^<]+)<\/a><\/b>/);
    if (!nameMatch) continue;

    const thumbUrl = imgMatch[1];
    const itemName = nameMatch[1].trim();
    const fullUrl = thumbToFull(thumbUrl);

    result.push({ name: itemName, imgUrl: fullUrl });
  }

  return result;
}

// Descarga un archivo
function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'PokemonChampionsBot/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        downloadFile(res.headers.location!, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

// Normaliza nombre para comparación
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .trim();
}

async function main() {
  if (!fs.existsSync(SPRITES_DIR)) {
    fs.mkdirSync(SPRITES_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${SPRITES_DIR}`);
  }

  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('✅ Conectado a MongoDB');

  // 1. Obtener página
  console.log('📥 Descargando página de Champions...');
  const html = await fetchText(CHAMPIONS_PAGE);

  // 2. Parsear items
  const pageItems = parseItemsFromHtml(html);
  console.log(`📋 Items encontrados en la página: ${pageItems.length}\n`);

  // 3. Cargar items de la BD
  const dbItems = await Item.find({});

  // Construir mapa de nombre normalizado → DB item
  // Cada item de BD puede tener nombre "Nombre1/Nombre2" (variantes regionales)
  const nameToDbItem = new Map<string, typeof dbItems[0]>();
  for (const dbItem of dbItems) {
    const parts = dbItem.name.split('/');
    for (const part of parts) {
      nameToDbItem.set(normalizeName(part), dbItem);
    }
  }

  let downloaded = 0;
  let skipped = 0;
  const notMatched: string[] = [];

  for (const pageItem of pageItems) {
    const key = normalizeName(pageItem.name);
    const dbItem = nameToDbItem.get(key);

    if (!dbItem) {
      notMatched.push(pageItem.name);
      continue;
    }

    // Extraer nombre de archivo de la URL
    const filename = pageItem.imgUrl.split('/').pop()!;
    const localPath = path.join(SPRITES_DIR, filename);
    const spriteRelative = `/assets/items/${filename}`;

    if (fs.existsSync(localPath)) {
      await Item.updateOne({ _id: dbItem._id }, { $set: { sprite: spriteRelative } });
      console.log(`⏭️  "${pageItem.name}" → ya existe`);
      skipped++;
      continue;
    }

    process.stdout.write(`⬇️  "${pageItem.name}"... `);
    const ok = await downloadFile(pageItem.imgUrl, localPath);

    if (!ok) {
      console.log(`❌ Error descargando`);
      continue;
    }

    await Item.updateOne({ _id: dbItem._id }, { $set: { sprite: spriteRelative } });
    console.log(`✅`);
    downloaded++;

    await new Promise(r => setTimeout(r, 150)); // pausa cortés
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Descargados: ${downloaded}`);
  console.log(`   ⏭️  Ya existían: ${skipped}`);
  console.log(`   ❓ Sin match en BD: ${notMatched.length}`);
  if (notMatched.length > 0) {
    console.log(`   Items no encontrados en BD:`);
    notMatched.forEach(n => console.log(`      - "${n}"`));
  }

  await mongoose.disconnect();
  console.log('\n✅ Completo');
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });
