const userModel = require("../Models/tourist.js");
const attractionModel = require("../Models/attractions.js");
const itineraryModel = require("../Models/itinerary.js");
const mongoose = require("mongoose");
const ProductModel = require("../Models/products.js");
const bcrypt = require("bcrypt");
const Usernames = require("../Models/users.js");
const CommentModel = require("../Models/comments.js");
const TourGuide = require("../Models/tourGuide.js");
const axios = require("axios");
const RatingModel = require("../Models/rating.js");
const Complaints = require("../Models/complaints.js"); // Correctly import the model
const bookingSchema = require("../Models/bookings.js");

// Registration function
const touristRegister = async (req, res) => {
  try {
    const {
      Email,
      FullName,
      Username,
      Password,
      MobileNumber,
      Nationality,
      DOB,
      Role,
      Points,
    } = req.body;

    const Wallet = 0.0;

    // 1. Validate the request data (check required fields)
    if (
      !Email ||
      !FullName ||
      !Username ||
      !Password ||
      !MobileNumber ||
      !Role
    ) {
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

    const existingUser1 = await Usernames.findOne({ Username: Username });

    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this Username already exists." });
    }

    // 3. Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // 4. Ensure Points is an integer and validate the input
    let parsedPoints = parseInt(Points); // Convert Points to an integer
    if (isNaN(parsedPoints) || parsedPoints < 0) {
      // Check if the input is not a number or if it's negative
      parsedPoints = 0; // Default to 0 points if invalid input
    }

    // Badge assignment logic based on points
    const assignBadge = (points) => {
      if (points <= 100000) {
        return "level 1"; // Up to 100K points
      } else if (points <= 500000) {
        return "level 2"; // Up to 500K points
      } else {
        return "level 3"; // More than 500K points
      }
    };

    // Call the assignBadge function to get the badge based on Points
    let badge = assignBadge(parsedPoints);

    // 5. Create new user
    const newUser = await userModel.create({
      Email,
      FullName,
      Username,
      Password: hashedPassword, // Store the hashed password
      MobileNumber,
      Nationality,
      DOB,
      Role,
      Wallet,
      Points: parsedPoints,
      Badge: badge,
    });
    const userID = newUser._id;
    await Usernames.create({ Username: Username, userID });
    // 7. Send success response
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
      const {
        Username,
        DOB,
        FullName,
        Email,
        Password,
        MobileNumber,
        Nationality,
        Role,
        Points,
      } = req.body;

      // Check if user is trying to update Username or DOB
      if (
        req.body.hasOwnProperty("Username") ||
        req.body.hasOwnProperty("DOB")
      ) {
        return res.status(400).json({
          message: "Username and DOB cannot be changed",
        });
      }

      // Find the tourist
      const tourist = await userModel.findById(touristID);

      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }

      // Fields that can be updated (excluding Username and DOB)
      if (Email) tourist.Email = Email;
      if (Password) {
        // Consider adding password hashing here
        tourist.Password = Password;
      }
      if (MobileNumber) tourist.MobileNumber = MobileNumber;
      if (Nationality) tourist.Nationality = Nationality;
      if (Role) tourist.Role = Role;
      if (FullName) tourist.FullName = FullName;
      if (Points) {
        tourist.Points = Points;
        console.log(tourist.Points);
        // Update Badge according to the Points
        const assignBadge = (points) => {
          if (points <= 100000) {
            return "level 1"; // Up to 100K points
          } else if (points <= 500000) {
            return "level 2"; // Up to 500K points
          } else {
            return "level 3"; // More than 500K points
          }
        };
        tourist.Badge = assignBadge(tourist.Points);
        console.log(tourist.Badge);
      }

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
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
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
    const searchResult = { ...attractions, ...itineraries };
    res.status(200).json(searchResult);
  } catch {
    res.status(400).json({ message: "Error searching attractions" });
  }
};

