import mongoose from 'mongoose';
import Item from '../models/Item.js';

// Mapeo: clave actual de la BD (española/corrupta) → clave estándar i18n (inglesa)
const KEY_MAP: Record<string, string> = {
  // Bayas
  'item.baya_zreza': 'item.cheri_berry',
  'item.baya_atania': 'item.chesto_berry',
  'item.baya_durazbaya_meloc': 'item.pecha_berry',
  'item.baya_safre': 'item.rawst_berry',
  'item.baya_perasi': 'item.aspear_berry',
  'item.baya_zanama': 'item.leppa_berry',
  'item.baya_aranja': 'item.oran_berry',
  'item.baya_caquic': 'item.persim_berry',
  'item.baya_ziuela': 'item.lum_berry',
  'item.baya_citrnbaya_zidra': 'item.sitrus_berry',
  'item.baya_caoca': 'item.occa_berry',
  'item.baya_pasio': 'item.passho_berry',
  'item.baya_gualot': 'item.wacan_berry',
  'item.baya_tamar': 'item.rindo_berry',
  'item.baya_rimoya': 'item.yache_berry',
  'item.baya_pomaro': 'item.chople_berry',
  'item.baya_kebia': 'item.kebia_berry',
  'item.baya_acardo': 'item.shuca_berry',
  'item.baya_kouba': 'item.coba_berry',
  'item.baya_payapa': 'item.payapa_berry',
  'item.baya_yecana': 'item.tanga_berry',
  'item.baya_alcho': 'item.charti_berry',
  'item.baya_drasi': 'item.kasib_berry',
  'item.baya_anjiro': 'item.haban_berry',
  'item.baya_dillo': 'item.colbur_berry',
  'item.baya_barib': 'item.babiri_berry',
  'item.baya_chilan': 'item.chilan_berry',
  'item.baya_hibis': 'item.roseli_berry',
  // Objetos competitivos
  'item.polvo_brillo': 'item.bright_powder',
  'item.hierba_blanca': 'item.white_herb',
  'item.garra_rpida': 'item.quick_claw',
  'item.hierba_mental': 'item.mental_herb',
  'item.roca_del_rey': 'item.kings_rock',
  'item.polvo_plata': 'item.silver_powder',
  'item.cinta_aguante': 'item.focus_band',
  'item.periscopio': 'item.scope_lens',
  'item.revestimiento_metlico': 'item.metal_coat',
  'item.restos': 'item.leftovers',
  'item.bola_luminosa': 'item.light_ball',
  'item.arena_fina': 'item.soft_sand',
  'item.piedra_dura': 'item.hard_stone',
  'item.semilla_milagro': 'item.miracle_seed',
  'item.lentes_de_solgafas_de_sol': 'item.black_glasses',
  'item.cinturn_negro': 'item.black_belt',
  'item.imn': 'item.magnet',
  'item.agua_mstica': 'item.mystic_water',
  'item.pico_afilado': 'item.sharp_beak',
  'item.flecha_venenosa': 'item.poison_barb',
  'item.hielo_perpetuo': 'item.never_melt_ice',
  'item.hechizo': 'item.spell_tag',
  'item.cuchara_torcida': 'item.twisted_spoon',
  'item.carbn': 'item.charcoal',
  'item.colmillo_dragncolmillo_de_dragn': 'item.dragon_fang',
  'item.pauelo_de_seda': 'item.silk_scarf',
  'item.cascabel_ncarcascabel_concha': 'item.shell_bell',
  'item.lupa': 'item.wide_lens',
  'item.cinta_fuerte': 'item.muscle_band',
  'item.lentes_especialesgafas_especiales': 'item.wise_glasses',
  'item.cinturn_de_experto': 'item.expert_belt',
  'item.refleluz': 'item.light_clay',
  'item.vidaesferavidasfera': 'item.life_orb',
  'item.banda_aguante': 'item.focus_sash',
  'item.telescopio': 'item.zoom_lens',
  'item.metrnomo': 'item.metronome',
  'item.bola_frrea': 'item.iron_ball',
  'item.roca_helada': 'item.icy_rock',
  'item.roca_suave': 'item.smooth_rock',
  'item.roca_calor': 'item.heat_rock',
  'item.roca_lluvia': 'item.damp_rock',
  'item.pauelo_eleccin': 'item.choice_scarf',
  'item.muda_de_pielmuda_concha': 'item.shed_shell',
  'item.raz_grande': 'item.big_root',
  'item.pluma_ferica': 'item.fairy_feather',
  // Mega Piedras
  'item.gengarita': 'item.gengarite',
  'item.gardevoirita': 'item.gardevoirite',
  'item.ampharosita': 'item.ampharosite',
  'item.venusaurita': 'item.venusaurite',
  'item.charizardita_x': 'item.charizardite_x',
  'item.blastoisita': 'item.blastoisite',
  'item.blazikenita': 'item.blazikenite',
  'item.medichamita': 'item.medichamite',
  'item.houndoomita': 'item.houndoomite',
  'item.aggronita': 'item.aggronite',
  'item.banettita': 'item.banettite',
  'item.tyranitarita': 'item.tyranitarite',
  'item.scizorita': 'item.scizorite',
  'item.pinsirita': 'item.pinsirite',
  'item.aerodactylita': 'item.aerodactylite',
  'item.lucarita': 'item.lucarite',
  'item.abomasnowita': 'item.abomasnowite',
  'item.kangaskhanita': 'item.kangaskhanite',
  'item.gyaradosita': 'item.gyaradosite',
  'item.absolita': 'item.absolite',
  'item.charizardita_y': 'item.charizardite_y',
  'item.alakazamita': 'item.alakazamite',
  'item.heracrossita': 'item.heracrossite',
  'item.mawilita': 'item.mawilite',
  'item.manectricita': 'item.manectricite',
  'item.garchompita': 'item.garchompite',
  'item.swampertita': 'item.swampertite',
  'item.sceptilita': 'item.sceptilite',
  'item.sableynita': 'item.sableynite',
  'item.altarianita': 'item.altarianite',
  'item.galladita': 'item.galladite',
  'item.audinita': 'item.audinite',
  'item.metagrossita': 'item.metagrossite',
  'item.sharpedonita': 'item.sharpedonite',
  'item.slowbronita': 'item.slowbronite',
  'item.steelixita': 'item.steelixite',
  'item.pidgeotita': 'item.pidgeotite',
  'item.glalita': 'item.glalite',
  'item.cameruptita': 'item.cameruptite',
  'item.lopunnita': 'item.lopunnite',
  'item.beedrillita': 'item.beedrillite',
  'item.clefablita': 'item.clefablite',
  'item.victreebelita': 'item.victreebelite',
  'item.starmita': 'item.starmite',
  'item.dragonitita': 'item.dragonitite',
  'item.meganiumita': 'item.meganiumite',
  'item.feraligatrita': 'item.feraligatrite',
  'item.skarmorita': 'item.skarmorite',
  'item.froslassita': 'item.froslassite',
  'item.emboarita': 'item.emboarite',
  'item.excadrillita': 'item.excadrillite',
  'item.scolipedita': 'item.scolipedite',
  'item.scraftita': 'item.scraftite',
  'item.eelektrossita': 'item.eelektrossite',
  'item.chandelurita': 'item.chandelurite',
  'item.chesnaughtita': 'item.chesnaughtite',
  'item.delphoxita': 'item.delphoxite',
  'item.greninjanita': 'item.greninjanite',
  'item.pyroarita': 'item.pyroarite',
  'item.floettita': 'item.floettite',
  'item.malamarita': 'item.malamarite',
  'item.barbaraclita': 'item.barbaraclite',
  'item.dragalgita': 'item.dragalgite',
  'item.hawluchanita': 'item.hawluchanite',
  'item.drampanita': 'item.drampanite',
  'item.falinksita': 'item.falinksite',
  'item.raichunita_x': 'item.raichunite_x',
  'item.raichunita_y': 'item.raichunite_y',
  'item.chimechita': 'item.chimechite',
  'item.staraptorita': 'item.staraptorite',
  'item.golurkita': 'item.golurkite',
  'item.meowsticita': 'item.meowsticite',
  'item.crabominablita': 'item.crabominablite',
  'item.scovillainita': 'item.scovillainite',
  'item.glimmoranita': 'item.glimmoranite',
};

async function migrate() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('✅ Conectado a MongoDB');

  const items = await Item.find({});
  console.log(`📦 Total items en BD: ${items.length}\n`);

  let updated = 0;
  let skipped = 0;
  let notFound: string[] = [];

  for (const item of items) {
    const standardKey = KEY_MAP[item.key];

    if (!standardKey) {
      if (!item.key.startsWith('item.cheri') && !item.key.startsWith('item.sitrus')) {
        // Solo reportar los que no son ya correctos
      }
      notFound.push(`"${item.name}" (key: ${item.key})`);
      continue;
    }

    await Item.updateOne({ _id: item._id }, { $set: { key: standardKey } });
    console.log(`✏️  ${item.key}  →  ${standardKey}`);
    updated++;
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ⏭️  Ya correctos: ${skipped}`);
  if (notFound.length > 0) {
    console.log(`   ❓ Sin mapeo (${notFound.length}):`);
    notFound.forEach(n => console.log(`      - ${n}`));
  }

  await mongoose.disconnect();
  console.log('\n✅ Migración completa');
}

migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
