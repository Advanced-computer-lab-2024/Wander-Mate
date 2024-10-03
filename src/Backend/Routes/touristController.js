const userModel = require("../Models/tourist.js");
const attractionModel = require("../Models/attractions.js");
const itineraryModel = require("../Models/itinerary.js");
const mongoose = require("mongoose");
const ProductModel = require("../Models/products.js");
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

const handleTourist = async (req, res) => {
  const { touristID } = req.params;

  try {
    if (req.method === "GET") {
      // Handle reading tourist information
      const tourist = await userModel.findById(touristID).select("-Password"); // Exclude password field

      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      return res.status(200).json(tourist);
    } else if (req.method === "PUT") {
      // Handle updating tourist information
      const { Email, Password, MobileNumber, Nationality, DOB, Role } =
        req.body;

      // Find the tourist
      const tourist = await userModel.findById(touristID);

      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Fields that can be updated (excluding UserName and Wallet)
      if (Email) tourist.Email = Email;
      if (Password) tourist.Password = Password; // Consider adding password hashing here
      if (MobileNumber) tourist.MobileNumber = MobileNumber;
      if (Nationality) tourist.Nationality = Nationality;
      if (DOB) tourist.DOB = DOB;
      if (Role) tourist.Role = Role;

      // Save the updated tourist
      const updatedTourist = await tourist.save();

      return res.status(200).json({
        message: "Tourist updated successfully",
        updatedTourist: updatedTourist._id,
      });
    } else {
      return res.status(405).json({ message: "Method not allowed" }); // Handle unsupported methods
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
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
    const [attractions, itineraries] = await Promise.all([
      attractionModel.find(filter),
      itineraryModel.find(filter),
    ]);
    res.status(200).json(searchResult);
  } catch {
    res.status(400).json({ message: "Error searching attractions" });
  }
};

const filterPlaces = async (req, res) => {
  const { Tags } = req.body;
  const filter = { Type: mongoose.Types.ObjectId("66f91e39a144543bfcfbae2c") };
  if (Tags && Array.isArray(Tags) && Tags.length > 0) {
    filter.Tags = { $in: Tags };
  }

  try {
    const places = await attractionModel.find(filter);
    res.status(200).json(places);
  } catch {
    res.status(400).json({ message: "Error filtering places" });
  }
};

const viewTouristProducts = async (req, res) => {
  try {
    // Find all products with the relevant fields
    const products = await ProductModel.find({}); // Populate seller info if needed

    // Check if products exist
    if (!products) {
      return res.status(400).json({ message: "No products available" });
    }

    // Return the list of products
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: "Unable to fetch products" });
  }
};

const TouristsearchProductByName = async (req, res) => {
  try {
    const { name } = req.body; // Expecting the product name in the request body

    // Check if a name is provided
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Search for products that match the name (case-insensitive)
    const products = await ProductModel.find({
      name: { $regex: name, $options: "i" },
    });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(400).json({ message: "No products found with that name" });
    }

    // Return the found products
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: "Error searching for products" });
  }
};


const viewUpcomingActivitiesAndItineraries = async (req, res) => {
  try {
    const currentDate = new Date();
    const objectId = mongoose.Types.ObjectId("66f91e39a144543bfcfbae2c"); //place type
    const activityObjectId = mongoose.Types.ObjectId(
      "66f91e1da144543bfcfbae2a"
    ); //activity type
    const historicalPlacesFilter = {
      Type: objectId,
    };
    const activityFilter = {
      Type: activityObjectId,
      Date: { $gte: currentDate },
    };
    const itineraryDateFilter = {
      AvailableDates: {
        $elemMatch: { $gte: currentDate }, // At least one available date should be in the future
      },
    };
    const [
      upcomingHistoricalAttractions,
      upcomingItineraries,
      upcomingActivities,
    ] = await Promise.all([
      attractionModel.find(historicalPlacesFilter),
      itineraryModel.find(itineraryDateFilter),
      attractionModel.find(activityFilter),
    ]);
    const result = {
      upcomingHistoricalAttractions,
      upcomingItineraries,
      upcomingActivities,
    };
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching activities and itineraries",
        error: error.message,
      });
  }
};

const sortProductsByRatingstourist = async (req, res) => {
  try {
    // Find and sort products by ratings in descending order (-1 for descending)
    const products = await productModel.find({}).sort({ ratings: -1 });

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return sorted products
    res.status(200).json(products);
  } catch (err) {
    console.error("Error sorting products by ratings:", err);
    res.status(500).json({ message: "Failed to sort products by ratings" });
  }
};


module.exports = {
  touristRegister,
  searchAttractions,
  handleTourist,
  filterPlaces,
  viewTouristProducts,
  TouristsearchProductByName,
  viewUpcomingActivitiesAndItineraries,
  sortProductsByRatingstourist
};
