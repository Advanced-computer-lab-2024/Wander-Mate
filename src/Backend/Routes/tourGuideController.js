const tourGuideModel = require("../Models/tourGuide.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const Itinerary = require("../Models/itinerary.js");
const userModel = require("../Models/users.js"); // Adjust the path based on your folder structure
const Attraction = require("../Models/attractions.js");
const PdfDetails = require("../Models/pdfDetails.js");
const TourGuide = require("../Models/tourGuide.js");
const RatingsModel = require("../Models/rating.js");
// Creating a tourGuide
const createTourGuide = async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;

    // Check if Username, Password, and Email are provided
    if (!Username || !Password || !Email) {
      return res
        .status(400)
        .json({ message: "Username, Password, and Email are all required" });
    }

    // Check if Username or Email already exists
    const existingUser1 = await userModel.findOne({ Username: Username });
    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this username already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create the tourGuide using the hashed password
    const tourGuide = await tourGuideModel.create({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
    });

    const userID = tourGuide._id;
    await userModel.create({ Username: Username, userID });

    res.status(200).json(tourGuide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the tourGuide" });
  }
};

const createItinerary = async (req, res) => {
  try {
    const Bookings = [];
    const {
      Creator,
      Name,
      Activities,
      LocationsToVisit,
      TimeLine,
      Language,
      Price,
      AvailableDates,
      PickUpLocation,
      DropOffLocation,
    } = req.body;
    const Ratings = 0.0;
    // Validate required fields
    if (
      !Activities ||
      !LocationsToVisit ||
      !TimeLine ||
      !Language ||
      !Price ||
      !AvailableDates ||
      !PickUpLocation ||
      !DropOffLocation ||
      !Name
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItinerary = new Itinerary({
      Bookings,
      Name,
      Creator,
      Activities,
      LocationsToVisit,
      TimeLine,
      Language,
      Price,
      AvailableDates,
      PickUpLocation,
      DropOffLocation,
      Ratings,
    });

    // Save to the database
    await newItinerary.save();

    // Send a response with the newly created itinerary
    return res.status(200).json(newItinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error.message); // Log the actual error message
    return res
      .status(500)
      .json({ message: "Error creating itinerary", error: error.message });
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const { id, Creator } = req.body; // Destructure id and Creator from the request body
    let itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    if (itinerary.Creator !== Creator) {
      return res.status(403).json({ message: "You are not the creator." });
    }
    if (itinerary.Bookings && itinerary.Bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete itinerary with existing bookings." });
    }
    await Itinerary.findByIdAndDelete(id);
    res.status(200).json({ message: "Itinerary deleted successfully." });
  } catch (error) {
    console.error("Error deleting itinerary:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting itinerary", error: error.message });
  }
};

const updateItinerary = async (req, res) => {
  const {
    Creator,
    Name,
    Activities,
    LocationsToVisit,
    TimeLine,
    Language,
    Price,
    AvailableDates,
    PickUpLocation,
    DropOffLocation,
  } = req.body;
  const { id } = req.params;
  try {
    let itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(400).json({ message: "Itinerary not found." });
    }
    // if (itinerary.Creator !== Creator) {
    //   return res.status(400).json({ message: "You are not the creator." });
    // }
    itinerary = await Itinerary.findByIdAndUpdate(
      id,
      {
        Activities,
        Name,
        LocationsToVisit,
        TimeLine,
        Language,
        Price,
        AvailableDates,
        PickUpLocation,
        DropOffLocation,
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json({ message: "Itinerary updated successfully.", itinerary });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "ERROR" });
  }
};

const readItinerary = async (req, res) => {
  const { id } = req.params; // Correct extraction of id from req.params
  try {
    const itinerary = await Itinerary.findById(id)
      .populate("Activities")
      .populate("LocationsToVisit");
    if (!itinerary) {
      return res.status(404).json({ error: "itinerary not found" });
    }
    res.status(200).json(itinerary);
  } catch {
    res.status(400).json({ error: "Error reading itinerary" });
  }
};

