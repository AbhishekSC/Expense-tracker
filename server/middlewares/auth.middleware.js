import User from "../models/User.model.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {
  sendErrorResponse,
} from "../utils/responseHandler.js";
import StatusCodes from "http-status-codes";
import { sanitizeUserData } from "../utils/sanitizeUser.js";

async function authenticateUser(req, res, next) {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1]; // "Bearer token"
  if (!token) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "Access token is missing",
      {},
      {}
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid access token",
        {},
        {}
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "User not found",
        {},
        {}
      );
    }

    const sanitizedUser = sanitizeUserData(user);
    console.log("Authenticated user:", sanitizedUser);
    req.user = sanitizedUser;

    next();
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

export default authenticateUser;
