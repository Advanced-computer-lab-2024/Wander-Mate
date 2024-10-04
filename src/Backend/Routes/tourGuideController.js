const tourGuideModel = require("../Models/tourGuide.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const Itinerary = require("../Models/itinerary.js");
const userModel = require("../Models/users.js"); // Adjust the path based on your folder structure
const { searchAttractions } = require("./touristController.js");
const Attraction = require("../Models/attractions.js");

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

    const Ratings = 0.0;
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
      Ratings,
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
    const {
      Creator,
      id,
      Activities,
      LocationsToVisit,
      TimeLine,
      Language,
      Price,
      AvailableDates,
      PickUpLocation,
      DropOffLocation,
    } = req.body;
    try {
      let itinerary = await Itinerary.findById(id);
      if (!itinerary) {
        return res.status(400).json({ message: "Itinerary not found." });
      }
      if (itinerary.Creator !== Creator) {
        return res.status(400).json({ message: "You are not the creator." });
      }
      itinerary = await Itinerary.findByIdAndUpdate(
        id,
        {
          Activities,
          LocationsToVisit,
          TimeLine,
          Language,
          Price,
          AvailableDates,
          PickUpLocation,
          DropOffLocation,
        },
        { new: true, runValidators: true }
      );
      return res
        .status(200)
        .json({ message: "Itinerary updated successfully.", itinerary });
    } catch {}

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

const readItinerary = async (req, res) => {
  const { id } = req.body;
  try {
    const itinerary = await Itinerary.findById({ id });
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary not found" });
    }
    res.status(200).json(itinerary);
  } catch {
    res.status(400).json({ error: "Error reading itinerary" });
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
    const { Username, MobileNumber, YearsOfExperience, PreviousWork } =
      req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
      { Username },
      { MobileNumber, YearsOfExperience, PreviousWork },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({
      message: "Profile information updated",
      tourGuide: updatedTourGuide,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile information" });
  }
};
const viewAll1 = async (req, res) => {
  try {
    // Fetch all preference tags from the database
    const attractions = await Attraction.find();
    const itineraries = await Itinerary.find();

    // Check if there are any tags
    if (attractions.length === 0) {
      return res.status(404).json({ message: "No attractions found." });
    }
    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No itinaries found." });
    }

    // Respond with the retrieved tags
    res.status(200).json(attractions);
    res.status(200).json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all upcoming." });
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
  viewAll1,
};
