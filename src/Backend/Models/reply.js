const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  Body: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the current date
  },
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
