import Transaction from "../models/Transaction.model.js";
import Budget from "../models/Budget.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler.js";
import { StatusCodes } from "http-status-codes";

async function createBudget(req, res) {
  const { childId, category, limit, month } = req.body;
  const parentId = req.user._id;

  if (!childId || !category || !limit || !month) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Please provide all required fields",
      {},
      {}
    );
  }

  if (!parentId) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "Unauthorized access",
      {},
      {}
    );
  }

  try {
    const budget = new Budget({
      parentId,
      childId,
      category,
      limit,
      month,
    });

    await budget.save();

    return sendSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Budget created successfully",
      { budget: budget },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal Server Error",
      {},
      error.message
    );
  }
}

async function getBudgetUsage(req, res) {
  const { childId } = req.params;
  const { month } = req.query;

  if (!childId || !month) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Please provide childId and month",
      {},
      {}
    );
  }

  try {
    const budgets = await Budget.find({ childId, month });

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const tx = await Transaction.find({
      userId: childId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const usage = budgets.map((budget) => {
      const spent = tx
        .filter(
          (t) =>
            t.category.toLowerCase() === budget.category.toLowerCase() &&
            t.type === "expense"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const percentUsed = (spent / budget.limit) * 100;
      let status = "green";
      if (percentUsed >= 90) {
        status = "red";
      } else if (percentUsed >= 75) {
        status = "yellow";
      }

      return {
        category: budget.category,
        spent,
        limit: budget.limit,
        percentUsed,
        status,
      };
    });
    sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Budget usage retrieved successfully",
      { usage },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal Server Error",
      {},
      error.message
    );
  }
}

async function getChildBudgetUsage(req, res) {
  const childId  = req.user._id;
  const { month } = req.query;

  if (!childId || !month) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Please provide childId and month",
      {},
      {}
    );
  }

  try {
    const budgets = await Budget.find({ childId, month });

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const tx = await Transaction.find({
      userId: childId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const usage = budgets.map((budget) => {
      const spent = tx
        .filter(
          (t) =>
            t.category.toLowerCase() === budget.category.toLowerCase() &&
            t.type === "expense"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const percentUsed = (spent / budget.limit) * 100;
      let status = "green";
      if (percentUsed >= 90) {
        status = "red";
      } else if (percentUsed >= 75) {
        status = "yellow";
      }

      return {
        category: budget.category,
        spent,
        limit: budget.limit,
        percentUsed,
        status,
      };
    });
    sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Budget usage retrieved successfully",
      { usage },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal Server Error",
      {},
      error.message
    );
  }
}

export { createBudget, getBudgetUsage, getChildBudgetUsage };
