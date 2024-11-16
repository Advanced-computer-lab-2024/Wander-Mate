const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  name: {
    type: String,
    required: true, // The name of the product
  },
  price: {
    type: Number,
    required: true, // Price per unit
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1
  },
  total: {
    type: Number, // Calculated as price * quantity
  },
  attributes: {
    type: Map, // Key-value pairs for product-specific attributes like size, color
    of: String,
    default: {},
  },
  picture: {
    type: String,
  },
});

CartItemSchema.pre("save", function (next) {
  // Automatically calculate total
  this.total = this.price * this.quantity;
  next();
});

const CartSchema = new mongoose.Schema({
  touristID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tourist",
  },
  items: [CartItemSchema], // Array of cart items
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of when the cart was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp of last cart update
  },
});

CartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  // Calculate `subtotal` as the sum of all `total` fields
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  next();
});

module.exports = mongoose.model("Cart", CartSchema);
