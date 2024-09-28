const userModel = require("../Models/tourist.js");
const attractionModel = require("../Models/attractions.js");
const mongoose = require("mongoose");

// Registration function
const touristRegister = async (req, res) => {
  try {
    const { Email, UserName, Password, MobileNumber, Nationality, DOB, Role } = req.body;

    // Validate required fields
    if (!Email || !UserName || !Password || !MobileNumber || !Role) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Check if user already exists by email
    const existingUser = await userModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Create a new user (without hashing the password)
    const newUser = await userModel.create({
      Email,
      UserName,
      Password, // Password is saved as plain text here
      MobileNumber,
      Nationality,
      DOB,
      Role,
    });

    // Respond with success
    res.status(200).json({ message: "User registered successfully", userID: newUser._id });
    
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


const searchAttractions = async (req, res) => {
  const { Name, Category, Tags } = req.body;
  const filter = {};
  if (Name) {
    filter.Name = { $regex: Name, $options: "i" };
  }
  if (Category) {
    filter.Category = Category;
  }
  if (Tags && Array.isArray(Tags) && Tags.length > 0) {
    filter.Tags = { $in: Tags };
  }

  try {
    const searchResult = await attractionModel.find(filter);
    res.status(200).json(searchResult);
  } catch {
    res.status(400).json({ message: "Error searching attractions" });
  }
};

module.exports = { touristRegister, searchAttractions };
