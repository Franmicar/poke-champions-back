import express from 'express';
import { calculateDamage } from '../controllers/calculator.controller.js';

const router = express.Router();

router.post('/calculate', calculateDamage);

export default router;
