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

    Maker: {
      type: ObjectId,
      ref: "Tourist",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true, strict: false }
);

const Complaints = mongoose.model("Complaints", complaintSchema);
module.exports = Complaints;
