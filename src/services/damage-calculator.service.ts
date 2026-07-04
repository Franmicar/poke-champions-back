import { calculate, Pokemon, Move, Field } from '@smogon/calc';
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { PokemonStats, PokemonSet, MoveData, FieldData } from '../types/calculator.js';
import { getStatModifier } from '../utils/natures.js';

const gen = new Generations(Dex).get(9);

export class DamageCalculatorService {
  
  static calculateStat(stat: keyof PokemonStats, base: number, ev: number, nature: string): number {
    if (stat === 'hp') {
      return base === 1 ? 1 : base + ev + 75;
    }
    const modifier = getStatModifier(nature, stat);
    return Math.floor((base + ev + 20) * modifier);
  }

  static calculateAllStats(baseStats: PokemonStats, evs: PokemonStats, nature: string): PokemonStats {
    return {
      hp: this.calculateStat('hp', baseStats.hp, evs.hp, nature),
      atk: this.calculateStat('atk', baseStats.atk, evs.atk, nature),
      def: this.calculateStat('def', baseStats.def, evs.def, nature),
      spa: this.calculateStat('spa', baseStats.spa, evs.spa, nature),
      spd: this.calculateStat('spd', baseStats.spd, evs.spd, nature),
      spe: this.calculateStat('spe', baseStats.spe, evs.spe, nature),
    };
  }

  static calculate(
    attackerSet: PokemonSet, 
    attackerBase: PokemonStats,
    defenderSet: PokemonSet,
    defenderBase: PokemonStats,
    moveData: MoveData,
    fieldData: FieldData
  ) {
    const attackerStats = this.calculateAllStats(attackerBase, attackerSet.evs, attackerSet.nature);
    const defenderStats = this.calculateAllStats(defenderBase, defenderSet.evs, defenderSet.nature);

    const attacker = new Pokemon(gen, attackerSet.name, {
      item: attackerSet.item as any,
      ability: attackerSet.ability as any,
      nature: attackerSet.nature as any,
      level: attackerSet.level,
      evs: attackerSet.evs as any,
      ivs: attackerSet.ivs as any,
      boosts: attackerSet.boosts as any,
    });

    const defender = new Pokemon(gen, defenderSet.name, {
      item: defenderSet.item as any,
      ability: defenderSet.ability as any,
      nature: defenderSet.nature as any,
      level: defenderSet.level,
      evs: defenderSet.evs as any,
      ivs: defenderSet.ivs as any,
      boosts: defenderSet.boosts as any,
    });

    // Override Stats with Champions Formula
    attacker.stats = attackerStats as any;
    defender.stats = defenderStats as any;
    
    // Also override HP for correct percentage calculation
    attacker.maxHP = attackerStats.hp;
    attacker.curHP = attackerSet.curHP !== undefined ? attackerSet.curHP : attackerStats.hp;
    defender.maxHP = defenderStats.hp;
    defender.curHP = defenderSet.curHP !== undefined ? defenderSet.curHP : defenderStats.hp;

    const move = new Move(gen, moveData.name, {
      isCrit: moveData.isCrit,
      hits: moveData.hits,
    });

    const field = new Field({
      gameType: fieldData.gameType,
      weather: fieldData.weather as any,
      terrain: fieldData.terrain as any,
      isMagicRoom: fieldData.isMagicRoom,
      isWonderRoom: fieldData.isWonderRoom,
      isGravity: fieldData.isGravity,
      attackerSide: fieldData.attackerSide as any,
      defenderSide: fieldData.defenderSide as any,
    });

    const result = calculate(gen, attacker, defender, move, field);

    let koChance = '0%';
    try {
      koChance = result.kochance();
    } catch (e) {
      // Default to 0% if kochance calculation fails (common when damage is 0)
    }

    return {
      attackerStats,
      defenderStats,
      damage: result.damage,
      description: result.desc(),
      koChance: koChance,
    };
  }
}
