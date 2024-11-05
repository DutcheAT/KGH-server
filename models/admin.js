const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
    },
    socketId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["Admin", "Super Admin",],
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: { 
      type: String,
    },
    status: { 
      type: String,
      enum: ["active", "deactivated",],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
