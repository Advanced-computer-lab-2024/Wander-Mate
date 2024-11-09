const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookedFlightsSchema = new Schema(
    {
        userId:{
            type: String,
            required:true,
            refPath:"Tourist"
        },
        flightID:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        departureDate:{
            type:Date,
            required:true
        },
        arrivalDate:{
            type:Date,
            required:true
        },
        bookedDate:{
            type:Date,
            default:Date.now
        }
    },
    { timestamps: true, strict: false }
);
const BookedFlights = mongoose.model("BookedFlights", bookedFlightsSchema);
module.exports=BookedFlights;