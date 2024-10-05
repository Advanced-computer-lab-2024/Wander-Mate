const tourismGovernerModel = require("../Models/tourismGoverner.js");
const attractionModel = require("../Models/attractions.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const Tag = require("../Models/HistoricalTags.js");
const Attraction = require("../Models/attractions.js");
const Itinerary = require("../Models/itinerary.js");

//Read
const getPlaces = async (req, res) => {
  try {
    const objectId = mongoose.Types.ObjectId("66f91e39a144543bfcfbae2c");
    const places = await attractionModel.find({ Type: objectId });
    res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPlace = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await attractionModel.findById(id);
    if (!place) {
      return res.status(404).json({ error: "place not found" });
    }
    res.status(200).json(place);
  } catch {
    res.status(400).json({ error: "Error reading place" });
  }
};

//Create
const createPlace = async (req, res) => {
  try {
    const {
      Username,
      Name,
      Description,
      Location,
      OpeningHours,
      TicketPrices,
    } = req.body;
    const objectId = new mongoose.Types.ObjectId("66f91e39a144543bfcfbae2c");
    // Check if the pictures are uploaded (req.files is used for multiple file uploads)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    // Process all uploaded files
    const pictures = req.files.map((file) => ({
      data: file.buffer, // Get image data (Buffer)
      contentType: file.mimetype, // Get content type of the image
    }));

    const newPlace = await attractionModel.create({
      Creator: Username,
      Name,
      Description,
      Pictures: pictures,
      Location,
      OpeningHours,
      TicketPrices,
      Type: objectId,
    });
    res.status(200).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Update
const updatePlace = async (req, res) => {
  try {
    const {
      Id,
      Name,
      Description,
      Pictures,
      Location,
      OpeningHours,
      TicketPrices,
    } = req.body;
    const place = await attractionModel.findByIdAndUpdate(
      Id,
      {
        Description: Description,
        Name: Name,
        Pictures: Pictures,
        Location: Location,
        OpeningHours: OpeningHours,
        TicketPrices: TicketPrices,
      },
      { new: true, runValidators: true }
    );
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    } else {
      res.status(200).json(place);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete
const deletePlace = async (req, res) => {
  try {
    const { Id } = req.params;
    const place = await attractionModel.findByIdAndDelete(Id);

    if (!place) {
      return res.status(400).json({ message: "Place not found" });
    } else {
      res.status(200).json({ message: "Place deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createTags = async (req, res) => {
  try {
    const { Name } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const newTag = new Tag({ Name });

    // Save the new tag to the database
    await newTag.save();
    return res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating tag" });
  }
};
const viewAll0 = async (req, res) => {
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
  getPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getPlace,
  createTags,
  viewAll0,
};
