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
    const objectId = new mongoose.Types.ObjectId("67025cc3bb14549b7e29f378");
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

const getPlaceImage = async (req, res) => {
  try {
    const { placeId } = req.params; // Get the place ID from the request parameters

    // Find the place by ID
    const place = await attractionModel.findById(placeId);

    // Check if place exists and has pictures
    if (!place || !place.Pictures || place.Pictures.length === 0) {
      return res.status(400).json({ error: "Place or images not found." });
    }

    // Send all images in an array
    const images = place.Pictures.map((picture) => ({
      contentType: picture.contentType,
      data: picture.data.toString("base64"), // Convert Buffer to base64 string
    }));

    res.status(200).json(images); // Send the images as JSON
  } catch (err) {
    console.error("Error retrieving images:", err);
    res.status(400).json({ error: "Failed to retrieve images." });
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
      Category,
    } = req.body;
    const objectId = new mongoose.Types.ObjectId("67025cc3bb14549b7e29f378");
    // Check if the pictures are uploaded (req.files is used for multiple file uploads)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    // Process all uploaded files
    const pictures = req.files.map((file) => ({
      data: file.buffer, // Get image data (Buffer)
      contentType: file.mimetype, // Get content type of the image
    }));

    const location = JSON.parse(req.body.Location); // Parse the JSON string

    const newPlace = await attractionModel.create({
      Creator: Username,
      Name,
      Description,
      Pictures: pictures,
      Location: location,
      OpeningHours,
      TicketPrices,
      Type: objectId,
      Category,
    });
    res.status(200).json(newPlace);
  } catch (error) {
    console.log(error.message);
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
    const location = JSON.parse(Location); // Parse the JSON string

    const place = await attractionModel.findByIdAndUpdate(
      Id,
      {
        Description: Description,
        Name: Name,
        Pictures: Pictures,
        Location: location,
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

const createHistoricalTags = async (req, res) => {
  try {
    const { Name } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const newTag = new Tag({ Name });

    // Save the new tag to the database
    await newTag.save();
    return res.status(200).json(newTag);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error creating tag" });
  }
};

const readHistoricalTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json(tags);
  } catch {
    return res.status(400).json({ message: "Error reading tags" });
  }
};

const updateHistoricalTags = async (req, res) => {
  try {
    const { Id } = req.params;
    const { Name } = req.body;
    const tag = await Tag.findByIdAndUpdate(Id, { Name }, { new: true });
    if (!tag) {
      return res.status(400).json({ message: "Tag not found" });
    }
    return res.status(200).json(tag);
  } catch {
    return res.status(400).json({ message: "Error updating tag" });
  }
};

const viewAll0 = async (req, res) => {
  try {
    // Fetch all attractions and itineraries from the database
    const attractions = await Attraction.find();
    const itineraries = await Itinerary.find();

    // Check if there are any attractions or itineraries
    if (attractions.length === 0 && itineraries.length === 0) {
      return res
        .status(404)
        .json({ message: "No attractions or itineraries found." });
    }

    // Respond with the retrieved data
    res.status(200).json({ attractions, itineraries });
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
  createHistoricalTags,
  readHistoricalTags,
  updateHistoricalTags,
  viewAll0,
  getPlaceImage,
};
