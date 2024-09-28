const userModel = require("../Models/tourist.js");
const attractionModel = require("../Models/attractions.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Registration function
const touristRegister = async (req, res) => {
  try {
    const { Email, UserName, Password, MobileNumber, Nationality, DOB, Role } =
      req.body;

    // 1. Validate the request data (check required fields)
    if (!Email || !UserName || !Password || !MobileNumber || !Role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // 2. Check if the user already exists (by Email)
    const existingUser = await userModel.findOne({ Email: Email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const existingUser1 = await userModel.findOne({ UserName: UserName });
    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this username already exists." });
    }

    // 3. Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // 4. Create new user
    const newUser = await userModel.create({
      Email,
      UserName,
      Password: hashedPassword, // Store the hashed password
      MobileNumber,
      Nationality,
      DOB,
      Role,
    });

    // 6. Send success response
    res
      .status(200)
      .json({ message: "User registered successfully", userID: newUser._id });
  } catch (error) {
    // Handle errors (e.g., database issues)
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
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
