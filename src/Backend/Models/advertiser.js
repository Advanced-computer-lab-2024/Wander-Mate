const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertiserSchema = new Schema(
  {
    UserName: {
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

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
module.exports = Advertiser;
