const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristSchema = new Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    Nationality: {
      type: ObjectId,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
