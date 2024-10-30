import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, minLength: 2, trim: true },
    lastName: { type: String, required: true, minLength: 2, trim: true },
    birthdate: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    favouriteFlatList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flat", default: [] }],
    userFlatCount: { type: Number },
  },
  { strict: true, timestamps: true }
);

userSchema.post("find", async function (docs, next) {
  for (const user of docs) {
    // Count the related Flat documents for each user
    const flatCount = await mongoose.model("Flat").countDocuments({ ownerId: user._id });
    user.userFlatCount = flatCount; // Set the count in the user object
  }

  next(); // Proceed to the next middleware or return results
});

const User = mongoose.model("User", userSchema);

export default User;
