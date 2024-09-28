const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const attractionsSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Category: {
      type: ObjectId,
      required: true,
    },
    tags: [String], // array of tags
    description: String,
  },
  { timestamps: true }
);

const Attractions = mongoose.model("Attractions", attractionsSchema);
module.exports = Attractions;
