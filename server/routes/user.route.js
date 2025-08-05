import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  creatChildAccount,
  getChildren,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/create-child",
  authenticateUser,
  role("parent"),
  creatChildAccount
);
router.get("/children", authenticateUser, role("parent"), getChildren);

export default router;
