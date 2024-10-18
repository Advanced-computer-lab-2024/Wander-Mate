const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the item being rated
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the user who rated
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating value (1 to 5 stars)
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the rating was created
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