const searchActivities = async (req, res) => {
  const { Name, Category, Tags } = req.body;
  const objectId = new mongoose.Types.ObjectId("67025cb6bb14549b7e29f376");
  const filter = { Type: objectId };
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
    ]);
    const searchResult = { ...attractions, ...itineraries };
    res.status(200).json(searchResult);
  } catch {
    res.status(400).json({ message: "Error searching attractions" });
  }
};

const filterPlaces = async (req, res) => {
  const { Tags } = req.body;
  const filter = { Type: mongoose.Types.ObjectId("67025cc3bb14549b7e29f378") };
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

//3adelt fiha f sprint 2 3alashan a7ot lw heya archived wla l2
const viewTouristProducts = async (req, res) => {
  try {
    // Find all products that are not archived
    const products = await ProductModel.find({ isArchived: false }); // Populate seller info if needed

    // Check if products exist
    if (!products || products.length === 0) { // Check if the products array is empty
      return res.status(404).json({ message: "No products available" });
    }

    // Return the list of products
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Unable to fetch products" });
  }
};
/////////////////////////////////////////////////

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
      return res
        .status(400)
        .json({ message: "No products found with that name" });
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
    const objectId = new mongoose.Types.ObjectId("67025cc3bb14549b7e29f378"); //place type
    const activityObjectId = new mongoose.Types.ObjectId(
      "67025cb6bb14549b7e29f376"
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
    res.status(500).json({
      message: "Error fetching activities and itineraries",
      error: error.message,
    });
  }
};

const viewActivities = async (req, res) => {
  const activityObjectId = new mongoose.Types.ObjectId(
    "67025cb6bb14549b7e29f376"
  ); //activity type
  const currentDate = new Date();
  const activityFilter = {
    Type: activityObjectId,
    Date: { $gte: currentDate },
  };
  try {
    const activities = await attractionModel.find(activityFilter);
    res.status(200).json(activities);
  } catch {
    res.status(400).json("Error");
  }
};

const viewItineraries = async (req, res) => {
  const currentDate = new Date();
  const itineraryDateFilter = {
    AvailableDates: {
      $elemMatch: { $gte: currentDate }, // At least one available date should be in the future
    },
  };

  try {
    const itineraries = await itineraryModel
      .find(itineraryDateFilter)
      .populate("Activities")
      .populate("LocationsToVisit");
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error); // Log the error to the console for debugging
    res.status(400).json({ message: "Error", error: error.message });
  }
};

const viewPlaces = async (req, res) => {
  const objectId = new mongoose.Types.ObjectId("67025cc3bb14549b7e29f378"); //place type
  const historicalPlacesFilter = {
    Type: objectId,
  };
  try {
    const places = await attractionModel.find(historicalPlacesFilter);
    res.status(200).json(places);
  } catch {
    res.status(400).json("Error");
  }
};

