const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "ownerModel", 
      },
      userModel: {
        type: String,
        required: true, // This will contain the model name
        enum: ["TourGuide", "Advertiser", "Seller", "Admin"], 
      },
      revenue:{ 
        type: Number,
        required: true,
        default : 0
      }

});

module.exports = mongoose.model("Sales", salesSchema);