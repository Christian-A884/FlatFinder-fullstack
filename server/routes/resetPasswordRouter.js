import express from "express";
import authController from "../controllers/authController.js";

const resetPasswordRouter = express.Router();

resetPasswordRouter.post("/request", authController.sendPasswordLink);
resetPasswordRouter.post("/reset/:token", authController.resetPassword);

export default resetPasswordRouter;
