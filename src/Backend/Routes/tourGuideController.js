const tourGuideModel = require("../Models/tourGuide.js"); 
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcrypt");
const Itinerary = require('../Models/itinerary.js');  // Adjust the path based on your folder structure


// Creating a tourGuide
const createTourGuide = async (req, res) => {
    try {
        const { Username, Password, Email } = req.body; 

        // Check if Username, Password, and Email are provided
        if (!Username || !Password || !Email) {
            return res.status(400).json({ message: "Username, Password, and Email are all required" });
        }

        // Check if Username or Email already exists
        const existingUser = await tourGuideModel.findOne({
            $or: [{ UserName: Username }, { Email: Email }]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Create the tourGuide using the hashed password
        const tourGuide = await tourGuideModel.create({ UserName: Username, Password: hashedPassword, Email: Email });

        res.status(200).json(tourGuide);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Can't create the tourGuide" });
    }
};



const createItinerary = async (req, res) => {
    try {
      const {
        Creator,
        Activities,        
        LocationsToVisit,  
        TimeLine,          
        Language,          
        Price,             
        AvailableDates,    
        PickUpLocation,   
        DropOffLocation,  
      } = req.body;
  
      // Validate required fields
      if (!Activities || !LocationsToVisit || !Language || !Price || !AvailableDates || !PickUpLocation || !DropOffLocation) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Create a new itinerary object
      const newItinerary =Itinerary.create({
        Creator,
        Activities,
        LocationsToVisit,
        TimeLine,
        Language,
        Price,
        AvailableDates,
        PickUpLocation,
        DropOffLocation,
      });
  
      // Save to the database
      await newItinerary.save();
      
      // Send a response with the newly created itinerary
      return res.status(201).json(newItinerary);
    } catch (error) {
      console.error("Error creating itinerary:", error.message);  // Log the actual error message
      return res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }
  };


  const createProfileInformation = async (req, res) => {
    try {
        const { Username } = req.body;
        const { MobileNumber, YearsOfExperience, PreviousWork } = req.body;

        if (!MobileNumber || !YearsOfExperience) {
            return res.status(400).json({ message: "Mobile number and years of experience are required" });
        }

        const tourGuide = await tourGuideModel.findOne({ UserName: Username });

        if (!tourGuide) {
            return res.status(404).json({ message: "Tour guide not found" });
        }

        tourGuide.MobileNumber = MobileNumber;
        tourGuide.YearsOfExperience = YearsOfExperience;
        tourGuide.PreviousWork = PreviousWork;

        await tourGuide.save();
        res.status(200).json({ message: "Profile information created", tourGuide });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating profile information" });
    }
};
module.exports = { createTourGuide, createItinerary , createProfileInformation};
