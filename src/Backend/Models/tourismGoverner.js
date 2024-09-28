const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourismGovernerSchema = new Schema(
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

const TourismGoverner = mongoose.model(
  "TourismGoverner",
  tourismGovernerSchema
);
module.exports = TourismGoverner;
