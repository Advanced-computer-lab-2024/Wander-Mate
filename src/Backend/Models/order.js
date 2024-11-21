const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Order", orderSchema);
