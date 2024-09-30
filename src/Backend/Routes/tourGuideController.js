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

  const updateItinerary = async (req, res) => {
    try {
      const { id } = req.params; // Itinerary ID from the request params
      const {
        Activities,
        LocationsToVisit,
        TimeLine,
        Language,
        Price,
        AvailableDates,
        PickUpLocation,
        DropOffLocation,
      } = req.body;
  
      const updateFields = {};
      if (Activities) updateFields.Activities = Activities;
      if (LocationsToVisit) updateFields.LocationsToVisit = LocationsToVisit;
      if (TimeLine) updateFields.TimeLine = TimeLine;
      if (Language) updateFields.Language = Language;
      if (Price) updateFields.Price = Price;
      if (AvailableDates) updateFields.AvailableDates = AvailableDates;
      if (PickUpLocation) updateFields.PickUpLocation = PickUpLocation;
      if (DropOffLocation) updateFields.DropOffLocation = DropOffLocation;
  
      // Perform the update
      const updatedItinerary = await Itinerary.findOneAndReplace(
        id,
        updateFields,
        { new: true }
      );
  
      // Check if the itinerary was found
      if (!updatedItinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
  
      // Respond with the updated itinerary
      return res.status(200).json(updatedItinerary);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating itinerary" });
    }
  };



module.exports = { createTourGuide, createItinerary, updateItinerary };
