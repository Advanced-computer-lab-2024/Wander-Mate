const advertiserModel = require("../Models/advertiser.js");
const attractionModel = require("../Models/attractions.js");
const { default: mongoose } = require("mongoose");

const createActivity = async (req, res) => {
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
  try {
    const activity = attractionModel.create({
      Creator: Creator,
      Date: Date,
      Time: Time,
      Location: Location,
      Price: Price,
      Category: Category,
      Tags: Tags,
      Discounts: Discounts,
      IsAvailable: IsAvailable,
    });
    res.status(200).json(activity);
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

const updateActivity = async (req, res) => {
  const {
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
    const activity = await attractionModel.findByIdAndUpdate(
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
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    return res
      .status(200)
      .json({ message: "Activity updated successfully.", activity });
  } catch {
    res.status(400).json({ error: "Error updating activity" });
  }
};

const deleteActivity = async (req, res) => {
  const id = req.body;
  try {
    const activity = await attractionModel.findByIdAndDelete(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    return res
      .status(200)
      .json({ message: "Activity deleted successfully.", activity });
  } catch {
    res.status(400).json({ error: "Error deleting activity" });
  }
};

module.exports = {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
};