const createProfileInformation = async (req, res) => {
  try {
    const { Username } = req.body;
    const { MobileNumber, YearsOfExperience, PreviousWork } = req.body;

    if (!MobileNumber || !YearsOfExperience) {
      return res.status(400).json({
        message: "Mobile number and years of experience are required",
      });
    }

    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
      { Username: Username },
      { $set: { MobileNumber, YearsOfExperience, PreviousWork } },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({
      message: "Profile information created",
      tourGuide: updatedTourGuide,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile information" });
  }
};

const readProfileInformation = async (req, res) => {
  try {
    const Username = req.params.Username; // Using `req.body` to get the Username, similar to `readSeller`

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const tourGuide = await tourGuideModel.findOne({ Username });

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    return res.status(200).json(tourGuide);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Can't read the profile", error: err.message });
  }
};

const updateProfileInformation = async (req, res) => {
  try {
    const { Username, MobileNumber, YearsOfExperience, PreviousWork } =
      req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
      { Username },
      { MobileNumber, YearsOfExperience, PreviousWork },
      { new: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.status(200).json({
      message: "Profile information updated",
      tourGuide: updatedTourGuide,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile information" });
  }
};
const viewAll1 = async (req, res) => {
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

const getTourguides = async (req, res) => {
  try {
    const Creator = await tourGuideModel.find().select("-Password");
    res.status(200).json({ Creator });
  } catch {
    res.status(400).json({ message: "Error to get Tourguides" });
  }
};

const uploadTourGuideDocuments = async (req, res) => {
  if (!req.files) {
    return res.status(400).send("Files are required.");
  }

  try {
    const ownerId = req.body.ownerId;
    const ownerModel = "TourGuide";
    const idPdf = new PdfDetails({
      Title: "ID",
      pdf: req.files.ID[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    const certPdf = new PdfDetails({
      Title: "Certificates",
      pdf: req.files.docs[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    await idPdf.save();
    await certPdf.save();

    return res.status(200).json({
      message: "Both ID and Certificates uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error to upload documents" });
  }
};

const updateGuideRatings = async (req, res) => {
  const { guideID } = req.params;
  try {
    const averageRating = await RatingsModel.aggregate([
      { $match: { itemId: new mongoose.Types.ObjectId(guideID) } },
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
      const updatedTourGuide = await TourGuide.findByIdAndUpdate(
        { _id: guideID },
        {
          averageRating: averageRating[0].averageRating.toFixed(2), // Format to 2 decimal places
          totalRatings: averageRating[0].totalRatings,
        },
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        tourGuide: updatedTourGuide, // Return the updated tour guide data
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

const changePasswordTourGuide = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Find the tour guide by id
    const tourGuide = await TourGuide.findById(id);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, tourGuide.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    tourGuide.Password = hashedNewPassword;
    await tourGuide.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const deactivateItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.body; // Get the itinerary ID from the request body

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    if (itinerary.bookings > 0) {
      itinerary.isActive = false; // Deactivate the itinerary
      await itinerary.save();
      
      return res.status(200).json({
        message: "Itinerary deactivated successfully. Existing bookings remain active, but the itinerary is hidden for new bookings.",
      });
    } else {
      return res.status(400).json({
        message: "Itinerary cannot be deactivated as there are no bookings.",
      });
    }
  } catch (error) {
    console.error("Error deactivating itinerary:", error);
    res.status(500).json({ message: "Unable to deactivate itinerary." });
  }
};



module.exports = {
  createTourGuide,
  createItinerary,
  createProfileInformation,
  readProfileInformation,
  updateProfileInformation,
  updateItinerary,
  deleteItinerary,
  viewAll1,
  readItinerary,
  getTourguides,
  uploadTourGuideDocuments,
  updateGuideRatings,
  changePasswordTourGuide,
  deactivateItinerary
};
