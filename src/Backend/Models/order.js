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

// Pre-save middleware to generate invoice number
orderSchema.pre("save", async function (next) {
  const currentYearMonth = moment().format("YYYY-MM"); // Format like "2024-11"

  try {

    // Ensure that the invoice number is not already set (e.g., during updates)
    if (!this.invoiceNumber) {

      // Get the last order for the current month and year
      const lastOrder = await mongoose
        .model("Order")
        .findOne({
          invoiceNumber: new RegExp(`^${currentYearMonth}`), // Match invoice numbers starting with "2024-11"
        })
        .sort({ invoiceNumber: -1 })
        .limit(1);

      const lastInvoiceNumber = lastOrder
        ? parseInt(lastOrder.invoiceNumber.split("-")[1])
        : 0;

      const newInvoiceNumber = `#${currentYearMonth}-${(lastInvoiceNumber + 1)
        .toString()
        .padStart(3, "0")}`;


      // Set the new invoice number
      this.invoiceNumber = newInvoiceNumber;
    }
  } catch (error) {
    return next(error); // Pass error to the next middleware
  }

  next(); // Proceed to save the order
});

module.exports = mongoose.model("Order", orderSchema);
