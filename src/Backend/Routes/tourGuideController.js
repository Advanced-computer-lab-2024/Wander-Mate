const tourGuideModel = require("../Models/tourGuide.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const Itinerary = require("../Models/itinerary.js");
const userModel = require("../Models/users.js"); // Adjust the path based on your folder structure

// Creating a tourGuide
const createTourGuide = async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;

    // Check if Username, Password, and Email are provided
    if (!Username || !Password || !Email) {
      return res
        .status(400)
        .json({ message: "Username, Password, and Email are all required" });
    }

    // Check if Username or Email already exists
    const existingUser1 = await userModel.findOne({ Username: Username });
    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this username already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create the tourGuide using the hashed password
    const tourGuide = await tourGuideModel.create({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
    });
    await userModel.create({ Username: Username });

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
    if (
      !Activities ||
      !LocationsToVisit ||
      !Language ||
      !Price ||
      !AvailableDates ||
      !PickUpLocation ||
      !DropOffLocation
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new itinerary object
    const newItinerary = new Itinerary({
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
    return res.status(200).json(newItinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error.message); // Log the actual error message
    return res
      .status(500)
      .json({ message: "Error creating itinerary", error: error.message });
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findByIdAndDelete(id);

    if (!itinerary) {
      return res.status(400).json({ message: "Itinerary not found" });
    } else {
      res.status(200).json({ message: "Itinerary deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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

const createProfileInformation = async (req, res) => {
  try {
    const { Username } = req.body;
    const { MobileNumber, YearsOfExperience, PreviousWork } = req.body;

    if (!MobileNumber || !YearsOfExperience) {
      return res.status(400).json({
        message: "Mobile number and years of experience are required",
      });
    }

    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
      { Username: Username },
      { $set: { MobileNumber, YearsOfExperience, PreviousWork } },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({
      message: "Profile information created",
      tourGuide: updatedTourGuide,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile information" });
  }
};
const readProfileInformation = async (req, res) => {
  try {
    const { Username } = req.body; // Using `req.body` to get the Username, similar to `readSeller`

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const tourGuide = await tourGuideModel.findOne({ Username });

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    return res.status(200).json(tourGuide);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Can't read the profile", error: err.message });
  }
};

const updateProfileInformation = async (req, res) => {
  try {
    // Extract the parameters from the request body
    const { Username, MobileNumber, YearsOfExperience, PreviousWork } =
      req.body;

    // Use `findOneAndUpdate` to find and update the tour guide by `Username`
    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
      { Username }, // Find the document by `Username`
      { MobileNumber, YearsOfExperience, PreviousWork }, // Fields to update
      { new: true } // Option to return the updated document
    );

    // If the tour guide is not found, return a 404 response
    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // If successful, return the updated document
    return res
      .status(200)
      .json({
        message: "Profile information updated",
        tourGuide: updatedTourGuide,
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Can't update the profile", error: err.message });
  }
};
module.exports = {
  createTourGuide,
  createItinerary,
  createProfileInformation,
  readProfileInformation,
  updateProfileInformation,
  updateItinerary,
  deleteItinerary,
};
