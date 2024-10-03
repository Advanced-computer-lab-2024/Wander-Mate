const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const User = mongoose.model("User", usersSchema);
module.exports = User;