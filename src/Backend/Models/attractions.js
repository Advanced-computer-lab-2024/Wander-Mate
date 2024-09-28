const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const attractionSchema = new Schema(
  {
    Location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true, strict: false }
);

const Attraction = mongoose.model("Attraction", attractionSchema);
module.exports = Attraction;
