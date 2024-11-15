const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiration: { type: Date, required: true },
  },
  { timestamps: true, strict: false }
);
const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
