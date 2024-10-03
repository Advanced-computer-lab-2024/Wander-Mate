const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalTagSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const HistoricalTag = mongoose.model("HistoricalTag", historicalTagSchema);
module.exports = HistoricalTag;
