const mongoose = require("mongoose");

const TransportationSchema = new mongoose.Schema({
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
    required: true,
  }, // Reference to the advertiser
  destination: { type: String, required: true },
  startPlace: { type: String, required: true },
  price: { type: Number, required: true },
  vehicleType: {
    type: String,
    required: true,
    enum: ["Car", "Bus", "Boat", "Helicopter"],
  }, // e.g., Car, Bus, etc.
  availability: { type: Boolean, default: true }, // Availability status
  discount: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number, // Optional rating field
    min: 0,
    max: 5,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TransportationModel = mongoose.model(
  "Transportation",
  TransportationSchema
);
module.exports = TransportationModel; // Export the model for use in other files
