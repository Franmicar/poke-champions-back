/**
 * Script que descarga los iconos de tipo y categoría de Wikidex CDN
 * y los guarda en public/assets/types/ y public/assets/categories/.
 *
 * Ejecutar desde el directorio backend:
 *   npx tsx src/scripts/download-type-icons.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TYPES_DIR     = path.resolve(__dirname, '../../../frontend/public/assets/types');
const CATS_DIR      = path.resolve(__dirname, '../../../frontend/public/assets/categories');
const WIKIDEX_BASE  = 'https://images.wikidexcdn.net/mwuploads/wikidex/';

// Iconos de tipo: nombreLocal → ruta en WikiDex CDN
const TYPE_ICONS: Record<string, string> = {
  'normal.svg':    'c/c3/latest/20230128125621/Tipo_normal_icono_EP.svg',
  'fire.svg':      '5/55/latest/20230128125153/Tipo_fuego_icono_EP.svg',
  'water.svg':     'd/d6/latest/20230128124702/Tipo_agua_icono_EP.svg',
  'grass.svg':     'e/ed/latest/20230128125654/Tipo_planta_icono_EP.svg',
  'electric.svg':  '8/84/latest/20230128125008/Tipo_el%C3%A9ctrico_icono_EP.svg',
  'ice.svg':       'a/a6/latest/20230128125423/Tipo_hielo_icono_EP.svg',
  'fighting.svg':  'f/f2/latest/20230128125518/Tipo_lucha_icono_EP.svg',
  'poison.svg':    'f/fa/latest/20230128132735/Tipo_veneno_icono_EP.svg',
  'ground.svg':    'c/c8/latest/20230128132625/Tipo_tierra_icono_EP.svg',
  'flying.svg':    '6/6b/latest/20230128132815/Tipo_volador_icono_EP.svg',
  'psychic.svg':   '2/22/latest/20230128125735/Tipo_ps%C3%ADquico_icono_EP.svg',
  'bug.svg':       '1/1a/latest/20230128124809/Tipo_bicho_icono_EP.svg',
  'rock.svg':      '1/14/latest/20230128125805/Tipo_roca_icono_EP.svg',
  'ghost.svg':     '3/3d/latest/20230128125103/Tipo_fantasma_icono_EP.svg',
  'dragon.svg':    '1/15/latest/20230128124905/Tipo_drag%C3%B3n_icono_EP.svg',
  'dark.svg':      'e/e0/latest/20230128132504/Tipo_siniestro_icono_EP.svg',
  'steel.svg':     '6/6c/latest/20230128124521/Tipo_acero_icono_EP.svg',
  'fairy.svg':     'b/b7/latest/20230128125233/Tipo_hada_icono_EP.svg',
};

// Iconos de categoría: nombreLocal → ruta en WikiDex CDN
const CAT_ICONS: Record<string, string> = {
  'physical.png': '6/6f/latest/20260409212436/Clase_f%C3%ADsico_Champions.png',
  'special.png':  '8/8f/latest/20260409212512/Clase_especial_Champions.png',
  'status.png':   '3/33/latest/20260409212544/Clase_estado_Champions.png',
};

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
      if (!res.statusCode || res.statusCode >= 400) {
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

async function downloadSet(
  icons: Record<string, string>,
  destDir: string,
  label: string
) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`📁 Creado: ${destDir}`);
  }

  console.log(`\n🎨 Descargando ${label}...`);
  let ok = 0, skip = 0, fail = 0;

  for (const [localName, wikiPath] of Object.entries(icons)) {
    const destPath = path.join(destDir, localName);
    if (fs.existsSync(destPath)) {
      console.log(`⏭️  ${localName} — ya existe`);
      skip++;
      continue;
    }

    const url = WIKIDEX_BASE + wikiPath;
    process.stdout.write(`⬇️  ${localName}... `);
    const success = await downloadFile(url, destPath);
    if (success) {
      console.log('✅');
      ok++;
    } else {
      console.log('❌');
      fail++;
    }
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`   ✅ ${ok}  ⏭️ ${skip}  ❌ ${fail}`);
}

async function main() {
  await downloadSet(TYPE_ICONS, TYPES_DIR, 'iconos de tipo');
  await downloadSet(CAT_ICONS, CATS_DIR, 'iconos de categoría');
  console.log('\n✅ Completo');
}

main().catch(err => { console.error('❌', err); process.exit(1); });
