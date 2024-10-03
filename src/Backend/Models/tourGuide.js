const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Email: {
      type: String, //to check correct format in the front end
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
module.exports = TourGuide;
