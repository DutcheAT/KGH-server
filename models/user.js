const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
   phone: {
    type: String,
    unique: true,
    required: true,
  },
    image: 
    {
      type: String,
      default: "image-1686746917955.webp",
    },
   policyAgreement: 
    { type: Boolean, required: true },
    password: {
      type: String,
      required: true,
    },
   otp: 
    { type: String },
    socketId: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // role: {
    //   type: String,
    //   enum: ["Farmer", "Service Provider", "Both"],
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
