import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransactionById,
  getChildTransactions
} from "../controllers/transaction.controller.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, addTransaction);
router.get("/", authenticateUser, getTransactions);
router.put("/:id", authenticateUser, updateTransactionById);
router.delete("/:id", authenticateUser, deleteTransaction);

router.get("/child/:childId", authenticateUser, roleMiddleware("parent"), getChildTransactions);

export default router;