const sortProductsByRatingstourist = async (req, res) => {
  try {
    // Find and sort products by ratings in descending order (-1 for descending)
    const products = await ProductModel.find({}).sort({ ratings: -1 });

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
const filterItineraries = async (req, res) => {
  const { minPrice, maxPrice, AvailableDates, Tags, Language } = req.body;

  // Initialize the filter object
  const filter = {};

  // Filter by price if provided
  if (minPrice || maxPrice) {
    filter.Price = { $lte: maxPrice, $gte: minPrice }; // Assuming it's a maximum budget filter
  }

  // Filter by available dates if provided
  if (AvailableDates && AvailableDates.length > 0) {
    filter.AvailableDates = {
      $gte: new Date(AvailableDates[0]), // Start date
      $lte: new Date(AvailableDates[1]), // End date
    };
  }

  // Filter by locations to visit if provided
  if (Tags && Array.isArray(Tags) && Tags.length > 0) {
    filter.Tags = { $in: Tags };
  }

  // Filter by language if provided
  if (Language) {
    filter.Language = Language;
  }

  try {
    const itineraries = await itineraryModel.find(filter);
    if (itineraries && itineraries.length > 0) {
      res.status(200).json(itineraries);
    } else {
      res.status(404).json({ message: "No itineraries found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error filtering itineraries", error: error.message });
  }
};

const sortActivitiesByRatings = async (req, res) => {
  try {
    // Find and sort activities by ratings in descending order (-1 for descending)
    const activities = await attractionModel.find({}).sort({ Ratings: -1 });

    // Check if activities exist
    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    // Return sorted activities
    res.status(200).json(activities);
  } catch (err) {
    console.error("Error sorting activities by ratings:", err);
    res.status(500).json({ message: "Failed to sort activities by ratings" });
  }
};

const filterActivities = async (req, res) => {
  const { minPrice, maxPrice, minDate, maxDate, category, ratings } = req.body;

  // Initialize filter object for upcoming activities
  const filter = {
    Type: new mongoose.Types.ObjectId("67025cb6bb14549b7e29f376"),
  };

  // Add budget filter if it's provided
  if (minPrice || maxPrice) {
    filter.Price = {};
    if (minPrice) filter.Price.$gte = String(minPrice); // Convert to string
    if (maxPrice) filter.Price.$lte = String(maxPrice); // Convert to string
  }
  // Add date filter if it's provided
  if (minDate || maxDate) {
    filter.Date = { $gte: new Date(minDate), $lte: new Date(maxDate) }; // Assuming you want to filter activities starting from the given date
  }
  // Add category filter if it's provided
  if (category) {
    filter.Category = category; // Assuming category is a direct match
  }
  // Add ratings filter if it's provided
  if (ratings) {
    filter.Ratings = { $gte: ratings }; // Assuming you want to filter activities with ratings greater than or equal to the specified value
  }
  try {
    const activities = await attractionModel.find(filter);
    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error filtering activities" });
  }
};

const readPlaces = async (req, res) => {
  try {
    const filter = {
      Type: new mongoose.Types.ObjectId("67025cc3bb14549b7e29f378"),
    };
    const places = await attractionModel.find(filter);
    res.status(200).json(places);
  } catch {
    res.status(400).json({ message: "Error reading places" });
  }
};

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getAge = async (req, res) => {
  const { Username } = req.body;
  try {
    const { DOB } = await userModel.findOne({ Username });
    const age = calculateAge(DOB);

    if (age < 18) {
      return res.status(200).json({ eligible: false });
    } else {
      return res.status(200).json({ eligible: true });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error getting age" });
  }
};

///////////////////Sprint 2 Nadeem///////////////////////////////////////////////////

// Get OAuth token from Amadeus
const getAmadeusToken = async () => {
  const apiKey = "DoIUa8fmCDsZiacWJB3up5U5rg0iIrT3"; // Replace with your Amadeus API key
  const apiSecret = "QkndHmfmxPgUlPDU"; // Replace with your Amadeus API secret

  try {
    const tokenResponse = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      "grant_type=client_credentials&client_id=" +
        apiKey +
        "&client_secret=" +
        apiSecret,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return tokenResponse.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch access token");
  }
};

// Search for flights
const SearchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate, travelers } =
    req.body;

  // Validate input
  if (!origin || !destination || !departureDate || !travelers) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    // Get the OAuth access token
    const accessToken = await getAmadeusToken();

    // Call the flight search API with the access token
    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          returnDate,
          adults: travelers,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Log the response for debugging
    console.log("Flight search response:", response.data);

    // Return the available flights
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching flights:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Failed to search flights", error: error.message });
  }
};

// Book Flight Function
const BookFlight = async (req, res) => {
  const { selectedFlightOffer, travelersInfo, paymentInfo } = req.body;

  // Validate input
  if (!selectedFlightOffer || !travelersInfo || !paymentInfo) {
    return res.status(400).json({
      message:
        "Please provide the selected flight offer, travelers info, and payment info.",
    });
  }

  try {
    // Get the OAuth access token
    const accessToken = await getAmadeusToken();

    // Book the flight by calling the flight-orders API
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/booking/flight-orders",
      {
        data: {
          type: "flight-order",
          flightOffers: [selectedFlightOffer], // Selected flight offer from the search result
          travelers: travelersInfo, // Traveler info array
          payment: paymentInfo, // Payment information object
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the booking confirmation
    const bookingConfirmation = response.data;
    res.status(200).json(bookingConfirmation);
    res.send("Flight Booked");
  } catch (error) {
    console.error(
      "Error booking flight:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Failed to book flight", error: error.message });
  }
};

const commentOnGuide = async (req, res) => {
  try {
    const { guideID, text } = req.body; // Expecting guide ID and comment text in the request body
    const touristID = req.params.id; // Assuming you have user info stored in req.user

    // Validate input
    if (!guideID || !text) {
      return res
        .status(400)
        .json({ message: "Guide ID and comment text are required." });
    }

    // Validate that the guide exists (optional but recommended)
    const guide = await TourGuide.findById(guideID);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found." });
    }

    // Create a new comment
    const newComment = await CommentModel.create({
      touristID, // Change to match your schema
      aboutId: guideID, // Change to match your schema
      text, // Assuming `text` is a field in your comment schema
    });

    res
      .status(201)
      .json({ message: "Comment posted successfully", comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error posting comment", error: error.message });
  }
};

const RateGuide = async (req, res) => {
  const { touristId, guideId, rating } = req.body;
  try {
    const newRating = await RatingModel.create({
      itemId: guideId,
      userId: touristId,
      rating,
    });
    await axios.put(`http://localhost:8000/updateGuideRatings/${guideId}`);
    res
      .status(200)
      .json({ message: "Rating posted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error.message); // Log error for debugging
    res
      .status(400)
      .json({ message: "Error posting rating", error: error.message });
  }
};

const makeComplaint = async (req, res) => {
  const { Title, Body } = req.body; // Extract title and body from the request

  // Validation: ensure the required fields are present
  if (!Title || !Body) {
    return res.status(400).json({ message: "Title and Body are required" });
  }

  try {
    // Create a new complaint object
    const newComplaint = new Complaints({
      Title,
      Body,
      Date: Date.now(), // This will default to the current date, can be omitted since schema has a default
    });

    // Save the complaint to the database
    const savedComplaint = await newComplaint.save();

    // Send a response with the saved complaint
    return res.status(201).json({
      message: "Complaint created successfully",
      complaint: savedComplaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addCommentONEvent = async (req, res) => {
  const { comment, eventId, touristID } = req.body;
  try {
    const newComment = await CommentModel.create({
      touristID,
      comment,
      aboutId: eventId,
    });
    res
      .status(200)
      .json({ message: "Comment posted successfully", comment: newComment });
  } catch {
    res.status(400).json({ message: "Error posting comment" });
  }
};

const rateItinerary = async (req, res) => {
  const { touristId, itineraryId, rating } = req.body;
  try {
    const newRating = await RatingModel.create({
      itemId: itineraryId,
      userId: touristId,
      rating,
    });
    await axios.put(
      `http://localhost:8000/updateItineraryRatings/${itineraryId}`
    );
    res
      .status(200)
      .json({ message: "Rating posted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error.message); // Log error for debugging
    res
      .status(400)
      .json({ message: "Error posting rating", error: error.message });
  }
};

const updateItineraryRatings = async (req, res) => {
  const { itineraryId } = req.params;
  try {
    const averageRating = await RatingModel.aggregate([
      { $match: { itemId: new mongoose.Types.ObjectId(itineraryId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (averageRating.length > 0) {
      // Await the findByIdAndUpdate call to get the updated document
      const updatedItinerary = await itineraryModel.findByIdAndUpdate(
        { _id: itineraryId },
        {
          averageRating: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
          totalRatings: averageRating[0].totalRatings,
        },
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        itinerary: updatedItinerary, // Return the updated tour guide data
      });
    } else {
      return res
        .status(404)
        .json({ message: "No ratings found for this item." });
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const commentOnItinerary = async (req, res) => {
  try {
    const { guideID, itineraryID, text } = req.body; // Expecting guide ID, itinerary ID, and comment text in the request body
    const touristID = req.params.id; // Assuming the tourist ID is passed as a parameter

    // Validate input
    if (!guideID || !itineraryID || !text) {
      return res.status(400).json({
        message: "Guide ID, Itinerary ID, and comment text are required.",
      });
    }

    // Validate that the guide exists
    const guide = await TourGuide.findById(guideID); // Assuming TourGuide is your guide model
    if (!guide) {
      return res.status(404).json({ message: "Guide not found." });
    }

    // Validate that the itinerary exists and was created by the specified guide
    const itinerary = await itineraryModel.findOne({
      _id: itineraryID,
      Creator: guideID,
    }); // Assuming 'Creator' field references the guide
    if (!itinerary) {
      return res
        .status(404)
        .json({ message: "Itinerary not found for the given guide." });
    }

    // Validate that the tourist exists
    const tourist = await userModel.findById(touristID); // Assuming 'userModel' is your tourist model
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Validate that the tourist follows the guide
    if (!tourist.followedGuides.includes(guideID)) {
      return res.status(403).json({
        message:
          "You must follow the tour guide to comment on their itinerary.",
      });
    }

    // You might need a way to check if the tourist followed the itinerary
    if (!tourist.followedItineraries.includes(itineraryID)) {
      return res
        .status(403)
        .json({ message: "Tourist has not followed this itinerary." });
    }

    // Create a new comment
    const newComment = await CommentModel.create({
      touristID, // ID of the tourist commenting
      guideID, // ID of the tour guide
      itineraryID, // ID of the itinerary
      text, // Comment text
    });

    // Send the response with the created comment
    res
      .status(201)
      .json({ message: "Comment posted successfully", comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error posting comment", error: error.message });
  }
};

const viewAttendedActivities = async (req, res) => {
  const touristId = req.params.touristId; // Get the touristId from params
  const model = "Attraction";

  try {
    // Fetch activities using the filter
    const activities = await bookingSchema
      .find({ itemModel: model })
      .populate("itemId")
      .populate({ path: "itemId", populate: { path: "Creator" } });
    const currentDate = new Date();
    // Check if any activities were found
    if (activities.length === 0) {
      return res.status(404).json({ message: "No past activities found." });
    }
    const id = new mongoose.Types.ObjectId(touristId);
    const attended = activities.filter((activity) => {
      return (
        activity.itemId._id.toString() === id.toString() &&
        activity.bookedDate < currentDate
      );
    });

    res.status(200).json(attended); // Return filtered past activities
  } catch (error) {
    console.error("Error fetching activities:", error); // Log the error
    return res.status(400).json({ message: "Error fetching activities" });
  }
};

const viewAttendedItineraries = async (req, res) => {
  const touristId = req.params.touristId; // Get the touristId from params
  const model = "Itinerary";

  try {
    // Fetch activities using the filter
    const itineraries = await bookingSchema
      .find({ itemModel: model })
      .populate("itemId")
      .populate({ path: "itemId", populate: { path: "Creator" } });
    const currentDate = new Date();
    // Check if any itineraries were found
    if (itineraries.length === 0) {
      return res.status(404).json({ message: "No past itineraries found." });
    }
    const id = new mongoose.Types.ObjectId(touristId);
    const attended = itineraries.filter((itinerary) => {
      return (
        itinerary.itemId._id.toString() === id.toString() &&
        itinerary.bookedDate < currentDate
      );
    });

    res.status(200).json(attended); // Return filtered past itineraries
  } catch (error) {
    console.error("Error fetching itineraries:", error); // Log the error
    return res.status(400).json({ message: "Error fetching itineraries" });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  touristRegister,
  searchAttractions,
  handleTourist,
  filterPlaces,
  viewTouristProducts,
  TouristsearchProductByName,
  viewUpcomingActivitiesAndItineraries,
  sortProductsByRatingstourist,
  filterItineraries,
  filterActivities,
  viewActivities,
  viewItineraries,
  viewPlaces,
  searchActivities,
  sortActivitiesByRatings,
  readPlaces,
  getAge,
  SearchFlights,
  BookFlight,
  commentOnGuide,
  commentOnItinerary,
  RateGuide,
  makeComplaint,
  addCommentONEvent,
  rateItinerary,
  updateItineraryRatings,
  viewAttendedActivities,
  viewAttendedItineraries,
};
