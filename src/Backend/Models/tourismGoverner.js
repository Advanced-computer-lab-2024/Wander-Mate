const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourismGovernerSchema = new Schema(
  {
    Email: {
        type:String,
        required: true
    },
    UserName: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    mobileNumber:{
        type:String,
        required:true
    },
    Nationality:{
        type:Object,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    Role:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

const TourismGoverner = mongoose.model("TourismGoverner", tourismGovernerSchema);
module.exports =TourismGoverner;
