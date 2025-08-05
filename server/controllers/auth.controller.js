import User from "../models/User.model.js";
import generateAccessToken from "../services/generateToken.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler.js";
import { StatusCodes } from "http-status-codes";
import { sanitizeUserData } from "../utils/sanitizeUser.js";

async function registerUser(req, res) {
  const { name, email, password, role, parentId } = req.body;
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
      role: role || "child",
      parentId,
    });

    generateAccessToken(newUser, res);
    await newUser.save();

    const sanitizedUser = sanitizeUserData(newUser);

    return sendSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      "User registered successfully",
      { user: sanitizedUser },
      {}
    );
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
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
async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
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
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid email or password",
        {},
        {}
      );
    }

    const isPasswordValid = await user.verifyCredentials(password);
    if (!isPasswordValid) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid email or password",
        {},
        {}
      );
    }

    generateAccessToken(user, res);
    const sanitizedUser = sanitizeUserData(user);

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      "User logged in successfully",
      { user: sanitizedUser },
      {}
    );
  } catch (error) {
    console.error(`Error logging in user: ${error.message}`);
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

export { registerUser, loginUser };
