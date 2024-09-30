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
      const newItinerary = new Itinerary({
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
        const { Username } = req.params; // Assume Username is passed as a URL parameter
        const { MobileNumber, YearsOfExperience, PreviousWork } = req.body; // Extract profile info

        // Validate that the required fields for the profile information are present
        if (!MobileNumber || !YearsOfExperience) {
            return res.status(400).json({ message: "Mobile number and years of experience are required" });
        }

        // Validate that PreviousWork, if provided, is an array
        if (PreviousWork && !Array.isArray(PreviousWork)) {
            return res.status(400).json({ message: "Previous work should be an array" });
        }

        // Find the tour guide by username
        const tourGuide = await tourGuideModel.findOne({ UserName: Username });
        if (!tourGuide) {
            return res.status(404).json({ message: "Tour guide not found" });
        }

        // Update the tour guide profile with the additional information
        tourGuide.MobileNumber = MobileNumber;
        tourGuide.YearsOfExperience = YearsOfExperience;
        
        // Only update PreviousWork if it's provided
        if (PreviousWork) {
            tourGuide.PreviousWork = PreviousWork;
        }

        // Save the changes to the database
        await tourGuide.save();

        res.status(200).json({ message: "Profile information updated successfully", tourGuide });
    } catch (err) {
        console.error("Error updating profile information:", err);
        res.status(500).json({ message: "Error updating profile information", error: err.message });
    }
};


const updateProfileInformation = async (req, res) => {
  try {
      const { Username } = req.params; // Assume Username is passed as a URL parameter
      const updates = req.body; // Extract updated profile info

      // Find the tour guide by username and update their profile information
      const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
          { UserName: Username }, // Find by Username
          updates, // Fields to update
          { new: true } // Return the updated document
      );

      if (!updatedTourGuide) {
          return res.status(404).json({ message: "Tour guide not found" });
      }

      res.status(200).json({ message: "Profile information updated", updatedTourGuide });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile information" });
  }
};
const readProfileInformation = async (req, res) => {
  try {
      const { Username } = req.params; // Assume Username is passed as a URL parameter

      // Find the tour guide by username
      const tourGuide = await tourGuideModel.findOne({ UserName: Username });
      if (!tourGuide) {
          return res.status(404).json({ message: "Tour guide not found" });
      }

      // Return the full profile information
      res.status(200).json({ message: "Profile information retrieved", tourGuide });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving profile information" });
  }
};



module.exports = { createTourGuide, createItinerary , createProfileInformation, updateProfileInformation,readProfileInformation};
