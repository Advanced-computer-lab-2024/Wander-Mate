const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", required: true }, // Reference to Tourist
});

module.exports = mongoose.model("Address", addressSchema);