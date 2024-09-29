const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
