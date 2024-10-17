const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    touristID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist', 
        required: true
    },
    guideID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TourGuide', 
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now 
    }
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;