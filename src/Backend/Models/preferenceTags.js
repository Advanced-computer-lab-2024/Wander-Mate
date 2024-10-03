const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceTags = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const PreferenceTags = mongoose.model("PreferenceTags", preferenceTags);
module.exports = PreferenceTags;
