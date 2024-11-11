const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristSchema = new Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    FullName: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: String,
      required: true,
    },
    Nationality: {
      type: ObjectId,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
    Wallet: {
      type: Number,
      required: true,
    },
    Points: {
      type: Number,
      required: true,
    },
    Badge: {
      type: String,
      required: true,
    },
    PreferenceTags: {
      type: [ObjectId],
      default: [],
    },

  },
  { timestamps: true, strict: false }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
