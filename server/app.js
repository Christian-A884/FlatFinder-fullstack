import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import guestUserRouter from "./routes/guestUserRouter.js";
import usersRouter from "./routes/usersRouter.js";
import flatsRouter from "./routes/flatsRouter.js";
import resetPasswordRouter from "./routes/resetPasswordRouter.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use("/api/photos", express.static("utils/flatPhotos"));

app.use("/api/auth", authRouter);
app.use("/api/guestUser", guestUserRouter);
app.use("/api/users", usersRouter);
app.use("/api/message", flatsRouter);
app.use("/api/flats", flatsRouter);
app.use("/api/reset-password", resetPasswordRouter);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Server connection succeed");
  } catch (error) {
    throw error;
  }
};

app.listen(process.env.PORT || 3000, async () => {
  try {
    await connect();
  } catch (error) {
    console.log("Can't connect to database");
  }
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
