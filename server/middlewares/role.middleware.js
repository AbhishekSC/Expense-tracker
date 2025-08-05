import { sendErrorResponse } from "../utils/responseHandler.js";
import { StatusCodes } from "http-status-codes";

function roleMiddleware(expectedRole) {
  return async function (req, res, next) {
    const user = req.user;
    if (!user || !user.role) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "User role is missing",
        {},
        {}
      );
    }

    if (user.role !== expectedRole) {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        false,
        "You do not have permission to access this resource",
        {},
        {}
      );
    }

    // This role is valid, continue to the next middleware
    next();
  };
}

export default roleMiddleware;
