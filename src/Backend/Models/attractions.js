const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const attractionSchema = new Schema(
  {
    Creator: { type: String, required: true, refPath: "CreatorModel" },
    CreatorModel: {
      type: String,
      required: true,
      default: "Advertiser",
      enum: ["Advertiser", "TourismGoverner"],
    },
    Name: { type: String, required: true },
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
    Type: {
      type: ObjectId,
      required: true,
    },
    Tags: {
      type: [ObjectId],
    },
    TicketPrices: {
      type: [[String, Number]],
    },
    Price: {
      type: Number
    }
  },
  { timestamps: true, strict: false }
);

const Attraction = mongoose.model("Attraction", attractionSchema);
module.exports = Attraction;
