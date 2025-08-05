import { StatusCodes } from "http-status-codes";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import Budget from "../models/Budget.model.js";

// Overview of children and their spending
async function parentDashboard(req, res) {
  try {
    const children = await User.find({
      parentId: req.user.id,
      role: "child",
    }).select("-password");
    const result = [];

    for (const child of children) {
      const transaction = await Transaction.find({ userId: child._id });
      const totalSpent = transaction
        .filter((tx) => tx.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

      const budget = await Budget.find({ childId: child._id });
      const totalBudget = budget.reduce((acc, curr) => acc + curr.limit, 0);

      result.push({
        childId: child._id,
        name: child.name,
        totalSpent,
        totalBudget,
        remmaining: totalBudget - totalSpent,
        usagePercent: totalBudget
          ? ((totalSpent / totalBudget) * 100).toFixed(2)
          : 0,
      });
    }

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Dashboard information retrieved successfully",
      { result },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Dashboard fetch error",
      {},
      error.message
    );
  }
}

// Children's personal balance, transactions, usage
async function childDashboard(req, res) {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = Math.max(income - expense, 0);

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Dashboard fetch successfully",
      {
        balance,
        income,
        expense,
        recent: transactions.slice(0, 5),
      },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Dashboard fetch error",
      {},
      error.message
    );
  }
}

export { parentDashboard, childDashboard };
