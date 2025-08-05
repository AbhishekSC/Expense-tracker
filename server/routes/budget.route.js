import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  createBudget,
  getBudgetUsage,
  getChildBudgetUsage
} from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/", authenticateUser, role("parent"), createBudget);
router.get("/usage/:childId", authenticateUser, role("parent"), getBudgetUsage);
router.get("/usage", authenticateUser, role("child"), getChildBudgetUsage);

export default router;
