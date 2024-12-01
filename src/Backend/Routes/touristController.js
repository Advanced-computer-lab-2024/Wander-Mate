const userModel = require("../Models/tourist.js");
const attractionModel = require("../Models/attractions.js");
const Notification = require("../Models/notifications.js");
const itineraryModel = require("../Models/itinerary.js");
const mongoose = require("mongoose");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
const HotelBooked = require("../Models/bookedHotel.js");
const BookedFlight = require("../Models/bookedFlights.js");
const apiKey = "b485c7b5c42a8362ccedd69ab6fe973e";
const baseUrl = "http://data.fixer.io/api/latest";
const jwt = require("jsonwebtoken");
const Address = require("../Models/address.js");
const PromoCode = require("../Models/promoCode.js");
const Cart = require("../Models/cart.js");
const Wishlist = require("../Models/whishlist.js");
const ordermodel = require("../Models/order.js");
const bookmarked = require("../Models/bookMark.js");
const emailjs = require("emailjs-com");
emailjs.init(process.env.EMAILJS_USER_ID); // Initialize with public user ID
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
    let badge = assignBadge(Points);

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
      Points: 0,
      Badge: badge,
    });
    const userID = newUser._id;
    await Usernames.create({
      Username: Username,
      userID,
      Type: "Tourist",
      Email,
    });

    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // 7. Send success response
    res.status(200).json({
      message: "User registered successfully",
      userID: newUser._id,
      Username: newUser.Username,
    });
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
      let Points = tourist.Points;
      const assignBadge = (points) => {
        if (points <= 100000) {
          return "level 1"; // Up to 100K points
        } else if (points <= 500000) {
          return "level 2"; // Up to 500K points
        } else {
          return "level 3"; // More than 500K points
        }
      };
      const badge = assignBadge(Points);
      tourist.Badge = badge;
      await tourist.save();

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
        Currency,
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
      if (Points !== undefined) {
        // Check if Points is provided
        const parsedPoints = parseFloat(Points); // Ensure it's a number
        if (isNaN(parsedPoints) || parsedPoints < 0) {
          return res.status(400).json({ message: "Invalid Points value." });
        }

        tourist.Points = parsedPoints;
        console.log("Updated Points:", tourist.Points);

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

        tourist.Badge = assignBadge(parsedPoints); // Use parsed points
        console.log("Updated Badge:", tourist.Badge);
      }

      // Check and add Currency field if it doesn't exist
      if (Currency) {
        if (!tourist.Currency) {
          // Add the Currency field if it doesn't exist
          tourist.Currency = Currency;
          console.log("Currency field added:", tourist.Currency);
        } else {
          // Update Currency if it's provided
          tourist.Currency = Currency;
          console.log("Currency updated:", tourist.Currency);
        }
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
    console.log(error);
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
      .populate("LocationsToVisit")
      .populate("Creator");
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
  const apiKey = "4p6AGJtMeInZOhszW4eOyfVEtxScS606"; // Replace with your Amadeus API key
  const apiSecret = "ixlYRS7f0eExPsEL"; // Replace with your Amadeus API secret

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
  const { origin, destination, departureDate, returnDate } = req.query;

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
    const { flightID, price, departureDate, arrivalDate } = req.body;
    const { touristID } = req.params;

    console.log("Received data:", {
      flightID,
      price,
      departureDate,
      arrivalDate,
      touristID,
    });

    if (!flightID || !price || !departureDate || !arrivalDate) {
      console.error("Invalid flight order data");
      return res.status(400).json({ error: "Invalid flight order data" });
    }

    const bookedFlight = new BookedFlight({
      userId: touristID,
      flightID,
      price,
      departureDate: new Date(departureDate),
      arrivalDate: new Date(arrivalDate),
      bookedDate: Date.now(),
    });

    console.log("Saving bookedFlight...");
    await bookedFlight.save();
    console.log("bookedFlight saved successfully.");

    const newBooking = new bookingSchema({
      itemId: bookedFlight._id,
      itemModel: "BookedFlights",
      userId: touristID,
      bookedDate: bookedFlight.bookedDate,
    });

    console.log("Saving newBooking...");
    await newBooking.save();
    console.log("newBooking saved successfully.");

    res.status(201).json({
      message: "Flight booked successfully",
      bookingDetails: { confirmationNumber: bookedFlight._id }, // Add confirmation number
    });
  } catch (error) {
    console.error("Error processing flight order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const searchHotellocation = async (place) => {
  const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${place}`;
  console.log("by");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1e3f65aa5cmsh39a2d77a5006638p1059c7jsnfd6b183ccc4e",
        "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`Error: ${response.status}`);
    }

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
      return res.status(400).json({ message: "No location data found" });
    }

    const geoId = locationData.data[0].geoId;
    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=${geoId}&checkIn=${checkInDate}&checkOut=${checkOutdate}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1e3f65aa5cmsh39a2d77a5006638p1059c7jsnfd6b183ccc4e",
        "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const hotelData = await response.json();

    if (!hotelData || !hotelData.data || hotelData.data.length === 0) {
      return res.status(400).json({ message: "No hotels found" });
    }

    // Extract relevant details including photos
    const hotels = hotelData.data.data.slice(0, 10).map((hotel) => ({
      id: hotel.id,
      title: hotel.title,
      price: hotel.priceForDisplay || "N/A",
      rating: hotel.bubbleRating ? hotel.bubbleRating.rating : "N/A",
      provider: hotel.provider || "N/A",
      cancellationPolicy: hotel.priceDetails || "N/A",
      isSponsored: hotel.isSponsored || false,
      cardPhotos: hotel.cardPhotos
        ? hotel.cardPhotos.map((photo) => photo.sizes.urlTemplate.replace("{width}", "400").replace("{height}", "300"))
        : [], // Default to empty array if no photos
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const bookHotel = async (req, res) => {
  const { userId, hotelId, title, checkIn, checkOut, price, provider } =
    req.body;

  try {
    // Create a new booking with the given details
    const hotelbooked = new HotelBooked({
      userId,
      hotelId,
      title,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      price,
      provider,
    });

    // Save to the database
    await hotelbooked.save();

    const newBooking = new bookingSchema({
      itemId: hotelbooked._id,
      itemModel: "HotelBooked", // Use 'Itinerary' since you're booking an itinerary
      userId, // Make sure userId is correctly passed from the request
      bookedDate: hotelbooked.checkIn,
    });

    await newBooking.save();

    res
      .status(201)
      .json({ message: "Hotel booked successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const commentOnGuide = async (req, res) => {
  try {
    const { guideID, text, username } = req.body; // Expecting guide ID and comment text in the request body
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
      touristID,
      aboutId: guideID,
      Body: text,
      username,
    });

    res
      .status(200)
      .json({ message: "Comment posted successfully", comment: newComment });
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
    // Check if the user has already rated the guide
    const existingRating = await RatingModel.findOne({
      userId: touristId,
      itemId: guideId,
    });

    if (existingRating) {
      // If the user has already rated, update the rating
      existingRating.rating = rating;
      await existingRating.save(); // Save the updated rating
      res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    } else {
      // If the user hasn't rated yet, create a new rating
      const newRating = await RatingModel.create({
        itemId: guideId,
        userId: touristId,
        rating,
      });
      res
        .status(200)
        .json({ message: "Rating posted successfully", rating: newRating });
    }

    // After updating or creating the rating, update the guide's ratings
    await axios.put(`http://localhost:8000/updateGuideRatings/${guideId}`);
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
  const { Body, eventId, touristID,username } = req.body;
  try {

    const newComment = await ReviewModel.create({
      userId: touristID, // Assuming `touristID` matches your schema
      itemId: eventId,
      username,
      review: Body, // Assuming `text` is a field in your comment schema
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
    // Check if the user has already rated this itinerary
    const existingRating = await RatingModel.findOne({
      userId: touristId,
      itemId: itineraryId,
    });

    if (existingRating) {
      // If the rating exists, update it
      existingRating.rating = rating;
      await existingRating.save(); // Save the updated rating
      res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    } else {
      // If the rating does not exist, create a new one
      const newRating = await RatingModel.create({
        itemId: itineraryId,
        userId: touristId,
        rating,
      });
      res
        .status(200)
        .json({ message: "Rating posted successfully", rating: newRating });
    }

    // After updating/creating the rating, update the itinerary's ratings on the backend
    await axios.put(
      `http://localhost:8000/updateItineraryRatings/${itineraryId}`
    );
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
          Ratings: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
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
    const { itineraryID, Body, username } = req.body; // Expecting itinerary ID and comment text in the request body
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
    const newComment = await ReviewModel.create({
      userId: touristID, // Assuming `touristID` matches your schema
      itemId: itineraryID,
      username,
      review: Body, // Assuming `text` is a field in your comment schema
    });

    res
      .status(200)
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
      .populate({
        path: "itemId",
        populate: [
          { path: "Creator" },
          {
            path: "LocationsToVisit",
          },
          {
            path: "Activities",
          },
        ],
      });
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

const requestTouristAccountDeletion = async (req, res) => {
  const { touristID } = req.params;

  try {
    console.log("Received request for tourist ID:", touristID);

    // Verify the tourist exists and isn't already deleted
    const tourist = await userModel.findById(touristID);
    if (!tourist || tourist.isDeleted) {
      return res
        .status(404)
        .json({ message: "Tourist not found or already deleted" });
    }

    // Set current date for comparison
    const currentDate = new Date();
    console.log("Current Date:", currentDate);

    // Check for any upcoming bookings by this tourist for itineraries or activities
    const upcomingBookings = await bookingSchema.find({
      userId: touristID, // Ensures userId format matches in MongoDB
      itemModel: { $in: ["Itinerary", "Attraction"] },
      bookedDate: { $gte: currentDate }, // Only future or present bookings
    });

    // Debugging output to confirm query results
    console.log("Upcoming bookings found:", upcomingBookings);

    // Prevent deletion if there are any future bookings
    if (upcomingBookings.length > 0) {
      return res.status(400).json({
        message: "Account cannot be deleted. Upcoming bookings exist.",
      });
    }

    await userModel.findOneAndDelete(touristID);
    await Usernames.findByIdAndDelete({ userID: touristID });

    // Proceed to delete if no future bookings found
    // await userModel.findByIdAndUpdate(
    //   touristID,
    //   { isDeleted: true },
    //   { new: true }
    // );

    // Hide associated attractions and itineraries
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
  const { productId, userId, review, username } = req.body; // Only productId and review as a string
  try {
    // Create a new review entry
    const newReview = await ReviewModel.create({
      itemId: productId, // Refers to the product being reviewed
      userId,
      review, // Only store the review string
      username,
    });

    await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview._id } }, // Push the new review ID to the reviews array
      { new: true } // Optionally return the updated product
    );

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
    const tourist = await userModel.findById(booking.userId);
    const attractionId = await attractionModel.findById(booking.itemId);
    const itineraryId = await itineraryModel.findById(booking.itemId);
    const transportId = await TransportationModel.findById(booking.itemId);
    const bookedHotelId = await HotelBooked.findById(booking.itemId);
    const bookedFlightId = await BookedFlight.findById(booking.itemId);

    const itemModel = booking.itemModel;
    console.log(tourist);
    console.log(booking.userId);


    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const currentDate = new Date();
    const createdAt = new Date(booking.bookedDate); // Use the booking's creation date to check if it's within 48 hours

    // Calculate the time difference in hours
    const hoursSinceBooking = (createdAt - currentDate) / 36e5;

    // Check if the booking was made within the last 48 hours
    if (hoursSinceBooking < 48) {
      return res.status(400).json({
        error:
          "The Booking already passed or there is less than 48 hours remaining until the booking",
      });
    }
    // If eligible, proceed to cancel the booking
    await Booking.findByIdAndDelete(bookingID);
    if (tourist) {
      console.log(tourist.Wallet);
      switch (itemModel) {
  case "Attraction":
      tourist.Wallet = (tourist.Wallet || 0) + attractionId.Price;
    break;
  case "Itinerary":
      tourist.Wallet = (tourist.Wallet || 0) + itineraryId.Price;
    break;
  case "Transportation":
      tourist.Wallet = (tourist.Wallet || 0) + transportId.Price;
          break;
  case "HotelBooked":
      tourist.Wallet = (tourist.Wallet || 0) + bookedHotelId.price;
          break;
  case "BookedFlights":
      tourist.Wallet = (tourist.Wallet || 0) + bookedFlightId.Price;
  default:
    break;
}

      console.log(attractionId);
      console.log(itemModel);
      console.log(tourist.Wallet)
      await tourist.save();
    }
    res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Failed to cancel booking." });
  }
};

const order = require("../Models/order.js");

const rateEvent = async (req, res) => {
  const { userId, eventId, rating } = req.body;
  try {
    const newRating = await RatingModel.create({
      itemId: eventId, // Refers to the event being rated
      userId, // Refers to the user rating the event
      rating,
    });
    await axios.put(`http://localhost:8000/updateActivityRating/${eventId}`);
    res
      .status(200)
      .json({ message: "Rating posted successfully", rating: newRating });
  } catch (error) {
    console.error("Error posting rating:", error);
    res
      .status(400)
      .json({ message: "Error posting rating", error: error.message });
  }
};

const updateActivityRatings = async (req, res) => {
  const{eventId} = req.params;
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
      const updatedEvent = await attractionModel.findByIdAndUpdate(
        { _id: eventId },
        {
          Ratings: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
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

const bookItinerary = async (req, res) => {
  try {
    const { itineraryId, userId, bookedDate } = req.body; // Get itinerary ID, user ID, and booked date from the request body

    // Check if the itinerary exists
    const itinerary = await itineraryModel.findById(itineraryId);
    if (!itinerary) {
      return res.status(400).json({ message: "Itinerary not found." });
    }

    console.log(bookedDate);
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
      itemModel: "Attraction", // Use 'Itinerary' since you're booking an itinerary
      userId, // Make sure userId is correctly passed from the request
      bookedDate,
    });

    // Update the itinerary document to include the new booking ID
    activity.Bookings.push(newBooking._id); // Push the new booking ID to the Bookings array

    // Attempt to save the updated itinerary document
    await activity.save();
    await newBooking.save();

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

const addPreference = async (req, res) => {
  const { touristId, preference } = req.body; // Get preference from the request body
  try {
    // Check if the touristId exists in the database
    const tourist = await userModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
      });
    }
    // Add the preference to the tourist's preferences array
    tourist.PreferenceTags.push(preference);
    await tourist.save();
    res.status(201).json({
      message: "Preference added successfully",
      preference: preference,
    });
  } catch (error) {
    console.error("Error adding preference:", error.message);
    res.status(400).json({
      message: "Error adding preference",
      error: error.message,
    });
  }
};

// Method to select preferences
const selectPreferences = async (req, res) => {
  try {
    const { touristId, preferences } = req.body;

    if (!touristId || !preferences) {
      return res
        .status(400)
        .json({ message: "Tourist ID and preferences are required." });
    }

    // Update the tourist's preferences
    const updatedTourist = await userModel.findByIdAndUpdate(
      touristId,
      { PreferenceTags: preferences },
      { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    return res.status(200).json({
      message: "Preferences updated successfully.",
      data: updatedTourist,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getPreferences = async (req, res) => {
  try {
    const { touristId } = req.params;
    const tourist = await userModel
      .findById(touristId)
      .populate("PreferenceTags");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    return res.status(200).json({
      message: "Preferences retrieved successfully.",
      data: tourist.PreferenceTags,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const removePreference = async (req, res) => {
  try {
    const { touristId, preferenceId } = req.params;
    const tourist = await userModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    tourist.PreferenceTags.pull(preferenceId);
    await tourist.save();
    return res.status(200).json({
      message: "Preference removed successfully.",
      data: tourist.PreferenceTags,
    });
  } catch (error) {
    console.error("Error removing preference:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addDeliveryAddress = async (req, res) => {
  const { touristId } = req.params;
  const { street, city, state, zipCode, country, location } = req.body;

  try {
    // Check if the tourist exists
    const tourist = await userModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Validate location
    if (
      !location ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    // Create a new address with location
    const newAddress = new Address({
      street,
      city,
      state,
      zipCode,
      country,
      userId: touristId, // Associate the address with the tourist
      location, // Use the validated location
    });

    // Save the address
    await newAddress.save();

    res.status(200).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
////////////////////////////Nadeem Sprint 3///////////////////////////
const assignBirthdayPromo = async () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Months are 0-based in JavaScript
  const currentDate = today.getDate();

  // Find tourists whose birthday is today
  const touristsWithBirthdays = await userModel.find({
    $expr: {
      $and: [
        { $eq: [{ $dayOfMonth: "$DOB" }, currentDate] },
        { $eq: [{ $month: "$DOB" }, currentMonth] },
      ],
    },
  });

  for (const tourist of touristsWithBirthdays) {
    try {
      // Check if a promo code already exists for this tourist
      const existingPromoCode = await PromoCode.findOne({
        assignedTo: tourist._id,
      });
      if (existingPromoCode) {
        console.log(
          `Promo code already exists for ${tourist.Username}: ${existingPromoCode.code}`
        );
        continue; // Skip to the next tourist
      }

      // Create a new promo code

      // const updatedTourist = await userModel.findByIdAndUpdate(
      //   touristId,
      //   { PreferenceTags: preferences },
      //   { new: true }
      // );
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      const promoCode = await PromoCode.create({
        code: `HappyBirthday${tourist.Username}`,
        expiryDate,
        assignedTo: tourist._id,
        isUsed: false,
      });

      // Push the promo code ID to the tourist's PromoCodes array
      tourist.PromoCode = promoCode._id; // Set the PromoCode field directly
      await tourist.save();
      let data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: "template_5zvk4eq",
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: tourist.Email,
          recipient_name: tourist.FullName,
          promo_code: promoCode.code,
          expiry_date: promoCode.expiryDate,
          cta_link: "http://localhost:3000/loginPage",
          logo_url:
            "https://drive.google.com/uc?id=1XRUvHmFG98cHMtw8ZlSf61uAwtKlkQJo",
        },
      };
      const reply = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!reply.ok) {
        const errorData = await reply.text();
        console.error("Email sending failed:", errorData);
      } else {
        console.log("Email sent successfully!");
      }

      console.log(
        `Promo code ${promoCode.code} is assigned to ${tourist.Username}`
      );
    } catch (error) {
      console.error("Error assigning promo code:", error);
    }
  }
};

const PayByCard = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate inputs
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error("Invalid input: amount must be a positive integer");
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Respond with client secret
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
////////////////////////////Nadeem Sprint 3///////////////////////////

const removeFromCart = async (req, res) => {
  const { touristID, productId, attributes } = req.body;

  if (!touristID || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ touristID });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((item) => {
      return (
        item.productId.toString() === productId &&
        (!attributes ||
          JSON.stringify(item.attributes) === JSON.stringify(attributes))
      );
    });

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Item removed from cart successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error removing item from cart" });
  }
};

const removeProduct = async (req, res) => {
  const { touristID, productId } = req.body;

  if (!touristID || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ touristID });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Debugging: Check the cart before removal
    console.log("Cart before removal:", cart.items);

    // Filter out all instances of the product from the cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Debugging: Check the cart after removal
    console.log("Cart after removal:", cart.items);

    // Save the updated cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    return res
      .status(400)
      .json({ message: "Error removing product from cart" });
  }
};

const Bookmarkevent = async (req, res) => {
  const { userId, eventId, type } = req.body;

  if (!userId || !eventId || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Validate user
    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if event is already bookmarked
    if (user.bookmarkedAttractions.includes(eventId)) {
      return res.status(400).json({ message: "Event already bookmarked" });
    }

    // Add or update bookmark in BookMark collection
    let bookmark = await bookmarked.findOne({ userId, eventModel: type });

    if (!bookmark) {
      // If no existing bookmark document, create a new one
      bookmark = new bookmarked({
        userId,
        event: [eventId],
        eventModel: type,
      });
    } else {
      // If the document exists, add the event to the `event` array
      if (!bookmark.event.includes(eventId)) {
        bookmark.event.push(eventId);
      }
    }

    // Save bookmark
    await bookmark.save();

    // Update user's `bookmarkedAttractions`
    user.bookmarkedAttractions.push(eventId);
    await user.save();

    return res.status(200).json({ message: "Event bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking event:", error);
    return res.status(500).json({
      message: "Error bookmarking event",
      error: error.message,
    });
  }
};

const ViewBookmarkedAttractions = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const user = await userModel
      .findById(userId)
      .populate("bookmarkedAttractions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ bookmarkedAttractions: user.bookmarkedAttractions });
  } catch (error) {
    console.error("Error retrieving bookmarked attractions:", error);
    return res.status(500).json({
      message: "Error retrieving bookmarked attractions",
      error: error.message,
    });
  }
};

const addItemToCart = async (req, res) => {
  const { touristID, productId, name, price, picture } = req.body;
  let { quantity, attributes } = req.body;
  if (!touristID || !productId || !name || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!quantity) {
    quantity = 1;
  }
  if (!attributes) {
    attributes = {};
  }
  try {
    // Find the user's cart
    let cart = await Cart.findOne({ touristID });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ touristID, items: [] });
    }

    // Check if the product with the same attributes is already in the cart
    const existingItem = cart.items.find((item) => {
      item.productId.toString() === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes);
    });

    if (existingItem) {
      // Increment the quantity if the same product with the same attributes exists
      existingItem.quantity += quantity;
    } else {
      // Add a new item with attributes
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        attributes,
        picture,
      });
    }

    // Save the updated cart
    await cart.save();
    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error adding item to cart" });
  }
};

const addWishlistItemToCart = async (req, res) => {
  const { touristID, productId, quantity } = req.body;
  try {
    // Validate input
    if (!touristID || !productId) {
      return res
        .status(400)
        .json({ message: "Tourist ID and Product ID are required." });
    }
    if (!quantity) {
      quantity = 1;
    }
    let cart = await Cart.findOne({ touristID });
    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ touristID, items: [] });
    }

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: touristID });
    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "Wishlist not found for the user." });
    }

    // Check if the product exists in the wishlist
    if (!wishlist.products.includes(productId)) {
      return res
        .status(404)
        .json({ message: "Product not found in wishlist." });
    }
    // Fetch product details (Assume `Product` is your product model)
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product details not found." });
    }

    // Default quantity to 1 if not provided
    const productQuantity = quantity || 1;

    const existingItem = cart.items.find((item) => {
      item.productId.toString() === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes);
    });

    if (existingItem) {
      // Increment the quantity if the same product with the same attributes exists
      existingItem.quantity += productQuantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        picture: product.picture,
        quantity: productQuantity,
        attributes: {}, // Add attributes if applicable
      });
    }
    await cart.save();
    res.status(200).json({
      message: "Product added to cart from wishlist successfully.",
      cart: cart.items, // Optionally return the updated cart
    });
  } catch (error) {
    console.error("Error adding wishlist item to cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const showCart = async (req, res) => {
  const { touristID } = req.params;
  try {
    // Find the user's cart
    let cart = await Cart.findOne({ touristID });
    if (!cart) {
      // If no cart exists, return an empty cart
      return res.status(200).json({ items: [] });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(400).json({ message: "Error fetching cart" });
  }
};

const getReviews = async (req, res) => {
  const { reviewIds } = req.body; // Assuming you're sending the array in the request body
  try {
    // Ensure reviewIds is an array
    if (!Array.isArray(reviewIds)) {
      return res.status(400).json({ message: "reviewIds must be an array" });
    }

    // Find all reviews for the given array of product IDs
    const reviews = await ReviewModel.find({ _id: { $in: reviewIds } });

    return res.status(200).json({ reviews });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Error fetching reviews", error: err.message });
  }
};

const payWithWallet = async (req, res) => {
  const { touristID, amount } = req.body;
  try {
    // Find the user's wallet
    let tourist = await userModel.findById(touristID);
    if (!tourist) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if the user has enough balance
    if (tourist.Wallet < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    // Deduct the amount from the user's wallet
    tourist.Wallet -= amount;
    await tourist.save();
    return res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error processing payment" });
  }
};

////////////////////////////Nadeem Sprint 3///////////////////////////

const applyPromoCode = async (req, res) => {
  const { touristID } = req.params;
  const { promoCode, purchaseAmount } = req.body;

  try {
    // Find the promo code
    const code = await PromoCode.findOne({
      code: promoCode,
      assignedTo: touristID,
      isUsed: false,
    });

    if (!code) {
      return res
        .status(404)
        .json({ message: "Promo code not found or already used." });
    }

    // Check if the promo code is expired
    const currentDate = new Date();
    if (code.expiryDate < currentDate) {
      return res.status(400).json({ message: "Promo code has expired." });
    }

    // Apply the promo code (e.g., 10% discount)
    const discount = 0.1; // Example discount rate
    const discountAmount = purchaseAmount * discount;
    const finalAmount = purchaseAmount - discountAmount;

    // Mark the promo code as used
    code.isUsed = true;
    await code.save();

    res.status(200).json({
      message: "Promo code applied successfully",
      originalAmount: purchaseAmount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewPastActivitiesAndItineraries = async (req, res) => {
  const touristId = req.params.touristId; // Get the touristId from params
  const currentDate = new Date();

  try {
    // Fetch past activities
    const pastActivities = await bookingSchema
      .find({
        userId: touristId,
        itemModel: "Attraction",
        bookedDate: { $lt: currentDate },
      })
      .populate("itemId");

    // Fetch past itineraries
    const pastItineraries = await bookingSchema
      .find({
        userId: touristId,
        itemModel: "Itinerary",
        bookedDate: { $lt: currentDate },
      })
      .populate("itemId");

    // Combine results
    const history = {
      activities: pastActivities,
      itineraries: pastItineraries,
    };

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching past activities and itineraries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDeliveryAddresses = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Check if the tourist exists
    const tourist = await userModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Fetch all addresses associated with the tourist
    const addresses = await Address.find({ userId: touristId });

    // Return the addresses
    res.status(200).json({
      message: "Addresses retrieved successfully",
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params; // Get orderId from the route parameter

  if (!orderId) {
    return res
      .status(400)
      .json({ message: "Missing required parameter: orderId" });
  }

  try {
    // Find the order by orderId
    const order = await ordermodel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order status is not already cancelled (if needed)
    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // Delete the order
    await order.remove();

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error cancelling the order", error: error.message });
  }
};

const makeOrder = async (req, res) => {
  const { userId, products, total, address, isPaid } = req.body;
  try {
    const order = new ordermodel({
      userId,
      products,
      total,
      address,
      isPaid,
    });
    await order.save();
    return res
      .status(200)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error creating the order", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  const { touristId, productId } = req.body;

  try {
    // Validate input
    if (!touristId || !productId) {
      return res
        .status(400)
        .json({ message: "Tourist ID and Product ID are required." });
    }

    // Check if the wishlist for the tourist exists
    let wishlist = await Wishlist.findOne({ userId: touristId });

    if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      wishlist = new Wishlist({ userId: touristId, products: [] });
    }

    // Check if the product already exists in the wishlist
    if (wishlist.products.includes(productId)) {
      return res
        .status(200)
        .json({ message: "Product is already in the wishlist." });
    }

    // Add the product ID to the wishlist
    wishlist.products.push(productId);

    // Save the updated wishlist
    await wishlist.save();

    res.status(200).json({
      message: "Product added to wishlist successfully.",
      wishlist: wishlist.products, // Optionally return the updated wishlist
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const viewMyWishlist = async (req, res) => {
  const { touristId } = req.params; // Assuming the tourist ID is passed as a URL parameter

  try {
    // Find the wishlist for the given tourist ID and populate product details for all items in the array
    const wishlist = await Wishlist.findOne({ userId: touristId }).populate({
      path: "products", // Path to the products field in the Wishlist model
      model: "Product", // Explicitly specify the model name
    });

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(201).json({
        message: "No products found in the wishlist for this tourist.",
      });
    }

    res.status(200).json({
      message: "Wishlist retrieved successfully.",
      wishlist: wishlist.products, // Return all the populated product details
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { touristId, productId } = req.body; // Get touristId and productId from the request body

  try {
    // Validate input
    if (!touristId || !productId) {
      return res
        .status(400)
        .json({ message: "Tourist ID and Product ID are required." });
    }

    // Find the wishlist for the given tourist ID
    const wishlist = await Wishlist.findOne({ userId: touristId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "Wishlist not found for this tourist." });
    }

    // Check if the product exists in the wishlist
    const productIndex = wishlist.products.indexOf(productId);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the wishlist." });
    }

    // Remove the product from the wishlist
    wishlist.products.splice(productIndex, 1);

    // Save the updated wishlist
    await wishlist.save();

    res.status(200).json({
      message: "Product removed from wishlist successfully.",
      wishlist: wishlist.products, // Return the updated wishlist
    });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const isInWishList = async (req, res) => {
  const { touristId, productId } = req.body; // Get touristId and productId from the
  try {
    const wishlist = await Wishlist.findOne({ userId: touristId });
    if (wishlist) {
      const productIndex = wishlist.products.indexOf(productId);
      if (productIndex !== -1) {
        return res.status(200).json({ message: "Product is in wishlist" });
      }
    }
    return res.status(201).json({ message: "Product not found in wishlist" });
  } catch (error) {
    console.error("Error checking if product is in wishlist:", error);
    res
      .status(401)
      .json({ message: "Internal server error", error: error.message });
  }
};

const viewOrderDetails = async (req, res) => {
  const { OrderId } = req.params;

  try {
    if (!OrderId) {
      return res.status(400).json({ error: "Order number is required." });
    }

    // Fetch the specific order by orderNumber and username
    const order = await ordermodel.findById({ OrderId });
    if (!order) {
      return res
        .status(404)
        .json({ error: "Order with number ${OrderId} not found." });
    }

    // Respond with the specific order details
    res.status(200).json({
      msg: "Order details retrieved successfully.",
      orderDetails: order,
    });
  } catch (error) {
    console.error("Error retrieving order details:", error);
    res.status(500).json({ error: "Failed to retrieve order details." });
  }
};

const requestToBeNotified = async (req, res) => {
  const { itineraryId, touristId } = req.body;

  if (!itineraryId || !touristId) {
    return res
      .status(400)
      .json({ message: "Missing required fields: itineraryId or touristId" });
  }

  try {
    // Find the itinerary by its ID and use the $addToSet operator to add touristId to the 'notifyMe' array
    const updatedItinerary = await itineraryModel.findByIdAndUpdate(
      itineraryId,
      { $addToSet: { notifyMe: touristId } }, // Add touristId to 'notifyMe' array only if it's not already present
      { new: true, upsert: true } // upsert: true ensures the array is created if it doesn't exist
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    return res.status(200).json({
      message: "Tourist added to 'notifyMe' list successfully",
      itinerary: updatedItinerary,
    });
  } catch (error) {
    console.error(error); // Log the error for better debugging
    return res.status(500).json({
      message: "Error adding tourist to 'notifyMe' list",
      error: error.message,
    });
  }
};

const checkOut = async (req, res) => {
  const { userId, products, total, address, isPaid } = req.body;
  if (!userId || !products || !total || !address) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required parameters: userId, products, total, or address",
    });
  }
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Products must be a non-empty array",
    });
  }

  try {
    // Create a new order
    const newOrder = new ordermodel({
      userId,
      products,
      total,
      address,
      isPaid: isPaid || false, // Default to false if not provided
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: "Error creating the order",
      error: error.message,
    });
  }
};

const ViewOrders = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    // Fetch all orders for the user
    const orders = await order
      .find({ userId })
      .populate("products")
      .populate("address");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Categorize orders into current and past
    const currentOrders = orders.filter((order) =>
      ["pending", "shipped"].includes(order.status)
    );
    const pastOrders = orders.filter((order) =>
      ["delivered", "cancelled"].includes(order.status)
    );

    return res.status(200).json({
      currentOrders,
      pastOrders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
  }
};
async function sendUpcomingEventNotifications() {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 100); // Define "upcoming" as within the next 7 days

  try {
    // Find bookings with upcoming booked dates
    const upcomingBookings = await Booking.find({
      bookedDate: {
        $gte: today, // On or after today
        $lte: nextWeek, // On or before 7 days from today
      },
    })
      .populate("userId")
      .populate("itemId"); // Populate user details for notification

    for (const booking of upcomingBookings) {
      const { userId, bookedDate, itemId, itemModel } = booking;
      const notificationMessage = `Reminder: You have an upcoming booking for an ${
        itemId.Name
      } on ${bookedDate.toLocaleDateString()}.`;

      // Check if the notification for this aboutID already exists
      const existingNotification = await Notification.findOne({
        userID: userId._id,
        userModel: "Tourist",
        "notifications.aboutID": itemId,
      });

      if (existingNotification) {
        continue; // Skip this booking
      }

      // Add the notification to the Notification model
      const newNotification = {
        aboutID: itemId,
        aboutModel: itemModel,
        message: notificationMessage,
      };

      await Notification.findOneAndUpdate(
        { userID: userId._id, userModel: "Tourist" }, // Match the user
        {
          $push: { notifications: newNotification }, // Add to notifications array
        },
        { upsert: true, new: true } // Create a new document if none exists
      );
      var data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: "template_ahs6ptu",
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: userId.Email,
          user_name: userId.FullName,
          event_name: itemId.Name,
          event_date: bookedDate.toLocaleDateString(),
          event_details_link: "http://localhost:3000/loginPage",
          logo_url:
            "https://drive.google.com/uc?id=1XRUvHmFG98cHMtw8ZlSf61uAwtKlkQJo",
        },
      };
      const reply = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!reply.ok) {
        const errorData = await reply.text();
        console.error("Email sending failed:", errorData);
      } else {
        console.log("Email sent successfully!");
      }

      // Simulate sending the notification

      // Replace with actual notification logic (email, push notification, etc.)
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}
const previewPromoCode = async (req, res) => {
  const { touristId } = req.params;
  const { promoCode, purchaseAmount } = req.body;

  try {
    // Find the promo code
    const code = await PromoCode.findOne({
      code: promoCode,
      assignedTo: touristId,
      isUsed: false,
    });

    if (!code) {
      return res
        .status(404)
        .json({ message: "Promo code not found or already used." });
    }

    // Check if the promo code is expired
    const currentDate = new Date();
    if (code.expiryDate < currentDate) {
      return res.status(400).json({ message: "Promo code has expired." });
    }

    // Calculate the discount (e.g., 10% discount)
    const discount = 0.1; // Example discount rate
    const discountAmount = purchaseAmount * discount;
    const finalAmount = purchaseAmount - discountAmount;

    // Return the preview information without marking the code as used
    res.status(200).json({
      message: "Promo code preview successful",
      originalAmount: purchaseAmount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Error previewing promo code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyRating = async (req, res) => {
  const { touristId } = req.params;
  const { itineraryId } = req.params;
  try {
    const rating = await RatingModel.findOne({
      userId: touristId,
      itemId: itineraryId,
    });
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }
    res.status(200).json(rating);
  } catch (error) {
    console.error("Error getting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getItineraryReviews = async (req, res) => {
  const { itineraryId } = req.params;
  try {
    const reviews = await ReviewModel.find({ itemId: itineraryId });
    if (!reviews) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGuideReviews = async (req, res) => {
  const { guideId } = req.params;
  try {
    const reviews = await CommentModel.find({ aboutId: guideId });
    if (!reviews) {
      return res.status(201).json({ message: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewMyNotifications = async (req, res) => {
  const { touristId } = req.params; // Assuming the tourist ID is passed as a URL parameter

  try {
    // Find the notifications for the given tourist ID
    const notifications = await Notification.findOne({ userID: touristId });

    if (!notifications || notifications.notifications.length === 0) {
      return res.status(201).json({
        message: "No notifications found for this tourist.",
      });
    }

    res.status(200).json({
      message: "Notifications retrieved successfully.",
      notifications: notifications.notifications, // Return all the notifications array for the tourist
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const removeNotification = async (req, res) => {
  const { touristId, notificationId } = req.params; // Get touristId and notificationId from the request body
  try {
    // Validate input
    if (!touristId || !notificationId) {
      return res.status(400).json({ message: "Tourist ID and Notification ID are required." });
    }

    // Validate that the touristId and notificationId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(touristId) || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid Tourist ID or Notification ID." });
    }

    // Find the notification document for the given tourist ID
    const notificationDoc = await Notification.findOne({ userID: touristId });

    if (!notificationDoc) {
      return res.status(404).json({ message: "No notifications found for this tourist." });
    }

    // Find the index of the notification to remove by notificationId
    const notificationIndex = notificationDoc.notifications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found in the list." });
    }

    // Remove the notification from the array
    notificationDoc.notifications.splice(notificationIndex, 1);

    // Save the updated notification document
    await notificationDoc.save();

    res.status(200).json({
      message: "Notification removed successfully.",
      notifications: notificationDoc.notifications, // Return the updated notifications array
    });
  } catch (error) {
    console.error("Error removing notification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const markNotificationAsRead= async (req, res) => {
  const { userID, notificationId } = req.params;

  try {
    // Validate input
    if (!userID || !notificationId) {
      return res.status(400).json({ message: "UserID and NotificationID are required." });
    }

    // Step 1: Find the user notification document by userID
    const notificationDocument = await Notification.findOne({ "userID": userID });

    if (!notificationDocument) {
      return res.status(404).json({ message: "No notifications found for this user." });
    }

    // Step 2: Find the specific notification by notificationId
    const notification = notificationDocument.notifications.find(
      (notif) => notif._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Step 3: Check if isRead is not defined, set it to false if undefined
    if (notification.isRead === undefined) {
      notification.isRead = false;
    }

    // Step 4: Mark the notification as read (set isRead to true)
    notification.isRead = true;

    // Step 5: Save the updated notifications array in the user document
    await notificationDocument.save();

    // Step 6: Respond with a success message
    res.status(200).json({
      message: "Notification marked as read successfully.",
      notification: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getBookingDetails = async (req, res) => {
  const { bookingID } = req.params; // Booking ID passed in the URL

  try {
    // Step 1: Find the booking by its ID
    console.log("Booking ID:", bookingID); // Debugging line

    const booking = await Booking.findById(bookingID).populate("itemId");
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    
    console.log("Item Model:", booking); // Debugging line

    
    res.status(200).json({
      message: "Booking details retrieved successfully.",
      booking,
    });

  } catch (err) {
    console.error("Error retrieving booking details:", err);
    res.status(500).json({ error: "Failed to retrieve booking details." });
  }
};


const getTouristLevel = async (req, res) => {
  try {
      const { touristId } = req.params;  // Get touristId from the URL parameter
      if (!touristId) {
          return res.status(400).json({ message: "touristId is required" });
      }
      
      // Fetch the tourist data from the database using the touristId
      const tourist = await userModel.findById(touristId);  // Corrected variable name to match touristId
      if (!tourist) {
          return res.status(404).json({ message: "Tourist not found" });
      }

      // Send the response with the level (Badge)
      res.json({ Badge: tourist.Badge });
  } catch (error) {
      console.error('Error fetching tourist level:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  ViewOrders,
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
  bookHotel,
  redeemPoints,
  reviewProduct,
  cancelBooking,
  bookItinerary,
  rateEvent,
  updateEventRatings,
  currencyConverter,
  viewAllTransportations,
  getMyBookings,
  getProductReviews,
  bookActivity,
  BookFlight,
  addDeliveryAddress,
  assignBirthdayPromo,
  addItemToCart,
  showCart,
  getReviews,
  payWithWallet,
  applyPromoCode,
  viewPastActivitiesAndItineraries,
  getDeliveryAddresses,
  addToWishlist,
  removeFromCart,
  viewMyWishlist,
  cancelOrder,
  removeFromWishlist,
  Bookmarkevent,
  addWishlistItemToCart,
  viewOrderDetails,
  requestToBeNotified,
  PayByCard,
  ViewBookmarkedAttractions,
  checkOut,
  sendUpcomingEventNotifications,
  previewPromoCode,
  isInWishList,
  makeOrder,
  removeProduct,
  getMyRating,
  getItineraryReviews,
  getGuideReviews,
  getPreferences,
  addPreference,
  removePreference,
  viewMyNotifications,
  removeNotification,
  markNotificationAsRead,
  updateActivityRatings,
  getBookingDetails,
  getTouristLevel,
};
