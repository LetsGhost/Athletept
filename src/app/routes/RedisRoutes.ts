import express from 'express';

// Import Middlewares

import limiter from '../middleware/Limiter';
import AuthenticateRole from '../middleware/AuthenticateRole';
import AuthenticateToken from '../middleware/AuthenticateToken';
import { performanceLogger } from '../middleware/Performance';

import RedisAnalyticsController from '../controllers/RedisAnalyticsController';

// Import routes
const router = express.Router();

router.use(performanceLogger);

router.get('/getDurations/:path', RedisAnalyticsController.getDurations);

export default router;
