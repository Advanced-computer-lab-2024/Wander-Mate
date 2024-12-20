const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    Email: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, strict: false }
);

const User = mongoose.model("User", usersSchema);
module.exports = User;
