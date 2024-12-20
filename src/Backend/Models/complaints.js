const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Body: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
    reply: {
      Body: {
        type: String,
        required: true,
      },
      Date: {
        type: Date,
        default: Date.now,
      },
    },
    Status: {
      type: String,
      default: "Pending", // Default status
    },
    Maker: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, strict: false }
);

const Complaints = mongoose.model("Complaints", complaintSchema);
module.exports = Complaints;
