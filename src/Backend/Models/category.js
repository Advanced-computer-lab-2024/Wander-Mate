const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
