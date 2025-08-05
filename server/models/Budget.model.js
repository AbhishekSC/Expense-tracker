import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
