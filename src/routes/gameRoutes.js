import express from 'express';
import { dealCards } from '../controllers/gameController.js';

const router = express.Router();

router.get('/deal/:cardType', dealCards);

export default router;