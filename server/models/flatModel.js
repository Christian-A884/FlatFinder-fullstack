import mongoose from "mongoose";
import User from "./userModel.js";

const flatSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    streetName: { type: String, required: true, trim: true },
    streetNumber: { type: String, required: true, trim: true },
    areaSize: { type: Number, required: true, trim: true },
    hasAC: { type: Boolean, required: true },
    yearBuilt: { type: Number, required: true, trim: true },
    rentPrice: { type: Number, required: true, trim: true },
    dateAvailable: { type: Date, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    description: { type: String, required: true },
    photoURL: { type: String, required: true, trim: true },
  },
  { timestamps: true, strict: true }
);

const Flat = mongoose.model("Flat", flatSchema);

export default Flat;
