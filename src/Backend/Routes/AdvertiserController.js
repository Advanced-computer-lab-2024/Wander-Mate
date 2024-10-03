const advertiserModel = require("../Models/advertiser.js");
const attractionModel = require("../Models/attractions.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const createActivity = async (req, res) => {
  const Bookings = [];
  const {
    Creator,
    Date,
    Time,
    Location,
    Price,
    Category,
    Tags,
    Discounts,
    IsAvailable,
  } = req.body;
  if (!Date) {
    return res.status(400).json({ error: "Date is required" });
  }
  const dateObject = new Date(dateString);
  //let EnterDate = new Date(DateString);
  if (!Time) {
    return res.status(400).json({ error: "Time is required" });
  }
  if (!Location) {
    return res.status(400).json({ error: "Location is required" });
  }
  if (!Price) {
    return res.status(400).json({ error: "Price is required" });
  }
  if (!Category) {
    return res.status(400).json({ error: "Category is required" });
  }
  if (!IsAvailable) {
    return res.status(400).json({ error: "Availability is required" });
  }
  const objectId = new mongoose.Types.ObjectId("66f91e1da144543bfcfbae2a");
  try {
    const activity = attractionModel.create({
      Creator: Creator,
      Date: dateObject,
      Time: Time,
      Location: Location,
      Price: Price,
      Category: Category,
      Tags: Tags,
      Discounts: Discounts,
      IsAvailable: IsAvailable,
      Type: objectId,
      Bookings: Bookings,
    });
    res.status(200).json((await activity).id);
  } catch {
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
    const objectId = mongoose.Types.ObjectId("66f91e1da144543bfcfbae2a");
    const activities = await attractionModel.find({ Type: objectId });
    res.status(200).json(activities);
  } catch {
    res.status(400).json({ error: "Error reading activities" });
  }
};

const updateActivity = async (req, res) => {
  const {
    Creator,
    id,
    Date,
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
    // Convert Creator to ObjectId
    const creatorObjectId = ObjectId.isValid(Creator)
      ? new ObjectId(Creator)
      : null;

    // Compare using strict equality
    if (!creatorObjectId.equals(activity.Creator)) {
      return res
        .status(400)
        .json({ message: "You are not the creator of this activity" });
    }
    activity = await attractionModel.findByIdAndUpdate(
      id,
      {
        Date: Date,
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
  const {id, Creator} = req.body;
  try {
    const activity = await attractionModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    // Convert Creator to ObjectId
    const creatorObjectId = ObjectId.isValid(Creator)
      ? new ObjectId(Creator)
      : null;

    // Compare using strict equality
    if (!creatorObjectId.equals(activity.Creator)) {
      return res
        .status(400)
        .json({ message: "You are not the creator of this activity" });
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

    // Check if Username or Email already exists
    const existingAdvertiser = await advertiserModel.findOne({
      $or: [{ UserName: Username }, { Email: Email }],
    });

    if (existingAdvertiser) {
      return res.status(400).json({ message: "Advertiser already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create the advertiser using the hashed password
    const advertiser = await advertiserModel.create({
      UserName: Username,
      Password: hashedPassword,
      Email: Email,
    });

    res.status(200).json(advertiser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the advertiser" });
  }
};

const createAdvertiserComp = async (req, res) => {
  try {
    // Extract data from the request body
    const { UserName, Password, Email, Website, CompanyProfile, Hotline } = req.body;

    // Validate required fields for advertiser
    if (!UserName || !Password) {
      return res.status(400).json({ message: "UserName and Password are required" });
    }

    // Store the advertiser information in the database
    const newAdvertiser = new Advertiser({
      UserName,
      Password,
    });

    await newAdvertiser.save();

    // If additional company info is provided, you can handle it separately
    const companyInfo = {
      Email,
      Website,
      CompanyProfile,
      Hotline,
    };

    // Send success response including both advertiser and company info
    res.status(201).json({
      message: "Advertiser created successfully",
      advertiser: newAdvertiser,
      companyInfo: companyInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};


module.exports = {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  readActivities,
  createAdvertiserComp,
};
