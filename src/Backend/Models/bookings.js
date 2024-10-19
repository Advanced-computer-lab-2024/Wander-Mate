const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchmea = new Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "itemModel",
  },
  itemModel: {
    type: String,
    required: true, // This will contain the model name
    enum: ["Attraction", "Itinerary"], // Limit to valid model names
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the user who rated
  bookedDate: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the rating was created
});

const Booking = mongoose.model("Booking", bookingSchmea);
module.exports = Booking;
