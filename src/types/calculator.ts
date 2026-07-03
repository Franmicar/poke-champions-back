export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonSet {
  name: string;
  item?: string;
  ability?: string;
  nature: string;
  evs: PokemonStats;
  ivs: PokemonStats;
  level: number;
  curHP?: number;
  status?: string;
  boosts: PokemonStats;
}

export interface MoveData {
  name: string;
  type: string;
  category: 'Físico' | 'Especial' | 'Estado';
  power: number;
  accuracy: number;
  hits?: number;
  isCrit?: boolean;
}

export interface FieldData {
  gameType: 'Singles' | 'Doubles';
  weather?: string;
  terrain?: string;
  isMagicRoom?: boolean;
  isWonderRoom?: boolean;
  isGravity?: boolean;
  attackerSide: SideConditions;
  defenderSide: SideConditions;
}

export interface SideConditions {
  isReflect?: boolean;
  isLightScreen?: boolean;
  isAuroraVeil?: boolean;
  isProtected?: boolean;
  isTailwind?: boolean;
}
