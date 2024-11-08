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
const TransportationModel = require("../Models/transportation.js");
const PreferenceTags = require("../Models/preferenceTags.js");
const ReviewModel = require("../Models/review.js");
const Booking = require("../Models/bookings.js");
const apiKey = "b485c7b5c42a8362ccedd69ab6fe973e";
const baseUrl = "http://data.fixer.io/api/latest";
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: maxAge,
  });
};
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

    // // 2. Check if the user already exists (by Email)
    // const existingUser = await userModel.findOne({ Email: Email });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ message: "User with this email already exists." });
    // }

    const existingUser1 = await Usernames.findOne({ Username: Username });

    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this Username already exists." });
    }

    // 3. Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    let parsedPoints = 0;

    if (Points) {
      // 4. Ensure Points is an integer and validate the input
      parsedPoints = parseInt(Points); // Convert Points to an integer
      if (isNaN(parsedPoints) || parsedPoints < 0) {
        // Check if the input is not a number or if it's negative
        parsedPoints = 0; // Default to 0 points if invalid input
      }
    } else {
      parsedPoints = 0;
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
    await Usernames.create({ Username: Username, userID, Type: "Tourist" });

    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // 7. Send success response
    res
      .status(200)
      .json({ message: "User registered successfully", userID: newUser._id });
  } catch (error) {
    // Handle errors (e.g., database issues)
    console.log(error);
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
    if (!products || products.length === 0) {
      // Check if the products array is empty
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
  const { origin, destination, departureDate, returnDate } = req.body;

  // Validate input
  if (!origin || !destination || !departureDate) {
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
          returnDate: returnDate || undefined, // Omit returnDate if it's an empty string
          adults: 1, // Use 'adults' instead of 'travelers'
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
    res.status(500).json({
      message: "Failed to search flights",
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Book Flight Function
const BookFlight = async (req, res) => {
  try {
    const { flightID, price, departureDate, arrivalDate } = req.body; // This should be the flight offer object
    const touristID = req.params.touristID;

    // Check if the flight order is valid
    if (!flightID || !price || !departureDate || !arrivalDate) {
      return res.status(400).json({ error: "Invalid flight order data" });
    }

    // Constructing the booking data
    const bookingData = {
      flightID: flightID,
      price: price,
      bookingDate: new Date(),
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    };

    // Simulate booking API call
    const bookingResponse = await bookFlightWithAPI(bookingData);

    if (bookingResponse.success) {
      const updatedTourist = await userModel.findByIdAndUpdate(
        touristID,
        { $push: { bookedFlights: bookingData } },
        { new: true }
      );

      return res.status(200).json({
        message: "Flight booked successfully!",
        bookingDetails: bookingResponse.details,
        updatedTourist,
      });
    } else {
      return res.status(500).json({ error: "Failed to book the flight." });
    }
  } catch (error) {
    console.error("Error processing flight order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { BookFlight };

// Mock function to simulate an API booking call
const bookFlightWithAPI = async (bookingData) => {
  // Simulate a successful booking response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        details: {
          confirmationNumber: "ABC123",
          flightInfo: bookingData.flightOffer,
        },
      });
    }, 1000);
  });
};

const searchHotellocation = async (place) => {
  const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${place}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '684b518fd4msh6abdc4f9636114dp126cf9jsn5683c38d57f4',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching hotel location data");
  }
};

