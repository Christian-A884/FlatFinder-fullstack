import User from "./userModel.js";
import Flat from "./flatModel.js";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    flatId: { type: mongoose.Schema.Types.ObjectId, ref: Flat, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  },
  { strict: true, timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
