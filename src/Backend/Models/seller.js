const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
