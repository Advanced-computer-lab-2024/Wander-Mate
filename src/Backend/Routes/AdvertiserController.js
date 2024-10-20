const advertiserModel = require("../Models/advertiser.js");
const attractionModel = require("../Models/attractions.js");
const userModel = require("../Models/users.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const Itinerary = require("../Models/itinerary.js");
const Attraction = require("../Models/attractions.js");
const TransportationModel = require("../Models/transportation.js");

const createActivity = async (req, res) => {
  const Bookings = [];
  const {
    Creator,
    Name,
    DateString,
    Time,
    Location,
    Price,
    Category,
    Tags,
    Discounts,
    IsAvailable,
  } = req.body;

  const Ratings = 0.0;

  if (!DateString) {
    return res.status(400).json({ error: "Date is required" });
  }

  const dateObject = new Date(DateString);
  if (!Name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!Time) {
    return res.status(400).json({ error: "Time is required" });
  }
  if (!Location || !Location.coordinates || Location.coordinates.length !== 2) {
    return res.status(400).json({ error: "Valid Location is required" });
  }
  if (!Price) {
    return res.status(400).json({ error: "Price is required" });
  }
  if (!Category) {
    return res.status(400).json({ error: "Category is required" });
  }
  const model = "Advertiser";

  try {
    const activity = await attractionModel.create({
      Creator,
      CreatorModel: model,
      Name,
      Date: dateObject,
      Time,
      Location,
      Price,
      Category,
      Tags,
      Discounts,
      IsAvailable,
      Type: new mongoose.Types.ObjectId("67025cb6bb14549b7e29f376"),
      Bookings,
      Ratings,
    });
    res.status(200).json(activity._id);
  } catch (error) {
    console.error("Error creating activity:", error); // Log the error
    res.status(400).json({ error: "Error creating activity" });
  }
};

const readActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await attractionModel.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch {
    res.status(400).json({ error: "Error reading activity" });
  }
};

const readActivities = async (req, res) => {
  try {
    const activities = await attractionModel.find(); // Fetch all activities
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: "Error reading activities" });
  }
};

const updateActivity = async (req, res) => {
  const {
    Creator,
    Name,
    id,
    DateString,
    Time,
    Location,
    Price,
    Category,
    Tags,
    Discounts,
    IsAvailable,
  } = req.body;
  try {
    let activity = await attractionModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    let dateObject;
    if (DateString) {
      dateObject = new Date(DateString);
    } else {
      dateObject = activity.Date;
    }

    if (activity.Creator !== Creator) {
      return res.status(400).json({ message: "You are not the creator." });
    }
    activity = await attractionModel.findByIdAndUpdate(
      id,
      {
        Date: dateObject,
        Name: Name,
        Time: Time,
        Location: Location,
        Price: Price,
        Category: Category,
        Tags: Tags,
        Discounts: Discounts,
        IsAvailable: IsAvailable,
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json({ message: "Activity updated successfully.", activity });
  } catch {
    res.status(400).json({ error: "Error updating activity" });
  }
};

const deleteActivity = async (req, res) => {
  const { id, Creator } = req.body;
  try {
    const activity = await attractionModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    if (activity.Creator !== Creator) {
      return res.status(400).json({ message: "You are not the creator." });
    }
    // Check if bookings list is empty
    if (activity.bookings && activity.bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete activity with existing bookings." });
    }
    await attractionModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Activity deleted successfully.", activity });
  } catch {
    res.status(400).json({ error: "Error deleting activity" });
  }
};

const createAdvertiser = async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;

    // Check if Username, Password, and Email are provided
    if (!Username || !Password || !Email) {
      return res
        .status(400)
        .json({ message: "Username, Password, and Email are all required" });
    }
    const existingUser1 = await userModel.findOne({ Username: Username });
    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this Username already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create the advertiser using the hashed password
    const advertiser = await advertiserModel.create({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
    });

    const userID = advertiser._id;
    //add to usermodel
    await userModel.create({ Username: Username, userID });

    res.status(200).json(advertiser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the advertiser" });
  }
};

const createAdvertiserInfo = async (req, res) => {
  try {
    const { Username, Email, Website, Hotline, CompanyProfile } = req.body;

    const advertiser = await advertiserModel.findOneAndUpdate(
      { Username: Username },
      { Email, Website, Hotline, CompanyProfile },
      { new: true }
    );

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser guide not found" });
    }

    // advertiser.Email = Email;
    // advertiser.Website = Website;
    // advertiser.Hotline = Hotline;
    // advertiser.CompanyProfile = CompanyProfile;

    await advertiser.save();
    res
      .status(200)
      .json({ message: "Profile information created", advertiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile information" });
  }
};

const readAdvertiserInfo = async (req, res) => {
  const { Username } = req.body;
  try {
    const Advertiser = await advertiserModel.find({ Username: Username });
    if (!Advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(Advertiser);
  } catch {
    res.status(400).json({ error: "Error reading Advertiser" });
  }
};

const updateAdvertiserInfo = async (req, res) => {
  try {
    const { Username, Website, Hotline, CompanyProfile } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedAdvertiser = await advertiserModel.findOneAndUpdate(
      { Username },
      { Website, Hotline, CompanyProfile },
      { new: true }
    );

    if (!updatedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    res.status(200).json({
      message: "Profile information updated",
      advertiser: updatedAdvertiser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile information" });
  }
};
const viewAll2 = async (req, res) => {
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
const getAdvertisers = async (req, res) => {
  try {
    const Creator = await advertiserModel.find().select("-Password");
    res.status(200).json({ Creator });
  } catch {
    res.status(400).json({ message: "Error to get advertisers" });
  }
};

const uploadAdvertiserDocuments = async (req, res) => {
  if (!req.files) {
    return res.status(400).send("Files are required.");
  }

  try {
    const ownerId = req.body.ownerId;
    const ownerModel = "Advertiser";
    const idPdf = new PdfDetails({
      Title: "ID",
      pdf: req.files.ID[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    const certPdf = new PdfDetails({
      Title: "Taxation Registery",
      pdf: req.files.docs[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    await idPdf.save();
    await certPdf.save();

    return res.status(200).json({
      message: "Docs are uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error to upload documents" });
  }
};

const changePasswordAdvertiser = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Find the tour guide by id
    const advertiser = await advertiserModel.findById(id);
    if (!advertiser) {
      return res.status(404).json({ message: "advertiser not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, advertiser.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    advertiser.Password = hashedNewPassword;
    await advertiser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addTransportation = async (req, res) => {
  try {
    // Destructure transportation fields from the request body
    const { advertiserId, availability } = req.body;

    // Basic validation
    if (!advertiserId) {
      return res.status(400).json({ error: "Advertiser ID is required." });
    }

    // Check if the advertiser exists
    const advertiser = await advertiserModel.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    // Create a new transportation instance
    const transportation = await TransportationModel.create({
      advertiserId, // Link transportation to the advertiser
      availability: availability !== undefined ? availability : true, // Default to true if not provided
    });

    // Respond with success and the transportation data
    res.status(200).json({
      message: "Transportation added successfully!",
      transportation,
    });
  } catch (err) {
    console.error("Error adding transportation:", err);
    res.status(400).json({ error: "Failed to add transportation." });
  }
};

module.exports = {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  readActivities,
  createAdvertiserInfo,
  readAdvertiserInfo,
  viewAll2,
  updateAdvertiserInfo,
  getAdvertisers,
  getAdvertisers,
  uploadAdvertiserDocuments,
  changePasswordAdvertiser,
  addTransportation,
};
