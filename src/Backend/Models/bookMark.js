const mongoose = require("mongoose");

const bookMarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  event: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eventModel",
    },
  ],
  eventModel: {
    type: String,
    enum: ["Attraction", "Itinerary"],
  },
});

module.exports = mongoose.model("BookMark", bookMarkSchema);
