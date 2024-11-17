const { unlink } = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: "Tourist",
        default: null,
    },
    Discount: {
        type: Number,
        required: true,
        default: 10,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
module.exports = PromoCode;