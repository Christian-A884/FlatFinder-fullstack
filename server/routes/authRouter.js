import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", authController.logoutUser);
authRouter.get("/checkoutSession", authController.checkSession);

export default authRouter;
