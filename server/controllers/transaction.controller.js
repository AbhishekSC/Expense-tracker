import Budget from "../models/Budget.model.js";
import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler.js";
import { StatusCodes } from "http-status-codes";

async function addTransaction(req, res) {
  try {
    const { title, amount, category, type, date } = req.body;
    const txDate = new Date(date);
    const month = txDate.toISOString().slice(0, 7);

    if (!title || !amount || !category || !type) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Please provide all required fields",
        {},
        {}
      );
    }

    const newTx = new Transaction({
      userId: req.user._id,
      title,
      amount,
      category,
      type,
    });

    if (type === "expense") {
      const start = new Date(`${month}-01T00:00:00Z`);
      const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

      const budgets = await Budget.find({
        childId: req.user._id,
        category,
        month,
      });

      if (budgets.length === 0) {
        return sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "No Budget set for this category.",
          {},
          error.message
        );
      }

      const existingTx = await Transaction.find({
        userId: req.user._id,
        category,
        type: "expense",
        date: { $gte: start, $lt: end },
      });

      const totalSpend = existingTx.reduce((sum, t) => sum + t.amount, 0);
      const newTotal = totalSpend + amount;

      if (newTotal > budgets[0].limit) {
        return sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Budget limit exceeded. You can spend only ${
            budgets[0].limit - totalSpend
          } more on ${category}.`,
          {},
          {}
        );
      }
    }

    console.log("workes fine save tX");

    await newTx.save();

    return sendSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Transaction added successfully",
      { transaction: newTx },
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
async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });
    if (transactions.length === 0) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "No transactions found",
        {},
        {}
      );
    }

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Transactions retrieved successfully",
      { transactions: transactions },
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
async function updateTransactionById(req, res) {
  try {
    const txId = req.params.id;
    const userId = req.user._id;

    const tx = await Transaction.findOne({ _id: txId, userId: userId });

    if (!tx) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Transaction not found or does not belong to the user",
        {},
        {}
      );
    }

    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: txId, userId },
      req.body,
      {
        new: true,
      }
    );

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Transaction updated successfully",
      { transaction: updatedTx },
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
async function deleteTransaction(req, res) {
  try {
    const txId = req.params.id;
    const userId = req.user._id;

    const tx = await Transaction.findOne({ _id: txId, userId });

    if (!tx) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Transaction not found or does not belong to the user",
        {},
        {}
      );
    }

    const deletedTx = await Transaction.findOneAndDelete({
      _id: txId,
      userId: userId,
    });

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Transaction deleted successfully",
      { transaction: deletedTx },
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

async function getChildTransactions(req, res) {
  const parentId = req.user.id;
  const { childId } = req.params;

  try {
    const child = await User.findOne({ _id: childId, parentId, role: "child" });

    if (!child) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Child not found or linked to this parent",
        {},
        {}
      );
    }

    const transactions = await Transaction.find({ userId: childId }).sort({
      date: -1,
    });

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Child Information fetched successfully",
      {
        child: { id: child._id, name: child.name, email: child.email },
        count: transactions.length,
        transactions,
      },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal server error",
      {},
      error.message
    );
  }
}

export {
  addTransaction,
  getTransactions,
  updateTransactionById,
  deleteTransaction,
  getChildTransactions,
};
