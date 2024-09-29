const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    picture: {
      data: Buffer,
      contentType: String,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the User model
      ref: "User",
      required: true,
    },
    ratings: {
      type: Number, // Optional rating field
      min: 0,
      max: 5,
    },
    reviews: [String],
  },
  { timestamps: true, strict: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
