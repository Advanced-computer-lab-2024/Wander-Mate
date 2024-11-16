const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the item being rated
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the user who rated
  username: {
    type: String,
  },
  review: { type: String, required: true }, // Rating value (1 to 5 stars)
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the rating was created
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
