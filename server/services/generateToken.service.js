import StatusCode from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { access } from "fs";

async function generateAccessToken(user, res) {
  try {
    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: "HS256",
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, options);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 7 day
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    return accessToken;
  } catch (error) {
    console.error(`Error generating token: ${error.message}`);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      data: {},
      error: error.message,
    });
  }
}

export default generateAccessToken;
