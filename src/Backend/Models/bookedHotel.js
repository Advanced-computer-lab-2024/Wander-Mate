const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

const hotelBookedSchema = new Schema(
  {
    userId: { type: String, required: true, refPath: "Tourist" },
    title: { type: String, required: true },
    hotelId: { type: String, required: true },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const HotelBooked = mongoose.model("HotelBooked", hotelBookedSchema);
module.exports = HotelBooked;
