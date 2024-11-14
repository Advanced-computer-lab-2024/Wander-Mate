const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiration: { type: Date, required: true },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