const searchHotel = async (req, res) => {
  const { place, checkInDate, checkOutdate } = req.body;
  
  try {
    const locationData = await searchHotellocation(place);
    
    if (!locationData || !locationData.data || locationData.data.length === 0) {
      return res.status(400).json({ message: 'No location data found' });
    }
    
    const geoId = locationData.data[0].geoId;
    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=${geoId}&checkIn=${checkInDate}&checkOut=${checkOutdate}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '684b518fd4msh6abdc4f9636114dp126cf9jsn5683c38d57f4',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });
  
    if (!response.ok) throw new Error(`Error: ${response.status}`);
      
    const hotelData = await response.json();

    // Check if the response data has hotels
    if (!hotelData || !hotelData.data || hotelData.data.length === 0) {
      return res.status(400).json({ message: 'No hotels found' });
    }

    // Retrieve the first 5 hotels and extract relevant details
    const hotels = hotelData.data.data.slice(0, 5).map(hotel => ({
      title: hotel.title,
      price: hotel.priceForDisplay || 'N/A',
      rating: hotel.bubbleRating ? hotel.bubbleRating.rating : 'N/A',
      provider: hotel.provider || 'N/A',
      cancellationPolicy: hotel.priceDetails || 'N/A',
      isSponsored: hotel.isSponsored || false,
      imageUrl: hotel.cardPhotos && hotel.cardPhotos[0] ? hotel.cardPhotos[0].url : 'N/A'
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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
      return res.status(400).json({ message: "Guide not found." });
    }

    // Create a new comment
    const newComment = await CommentModel.create({
      touristID, // Change to match your schema
      aboutId: guideID, // Change to match your schema
      Body: text, // Assuming `text` is a field in your comment schema
    });

    res
      .status(200)
      .json({ message: "Comment posted successfully", comment: newComment });
    console.log("Commented");
  } catch (error) {
    console.error("Error posting comment:", error); // Log error for debugging
    res
      .status(400)
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
  const { Title, Body, touristID, reply } = req.body;

  // Validation: Ensure the required fields are present
  if (!Title || !Body) {
    return res.status(400).json({ message: "Title and Body are required" });
  }

  try {
    // Create a new complaint object with a placeholder for reply if not provided
    const newComplaint = new Complaints({
      Title,
      Body,
      Maker: touristID,
      Date: Date.now(),
      reply: reply || { Body: "No reply yet", Date: Date.now() }, // Ensure reply.Body has a value
    });

    // Save the complaint to the database
    const savedComplaint = await newComplaint.save();

    // Send a response with the saved complaint
    return res.status(200).json({
      message: "Complaint created successfully",
      complaint: savedComplaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

const addCommentONEvent = async (req, res) => {
  const { Body, eventId, touristID } = req.body;
  try {
    const newComment = await CommentModel.create({
      touristID,
      Body,
      aboutId: eventId,
    });
    res
      .status(200)
      .json({ message: "Comment posted successfully", comment: newComment });
  } catch (error) {
    console.log(error);
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
    // await axios.put(
    //   http://localhost:8000/updateItineraryRatings/${itineraryId}
    // );
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
    const { itineraryID, Body } = req.body; // Expecting itinerary ID and comment text in the request body
    const touristID = req.params.id; // Assuming tourist ID is passed as a parameter

    // Validate input
    if (!itineraryID || !Body) {
      return res
        .status(400)
        .json({ message: "Itinerary ID and comment text are required." });
    }

    // Validate that the itinerary exists (optional but recommended)
    const itinerary = await itineraryModel.findById(itineraryID);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Create a new comment
    const newComment = await CommentModel.create({
      touristID, // Assuming `touristID` matches your schema
      aboutId: itineraryID, // Change to match your schema
      Body, // Assuming `text` is a field in your comment schema
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
        activity.userId.toString() === id.toString() &&
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
        itinerary.userId.toString() === id.toString() &&
        itinerary.bookedDate < currentDate
      );
    });

    res.status(200).json(attended); // Return filtered past itineraries
  } catch (error) {
    console.error("Error fetching itineraries:", error); // Log the error
    return res.status(400).json({ message: "Error fetching itineraries" });
  }
};

const changePasswordTourist = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Find the tour guide by id
    const tourist = await userModel.findById(id);
    if (!tourist) {
      return res.status(404).json({ message: "tourist not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, tourist.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    tourist.Password = hashedNewPassword;
    await tourist.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const viewAllTransportations = async (req, res) => {
  try {
    // Fetch all transportations from the database
    const transportations = await TransportationModel.find();

    // Check if there are transportations available
    if (transportations.length === 0) {
      return res
        .status(404)
        .json({ message: "No transportation options available." });
    }

    // Respond with the list of transportations
    res.status(200).json({
      message: "Transportations retrieved successfully!",
      transportations,
    });
  } catch (err) {
    console.error("Error fetching transportations:", err);
    res.status(500).json({ message: "Failed to retrieve transportations." });
  }
};

const bookTransportation = async (req, res) => {
  try {
    const { itemId, itemModel, userId, bookedDate } = req.body; // Get the transportation ID and tourist ID from the request body
    // Check if the transportation option exists and is available
    const transportation = await TransportationModel.findById(itemId);
    if (!transportation || !transportation.availability) {
      return res
        .status(404)
        .json({ message: "Transportation option not found or not available." });
    }

    // Create a new booking record
    const newBooking = new bookingSchema({
      itemId,
      itemModel: "Transportation",
      userId,
      bookedDate,
      // You can add more details if needed
    });
    await newBooking.save();

    // Optionally update the transportation availability if required
    // transportation.availability = false; // Mark it as not available after booking
    await transportation.save();

    // Respond back with success message and booking details
    res.status(200).json({
      message: "Transportation booked successfully!",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error booking transportation:", err);
    res.status(500).json({ message: "Unable to book transportation." });
  }
};

const rateProduct = async (req, res) => {
  const { userId, productId, rating } = req.body;
  try {
    const newRating = await RatingModel.create({
      itemId: productId, // Refers to the product being rated
      userId, // Refers to the user rating the product
      rating,
    });
    await axios.put(`http://localhost:8000/updateProductRatings/${productId}`);
    res
      .status(200)
      .json({ message: "Rating posted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error.message);
    res
      .status(400)
      .json({ message: "Error posting rating", error: error.message });
  }
};

const updateProductRatings = async (req, res) => {
  const { productId } = req.params;
  try {
    const averageRating = await RatingModel.aggregate([
      { $match: { itemId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (averageRating.length > 0) {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        { _id: productId },
        {
          ratings: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
        },
        { new: true }
      );

      return res.status(200).json({
        product: updatedProduct, // Return the updated product data
      });
    } else {
      return res
        .status(404)
        .json({ message: "No ratings found for this product." });
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const selectPreferences = async (req, res) => {
  try {
    const { userId, historicAreas, beaches, familyFriendly, shopping, budget } =
      req.body; // Retrieve preferences from request body

    // Check if preferences already exist for the user

    let preferences = await PreferenceTags.findOne({ userId });
    if (preferences) {
      // Update existing preferences
      preferences.historicAreas = historicAreas;
      preferences.beaches = beaches;
      preferences.familyFriendly = familyFriendly;
      preferences.shopping = shopping;
      preferences.budget = budget;
      await preferences.save();
    } else {
      // Create new preferences if not existing
      preferences = new PreferenceTags({
        userId,
        historicAreas,
        beaches,
        familyFriendly,
        shopping,
        budget,
      });
      await preferences.save();
    }
    res.status(200).json({
      message: "Preferences saved successfully!",
      preferences,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Unable to save preferences." });
  }
};

const requestTouristAccountDeletion = async (req, res) => {
  const { touristID } = req.params;

  try {
    console.log("Received request for tourist ID:", touristID); // Debug log

    // Ensure the tourist exists without altering other fields
    const tourist = await userModel.findById(touristID);
    if (!tourist || tourist.isDeleted) {
      return res
        .status(404)
        .json({ message: "Tourist not found or already deleted" });
    }

    // Check for upcoming bookings for events, activities, or itineraries
    const currentDate = new Date();
    const upcomingBookings = await bookingSchema.find({
      userId: touristID,
      paid: true,
      bookedDate: { $gte: currentDate },
    });

    if (upcomingBookings.length > 0) {
      return res.status(400).json({
        message:
          "Account cannot be deleted. There are upcoming bookings that are paid for.",
      });
    }

    // Mark the account as deleted (soft delete) using `findByIdAndUpdate`
    await userModel.findByIdAndUpdate(
      touristID,
      { isDeleted: true },
      { new: true }
    );

    // Optionally hide all associated events, activities, and itineraries
    await Promise.all([
      attractionModel.updateMany({ Creator: touristID }, { isVisible: false }),
      itineraryModel.updateMany({ Creator: touristID }, { isVisible: false }),
    ]);

    res.status(200).json({
      message:
        "Account deletion requested successfully. Profile and associated data will no longer be visible.",
    });
  } catch (error) {
    console.error("Error processing account deletion request:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const calculateLoyaltyPoints = async (req, res) => {
  const { amountPaid, touristID } = req.body;

  try {
    console.log("Calculating loyalty points for tourist ID:", touristID);

    // Fetch the tourist's current points from the database (assuming you have a `userModel`).
    const tourist = await userModel.findById(touristID);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Determine the level based on existing points
    const totalPoints = tourist.Points;
    let level;
    if (totalPoints <= 100000) {
      level = 1;
    } else if (totalPoints <= 500000) {
      level = 2;
    } else {
      level = 3;
    }

    // Calculate loyalty points based on level
    let pointsEarned;
    switch (level) {
      case 1:
        pointsEarned = amountPaid * 0.5;
        break;
      case 2:
        pointsEarned = amountPaid * 1;
        break;
      case 3:
        pointsEarned = amountPaid * 1.5;
        break;
      default:
        return res.status(400).json({ message: "Invalid level" });
    }

    // Update the user's total points in the database
    const updatedPoints = totalPoints + pointsEarned;
    await userModel.findByIdAndUpdate(
      touristID,
      { Points: updatedPoints },
      { new: true }
    );

    res.status(200).json({
      message: "Loyalty points calculated successfully",
      pointsEarned,
      updatedPoints,
    });
  } catch (error) {
    console.error("Error calculating loyalty points:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const viewMyComplaints = async (req, res) => {
  try {
    // Step 1: Extract the tourist ID from the request parameters
    const { touristID } = req.params;

    // Step 2: Fetch complaints for the specific tourist from the database
    const complaints = await Complaints.find({ Maker: touristID }); // Filter by Maker field

    // Step 3: Check if there are no complaints for this tourist
    if (!complaints || complaints.length === 0) {
      return res
        .status(404)
        .json({ message: "No complaints found for this tourist." });
    }

    // Step 4: Map through the complaints to prepare the response
    const complaintList = complaints.map((complaint) => ({
      id: complaint._id, // Unique complaint ID
      Title: complaint.Title, // Complaint title
      Body: complaint.Body, // Complaint body text
      Date: complaint.Date, // Date when the complaint was made
      Status: complaint.Status, // Status (pending/resolved)
    }));

    // Step 5: Return the list of complaints for the specific tourist
    return res.status(200).json({
      message: "Complaints retrieved successfully.",
      complaints: complaintList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const redeemPoints = async (req, res) => {
  const { touristID, pointsToRedeem } = req.body;

  try {
    //const pointsToRedeem=tourist.points;
    // Validate input
    if (!touristID || !pointsToRedeem) {
      return res
        .status(400)
        .json({ message: "Tourist ID and points to redeem are required." });
    }

    // Fetch the tourist's current points and wallet balance
    const tourist = await userModel.findById(touristID);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Check if the tourist has enough points to redeem
    if (pointsToRedeem <= 0 || pointsToRedeem > tourist.Points) {
      return res
        .status(400)
        .json({ message: "Insufficient points to redeem." });
    }

    // Calculate the cash equivalent of the points
    const cashEquivalent = (pointsToRedeem / 1000) * 100; // 1000 points = 100 EGP

    // Update the tourist's wallet balance and points
    tourist.Wallet += cashEquivalent; // Add the cash equivalent to wallet
    tourist.Points -= pointsToRedeem; // Deduct the redeemed points

    // Save the changes
    await tourist.save();

    // Respond with success message and updated balance
    res.status(200).json({
      message: "Points redeemed successfully.",
      cashEquivalent,
      updatedWalletBalance: tourist.Wallet,
      remainingPoints: tourist.Points,
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const reviewProduct = async (req, res) => {
  const { productId, userId, review } = req.body; // Only productId and review as a string
  try {
    // Create a new review entry
    const newReview = await ReviewModel.create({
      itemId: productId, // Refers to the product being reviewed
      userId,
      review, // Only store the review string
    });

    res.status(200).json({
      message: "Review posted successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error posting review:", error.message);
    res.status(400).json({
      message: "Error posting review",
      error: error.message,
    });
  }
};
const getMyBookings = async (req, res) => {
  const { touristID } = req.params; // Assuming the tourist ID is passed in the URL

  try {
    // Find all bookings for the specified tourist ID
    const bookings = await Booking.find({ userId: touristID });

    // Check if any bookings are found
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No bookings found for this tourist." });
    }

    // Return the list of bookings
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingID } = req.params; // Assuming the booking ID is passed in the URL

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingID);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const currentDate = new Date();
    const createdAt = new Date(booking.createdAt); // Use the booking's creation date to check if it's within 48 hours

    // Calculate the time difference in hours
    const hoursSinceBooking = (currentDate - createdAt) / (1000 * 60 * 60);

    // Check if the booking was made within the last 48 hours
    if (hoursSinceBooking < 48) {
      return res.status(400).json({
        error: "You can only cancel bookings within 48 hours of making them.",
      });
    }

    // If eligible, proceed to cancel the booking
    await Booking.findByIdAndDelete(bookingID);

    res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Failed to cancel booking." });
  }
};

const shareActivity = async (req, res) => {
  const { activityId, shareMethod, email } = req.body; // Expecting activity ID, share method (link or email), and email address if sharing via email

  try {
    // Validate input
    if (!activityId) {
      return res.status(400).json({ message: "Activity ID is required." });
    }

    // Find the activity by ID
    const activity = await attractionModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Generate a shareable link
    const shareableLink = `${req.protocol}://${req.get("host")}/activities/${activityId}`;

    if (shareMethod === "link") {
      // If sharing via link, return the link
      return res.status(200).json({
        message: "Shareable link generated successfully.",
        link: shareableLink,
      });
    } else if (shareMethod === "email") {
      if (!email) {
        return res.status(400).json({
          message: "Email address is required for sharing via email.",
        });
      }

      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email address (configured as environment variable)
          pass: process.env.EMAIL_PASS, // Your email password or app password (configured as environment variable)
        },
      });

      // Set email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Check out this activity!',
        text: `I thought you might be interested in this activity: ${shareableLink}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Email sent successfully.",
        link: shareableLink,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid share method. Use 'link' or 'email'." });
    }
  } catch (error) {
    console.error("Error sharing activity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const nodemailer = require("nodemailer");

const shareItenerary = async (req, res) => {
  const { activityId, shareMethod, email } = req.body;

  try {
    // Validate input
    if (!activityId) {
      return res.status(400).json({ message: "Activity ID is required." });
    }

    // Find the activity by ID
    const activity = await itineraryModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Generate a shareable link
    const shareableLink = `${req.protocol}://${req.get("host")}/activities/${activityId}`;

    if (shareMethod === "link") {
      // If sharing via link, return the link
      return res.status(200).json({
        message: "Shareable link generated successfully.",
        link: shareableLink,
      });
    } else if (shareMethod === "email") {
      if (!email) {
        return res.status(400).json({
          message: "Email address is required for sharing via email.",
        });
      }

      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email address (configured as environment variable)
          pass: process.env.EMAIL_PASS, // Your email password or app password (configured as environment variable)
        },
      });

      // Set email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Check out this activity!',
        text: `I thought you might be interested in this activity: ${shareableLink}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Email sent successfully.",
        link: shareableLink,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid share method. Use 'link' or 'email'." });
    }
  } catch (error) {
    console.error("Error sharing activity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};




const rateEvent = async (req, res) => {
  const { userId, eventId, rating } = req.body;
  try {
    const newRating = await RatingModel.create({
      itemId: eventId, // Refers to the event being rated
      userId, // Refers to the user rating the event
      rating,
    });
    await axios.put(`http://localhost:8000/updateEventRatings/${eventId}`);
    res
      .status(200)
      .json({ message: "Rating posted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error.message);
    res
      .status(400)
      .json({ message: "Error posting rating", error: error.message });
  }
};

const bookItinerary = async (req, res) => {
  try {
    const { itineraryId, userId, bookedDate } = req.body; // Get itinerary ID, user ID, and booked date from the request body

    // Check if the itinerary exists
    const itinerary = await itineraryModel.findById(itineraryId);
    if (!itinerary) {
      return res.status(40).json({ message: "Itinerary not found." });
    }


    // Create a new booking record using the bookingSchema model
    const newBooking = new bookingSchema({
      itemId: itineraryId,
      itemModel: "Itinerary", // Use 'Itinerary' since you're booking an itinerary
      userId, // Make sure userId is correctly passed from the request
      bookedDate,
    });

    await newBooking.save();

    // Update the itinerary document to include the new booking ID
    itinerary.Bookings.push(newBooking._id); // Push the new booking ID to the Bookings array


    // Attempt to save the updated itinerary document
    await itinerary.save();

    // Respond back with success message and booking details
    res.status(200).json({
      message: "Itinerary booked successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking itinerary:", error.message); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error booking itinerary", error: error.message });
  }
};

const bookActivity = async (req, res) => {
  try {
    const { activityId, userId, bookedDate } = req.body; // Get itinerary ID, user ID, and booked date from the request body

    // Check if the itinerary exists
    const activity = await attractionModel.findById(activityId);
    if (!activity) {
      return res.status(40).json({ message: "Itinerary not found." });
    }


    // Create a new booking record using the bookingSchema model
    const newBooking = new bookingSchema({
      itemId: activityId,
      itemModel: "Itinerary", // Use 'Itinerary' since you're booking an itinerary
      userId, // Make sure userId is correctly passed from the request
      bookedDate,
    });

    await newBooking.save();

    // Update the itinerary document to include the new booking ID
    activity.Bookings.push(newBooking._id); // Push the new booking ID to the Bookings array


    // Attempt to save the updated itinerary document
    await activity.save();

    // Respond back with success message and booking details
    res.status(200).json({
      message: "Itinerary booked successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking itinerary:", error.message); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error booking itinerary", error: error.message });
  }
};
const updateEventRatings = async (req, res) => {
  const { eventId } = req.params;
  try {
    const averageRating = await RatingModel.aggregate([
      { $match: { itemId: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (averageRating.length > 0) {
      const updatedEvent = await itineraryModel.findByIdAndUpdate(
        { _id: eventId },
        {
          ratings: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
        },
        { new: true }
      );

      return res.status(200).json({
        event: updatedEvent, // Return the updated event data
      });
    } else {
      return res
        .status(404)
        .json({ message: "No ratings found for this event." });
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const currencyConverter = async (req, res) => {
  const baseCurrency = req.body.base || "EGP"; // Default base currency
  const targetCurrency = req.body.target;

  if (!targetCurrency) {
    return res.status(400).json({
      success: false,
      message: "Target currency is required",
    });
  }

  try {
    // Fetch rates with 'EUR' as the base (due to the limitation of the free plan)
    const response = await fetch(
      `${baseUrl}?access_key=${apiKey}&symbols=${baseCurrency},${targetCurrency}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch currency data");
    }

    const data = await response.json();

    // Check for API success and handle potential errors
    if (!data.success) {
      return res.status(500).json({
        success: false,
        message: data.error.info || "Error fetching data from Fixer",
      });
    }

    const rateToEGP = data.rates[baseCurrency]; // EUR to EGP rate
    const rateToTarget = data.rates[targetCurrency]; // EUR to target currency rate

    if (!rateToEGP || !rateToTarget) {
      return res.status(404).json({
        success: false,
        message: `Conversion rate for ${baseCurrency} or ${targetCurrency} not found`,
      });
    }

    // Calculate the conversion rate from EGP to target currency
    const conversionRate = rateToTarget / rateToEGP;

    res.status(200).json({
      success: true,
      baseCurrency,
      targetCurrency,
      conversionRate,
    });
  } catch (error) {
    console.error("Error fetching currency data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching currency data",
    });
  }
};
const getProductReviews = async (req, res) => {
  const { productId } = req.params; // Get productId from the request parameters
  try {
    // Find reviews related to the specific productId, and select only the 'review' field
    const reviews = await ReviewModel.find({ itemId: productId }).select(
      "review"
    );

    // If no reviews found, send a message indicating that
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this product.",
      });
    }

    // Return the reviews in the response (only the 'review' field)
    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews: reviews.map((review) => review.review), // Send only the review text
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(400).json({
      message: "Error fetching reviews",
      error: error.message,
    });
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
  changePasswordTourist,
  bookTransportation,
  rateProduct,
  updateProductRatings,
  selectPreferences,
  requestTouristAccountDeletion,
  calculateLoyaltyPoints,
  viewMyComplaints,
  searchHotellocation,
  searchHotel,
  redeemPoints,
  reviewProduct,
  cancelBooking,
  shareActivity,
  bookItinerary,
  rateEvent,
  updateEventRatings,
  currencyConverter,
  viewAllTransportations,
  getMyBookings,
  getProductReviews,
  bookActivity,
  shareItenerary,
};
