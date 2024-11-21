const tourGuideModel = require("../Models/tourGuide.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const Itinerary = require("../Models/itinerary.js");
const userModel = require("../Models/users.js"); // Adjust the path based on your folder structure
const Attraction = require("../Models/attractions.js");
const PdfDetails = require("../Models/pdfDetails.js");
const TourGuide = require("../Models/tourGuide.js");
const RatingsModel = require("../Models/rating.js");
const bookingSchema = require("../Models/bookings.js");
const jwt = require("jsonwebtoken");

// Creating a tourGuide

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: maxAge,
  });
};
const createTourGuide = async (req, res) => {
  try {
    const { Username, Password, Email, FullName } = req.body;

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
      FullName,
    });

    const userID = tourGuide._id;
    await userModel.create({ Username: Username, userID, Type: "TourGuide", Email });
    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
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

    if (itinerary.Bookings.length > 0) {
      itinerary.isActive = false; // Deactivate the itinerary
      await itinerary.save();

      return res.status(200).json({
        message:
          "Itinerary deactivated successfully. Existing bookings remain active, but the itinerary is hidden for new bookings.",
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

const requestTourGuideAccountDeletion = async (req, res) => {
  const { guideID } = req.params;

  try {
    console.log("Received request for tour guide ID:", guideID);

    // Check if the tour guide exists and isn't already marked as deleted
    const tourGuide = await tourGuideModel.findOne({ _id: guideID });
    if (!tourGuide) {
      return res
        .status(400)
        .json({ message: "Tour Guide not found or already deleted" });
    }
    // Set current date for comparison
    const currentDate = new Date();

    // Find all itineraries created by this tour guide
    const itineraries = await Itinerary.find({ Creator: guideID });

    // Gather all booking IDs from the itineraries
    const allBookingIds = itineraries.flatMap(
      (itinerary) => itinerary.Bookings
    );

    // Query the booking schema for any future bookings
    const futureBookings = await bookingSchema.find({
      _id: { $in: allBookingIds },
      bookedDate: { $gte: currentDate },
    });

    // Prevent deletion if there are any future bookings
    if (futureBookings.length > 0) {
      return res.status(400).json({
        message: "Account cannot be deleted. Upcoming bookings exist.",
      });
    }

    // Delete the tour guide's account and associated data

    await Itinerary.deleteMany({ Creator: guideID });
    await userModel.findOneAndDelete({ userID: guideID });
    await tourGuideModel.findByIdAndDelete(guideID);

    // // Hide associated itineraries and activities
    // await Promise.all([
    //   Itinerary.updateMany({ Creator: guideID }, { isVisible: false }),
    //   Attraction.updateMany({ Creator: guideID }, { isVisible: false }),
    // ]);

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

const uploadPicturetourguide = async (req, res) => {
  try {
    const { guideID } = req.params; // Extract the guide ID from the URL params

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Update the tour guide's image using findByIdAndUpdate
    const updatedTourGuide = await tourGuideModel.findByIdAndUpdate(
      guideID,
      {
        picture: {
          data: req.file.buffer, // Store the uploaded image as a buffer
          contentType: req.file.mimetype, // Set the content type (e.g., image/png)
        },
      },
      { new: true, runValidators: true } // Options: return the updated document and run validation
    );

    // Check if the tour guide was found and updated
    if (!updatedTourGuide) {
      return res.status(404).json({ error: "Tour guide not found." });
    }

    res.status(200).json({
      message: "Tour guide image uploaded successfully!",
      tourGuide: updatedTourGuide, // Return the updated tour guide object
    });
  } catch (err) {
    console.error("Error uploading tour guide image:", err);
    res.status(500).json({ error: "Failed to upload tour guide image." });
  }
};
const gettourGuideImage = async (req, res) => {
  try {
    const { guideID } = req.params; // Get the product ID from the request parameters

    // Find the product by ID
    const GUIDE = await tourGuideModel.findById(guideID);

    // Check if product exists
    if (!GUIDE || !GUIDE.picture || !GUIDE.picture.data) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Set the content type for the image
    res.set("Content-Type", GUIDE.picture.contentType);

    // Send the image data
    res.send(GUIDE.picture.data);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

const viewItineraryReport = async (req, res) => {
  try {
    const { guideID } = req.params; // Assuming guideID is passed as a parameter

    // Find all itineraries created by this tour guide
    const itineraries = await Itinerary.find({ Creator: guideID });

    // Map through itineraries to calculate the number of tourists for each
    const report = await Promise.all(itineraries.map(async (itinerary) => {
      const bookings = await bookingSchema.find({ itemId: itinerary._id, itemModel: "Itinerary" });
      return {
        itineraryName: itinerary.Name,
        totalTourists: bookings.length,
      };
    }));

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating itinerary usage report:", error);
    res.status(500).json({ message: "Internal server error" });
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
  deactivateItinerary,
  requestTourGuideAccountDeletion,
  uploadPicturetourguide,
  gettourGuideImage,
  viewItineraryReport,
};
