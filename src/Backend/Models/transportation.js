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
  vehicleType: { type: String, required: true }, // e.g., Car, Bus, etc.
  availability: { type: Boolean, default: true }, // Availability status
});

const TransportationModel = mongoose.model(
  "Transportation",
  TransportationSchema
);
module.exports = TransportationModel; // Export the model for use in other files
