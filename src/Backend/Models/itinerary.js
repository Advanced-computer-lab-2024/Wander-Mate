const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const itinerarySchema = new Schema(
  {
    Activities: {
      type: [ObjectId],
      required: true,
    },
    LocationsToVisit: {
      type: [ObjectId],
      required: true,
    },
    TimeLine: {
      type: String,
    },
    Language: {
      type: String,
      required: true,
    }, 
    Price: { type: String, required: true },
    AvailableDates: { type: [Date], required: true },
    PickUpLocation: {
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
    DropOffLocation: {
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

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
