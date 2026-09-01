import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = Router();

/**
 * @route  GET /health
 * @desc   Liveness probe — returns { status: "ok" }
 * @access Public
 */
router.get('/', getHealth);

export default router;
