import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["parent", "child"],
      default: "child",
      lowercase: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

// **Pre Hooks(Middlewares)**: For password hashing
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(new Error("Failed to hash password"));
  }
});

// **Methods**
userSchema.methods.verifyCredentials = async function (password) {
  console.log(password, this.password);
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Failed to verify credentials");
  }
};

const User = mongoose.model("User", userSchema);

export default User;
