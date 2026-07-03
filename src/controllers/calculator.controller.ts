import type { Request, Response } from 'express';
import { DamageCalculatorService } from '../services/damage-calculator.service.js';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';

export const calculateDamage = async (req: Request, res: Response) => {
  try {
    const { attacker, defender, moveName, field } = req.body;
    console.log('Calculate Request:', JSON.stringify({ attacker, defender, moveName }, null, 2));

    const attackerData = await Pokemon.findOne({ name: attacker.name }).lean();
    const defenderData = await Pokemon.findOne({ name: defender.name }).lean();
    const moveData = await Move.findOne({ name: moveName }).lean();

    if (!attackerData || !defenderData || !moveData) {
      return res.status(404).json({ message: 'Pokémon or Move not found' });
    }

    const result = DamageCalculatorService.calculate(
      attacker,
      (attackerData as any).baseStats,
      defender,
      (defenderData as any).baseStats,
      moveData as any,
      field || {
        gameType: 'Singles',
        attackerSide: {},
        defenderSide: {}
      }
    );

    res.json(result);
  } catch (error: any) {
    console.error('Calculation Error:', error);
    res.status(500).json({ message: error.message });
  }
};
