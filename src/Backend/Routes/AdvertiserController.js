const advertiserModel = require("../Models/advertiser.js"); 
const { default: mongoose } = require('mongoose');


const getAtrractions = async (req, res) => {
    
    try {
       const attractions = await advertiserModel.find({getAtrractions});
       res.status(200).json(attractions);
    }
    catch(error){
       res.status(400).json({error:error.message})
    }
   };
   module.exports = {getAtrractions};
