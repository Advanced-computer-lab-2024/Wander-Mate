const mongoose = require("mongoose");
const moment = require("moment"); // We will use this for formatting the date

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
  quantities: {
    type: [Number], // Array of quantities corresponding to products
    default: [], // Default to an empty array
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
  invoiceNumber: {
    type: String,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const counterSchema = new mongoose.Schema({
  yearMonth: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

orderSchema.pre("save", async function (next) {
  const currentYearMonth = moment().format("YYYY-MM");

  if (!this.invoiceNumber) {
    try {
      // Use findOneAndUpdate to atomically increment the counter
      const counter = await Counter.findOneAndUpdate(
        { yearMonth: currentYearMonth },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create if not exists
      );

      const newInvoiceNumber = `#${currentYearMonth}-${counter.seq
        .toString()
        .padStart(3, "0")}`;

      this.invoiceNumber = newInvoiceNumber;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
