const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  aboutID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "aboutModel",
  },
  aboutModel: {
    type: String,
    required: true,
    enum: ["Product", "Itinerary", "Attraction","Transportation"],
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const notificationModel = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  userModel: {
    type: String,
    required: true,
    enum: ["Tourist", "Admin", "Seller", "TourGuide", "Advertiser"],
  },
  notifications: [notificationSchema],
});

module.exports = mongoose.model("Notification", notificationModel);
