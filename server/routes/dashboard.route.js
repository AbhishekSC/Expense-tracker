import express from 'express';
import authenticateUser from '../middlewares/auth.middleware.js';
import { childDashboard, parentDashboard } from '../controllers/dashboard.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router= express.Router();

router.get("/parent", authenticateUser, roleMiddleware("parent"), parentDashboard);
router.get("/child", authenticateUser, childDashboard);

export default router;