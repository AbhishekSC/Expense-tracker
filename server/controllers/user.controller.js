import User from "../models/User.model.js";
import { StatusCodes } from "http-status-codes";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler.js";
import { sanitizeUserData } from "../utils/sanitizeUser.js";

async function creatChildAccount(req, res) {
  const { name, email, password } = req.body;
  const parentId = req.user.id;
  if (!name || !email || !password) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      "Please provide all required fields",
      {},
      {}
    );
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "User already exists",
        {},
        {}
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "child",
      parentId,
    });

    await newUser.save();
    const sanitizedUser = sanitizeUserData(newUser);

    return sendSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Child account created successfully",
      { child: sanitizedUser },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal Server Error",
      {},
      error
    );
  }
}

async function getChildren(req, res) {
  try {
    const children = await User.find({
      parentId: req.user.id,
      role: "child",
    }).select("-password");
    if (children.length === 0) {
      return sendSuccessResponse(
        res,
        StatusCodes.OK,
        true,
        "No children found",
        { children: [] },
        {}
      );
    }

    const sanitizedUser = sanitizeUserData(children);
    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "Children retrieved successfully",
      { children: sanitizedUser },
      {}
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      "Internal Server Error",
      {},
      error
    );
  }
}

export { creatChildAccount, getChildren };
