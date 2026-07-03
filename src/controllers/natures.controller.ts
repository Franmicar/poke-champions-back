import type { Request, Response } from 'express';
import Nature from '../models/Nature.js';

export const getAllNatures = async (req: Request, res: Response) => {
  try {
    const natures = await Nature.find({}).sort({ name: 1 }).lean();
    res.json(natures);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
