const advertiserModel = require("../Models/advertiser.js");
const attractionModel = require("../Models/attractions.js");
const userModel = require("../Models/users.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const Itinerary = require("../Models/itinerary.js");
const Attraction = require("../Models/attractions.js");
const TransportationModel = require("../Models/transportation.js");
const bookingSchema = require("../Models/bookings.js");
const PdfDetails = require("../Models/pdfDetails.js");
const jwt = require("jsonwebtoken");
const Notification = require("../Models/notifications.js");

const createActivity = async (req, res) => {
  const Bookings = [];
  const {
    Creator,
    Name,
    DateString,
    Time,
    Location,
    Price,
    Category,
    Tags,
    Discounts,
    IsAvailable,
  } = req.body;

  const Ratings = 0.0;

  if (!DateString) {
    return res.status(400).json({ error: "Date is required" });
  }

  const dateObject = new Date(DateString);
  if (!Name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!Time) {
    return res.status(400).json({ error: "Time is required" });
  }
  if (!Location || !Location.coordinates || Location.coordinates.length !== 2) {
    return res.status(400).json({ error: "Valid Location is required" });
  }
  if (!Price) {
    return res.status(400).json({ error: "Price is required" });
  }
  if (!Category) {
    return res.status(400).json({ error: "Category is required" });
  }
  const model = "Advertiser";

  try {
    const activity = await attractionModel.create({
      Creator,
      CreatorModel: model,
      Name,
      Date: dateObject,
      Time,
      Location,
      Price,
      Category,
      Tags,
      Discounts,
      IsAvailable,
      Type: new mongoose.Types.ObjectId("67025cb6bb14549b7e29f376"),
      Bookings,
      Ratings,
    });
    res.status(200).json(activity._id);
  } catch (error) {
    console.error("Error creating activity:", error); // Log the error
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
    const activities = await attractionModel.find(); // Fetch all activities
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: "Error reading activities" });
  }
};

const updateActivity = async (req, res) => {
  const {
    
    Name,
    id,
    DateString,
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
      console.log("hii");
      return res.status(400).json({ message: "Activity not found." });
    }
    let dateObject;
    if (DateString) {
      dateObject = new Date(DateString);
    } else {
      dateObject = activity.Date;
    }
    console.log(Location);

    
    activity = await attractionModel.findByIdAndUpdate(
      id,
      {
        Date: dateObject,
        Name: Name,
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
  } catch(error) {
    console.log(error);
    res.status(400).json({ error: "Error updating activity" });
  }
};

const deleteActivity = async (req, res) => {
  const { id, Creator } = req.body;
  try {
    const activity = await attractionModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    if (activity.Creator !== Creator) {
      return res.status(400).json({ message: "You are not the creator." });
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

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: maxAge,
  });
};

const createAdvertiser = async (req, res) => {
  try {
    const { Username, Password, Email, FullName } = req.body;

    // Check if Username, Password, and Email are provided
    if (!Username || !Password || !Email) {
      return res
        .status(400)
        .json({ message: "Username, Password, and Email are all required" });
    }
    const existingUser1 = await userModel.findOne({ Username: Username });
    if (existingUser1) {
      return res
        .status(400)
        .json({ message: "User with this Username already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create the advertiser using the hashed password
    const advertiser = await advertiserModel.create({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
      FullName,
    });

    const userID = advertiser._id;
    //add to usermodel
    await userModel.create({
      Username: Username,
      userID,
      Type: "Advertiser",
      Email,
    });
    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json(advertiser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the advertiser" });
  }
};

const createAdvertiserInfo = async (req, res) => {
  try {
    const { Username, Email, Website, Hotline, CompanyProfile } = req.body;

    const advertiser = await advertiserModel.findOneAndUpdate(
      { Username: Username },
      { Email, Website, Hotline, CompanyProfile },
      { new: true }
    );

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser guide not found" });
    }

    // advertiser.Email = Email;
    // advertiser.Website = Website;
    // advertiser.Hotline = Hotline;
    // advertiser.CompanyProfile = CompanyProfile;

    await advertiser.save();
    res
      .status(200)
      .json({ message: "Profile information created", advertiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile information" });
  }
};

const readAdvertiserInfo = async (req, res) => {
  const { Username } = req.body;
  try {
    const Advertiser = await advertiserModel.find({ Username: Username });
    if (!Advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(Advertiser);
  } catch {
    res.status(400).json({ error: "Error reading Advertiser" });
  }
};

const updateAdvertiserInfo = async (req, res) => {
  try {
    const { Username, Website, Hotline, CompanyProfile } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedAdvertiser = await advertiserModel.findOneAndUpdate(
      { Username },
      { Website, Hotline, CompanyProfile },
      { new: true }
    );

    if (!updatedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    res.status(200).json({
      message: "Profile information updated",
      advertiser: updatedAdvertiser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile information" });
  }
};
const viewAll2 = async (req, res) => {
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
const getAdvertisers = async (req, res) => {
  try {
    const Creator = await advertiserModel.find().select("-Password");
    res.status(200).json({ Creator });
  } catch {
    res.status(400).json({ message: "Error to get advertisers" });
  }
};

const uploadAdvertiserDocuments = async (req, res) => {
  if (!req.files) {
    return res.status(400).send("Files are required.");
  }

  try {
    const ownerId = req.body.ownerId;
    const ownerModel = "Advertiser";
    const idPdf = new PdfDetails({
      Title: "ID",
      pdf: req.files.ID[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    const certPdf = new PdfDetails({
      Title: "Taxation Registery",
      pdf: req.files.docs[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    await idPdf.save();
    await certPdf.save();

    return res.status(200).json({
      message: "Docs are uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error to upload documents" });
  }
};

const changePasswordAdvertiser = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Find the tour guide by id
    const advertiser = await advertiserModel.findById(id);
    if (!advertiser) {
      return res.status(404).json({ message: "advertiser not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, advertiser.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    advertiser.Password = hashedNewPassword;
    await advertiser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addTransportation = async (req, res) => {
  try {
    // Destructure transportation fields from the request body
    const {
      advertiserID,
      availability,
      destination,
      startPlace,
      price,
      vehicleType,
      date,
      discount,
    } = req.body;

    // Basic validation
    if (!advertiserID) {
      return res.status(400).json({ error: "Advertiser ID is required." });
    }

    // Check if the advertiser exists
    const advertiser = await advertiserModel.findById(advertiserID);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    // Ensure availability is a boolean
    const isAvailable = availability === "true"; // Convert 'true' to true, 'false' to false

    // Create a new transportation instance
    const transportation = await TransportationModel.create({
      advertiserId: advertiserID, // Link transportation to the advertiser
      availability,
      destination,
      startPlace,
      price,
      vehicleType,
      date,
      discount,
    });

    // Respond with success and the transportation data
    res.status(200).json({
      message: "Transportation added successfully!",
      transportation,
    });
  } catch (err) {
    console.error("Error adding transportation:", err);
    res.status(400).json({ error: "Failed to add transportation." });
  }
};

const requestAdvertiserAccountDeletion = async (req, res) => {
  const { advertiserID } = req.params;

  try {
    console.log("Received request for advertiser ID:", advertiserID);

    // Check if the advertiser exists and isn't already marked as deleted
    const advertiser = await advertiserModel.findById(advertiserID);
    if (!advertiser || advertiser.isDeleted) {
      return res
        .status(404)
        .json({ message: "Advertiser not found or already deleted" });
    }

    // Set current date for comparison
    const currentDate = new Date();

    // Find all attractions created by this advertiser
    const attractions = await Attraction.find({ Creator: advertiserID });

    // Gather all booking IDs from the attractions
    const allBookingIds = attractions.flatMap(
      (attraction) => attraction.Bookings
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

    await advertiserModel.findByIdAndDelete(advertiserID);
    await userModel.findOneAndDelete({ userID: advertiserID });
    await attractionModel.deleteMany({ Creator: advertiserID });

    // Hide associated attractions
    //await Attraction.updateMany({ Creator: advertiserID }, { isVisible: false });

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

const uploadPictureadvertiser = async (req, res) => {
  try {
    const { advertiserID } = req.params; // Extract the advertiser ID from the URL params

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Update the advertiser's image using findByIdAndUpdate
    const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(
      advertiserID,
      {
        picture: {
          data: req.file.buffer, // Store the uploaded image as a buffer
          contentType: req.file.mimetype, // Set the content type (e.g., image/png)
        },
      },
      { new: true, runValidators: true } // Options: return the updated document and run validation
    );

    // Check if the advertiser was found and updated
    if (!updatedAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    res.status(200).json({
      message: "Advertiser image uploaded successfully!",
      advertiser: updatedAdvertiser, // Return the updated advertiser object
    });
  } catch (err) {
    console.error("Error uploading advertiser image:", err);
    res.status(500).json({ error: "Failed to upload advertiser image." });
  }
};
const getadvertiserImage = async (req, res) => {
  try {
    const { advertiserID } = req.params; // Get the guide ID from the request parameters

    // Find the guide by ID
    const ADvertiser = await advertiserModel.findById(advertiserID);

    // Check if guide exists
    if (
      !ADvertiser ||
      !ADvertiser.picture ||
      !ADvertiser.picture.data ||
      !ADvertiser.picture.data.buffer
    ) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Extract the buffer from the Binary object
    const imageBuffer = ADvertiser.picture.data.buffer;

    // Set the content type for the image
    res.set("Content-Type", ADvertiser.picture.contentType);

    // Send the image data as a buffer
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

const viewActivityReport = async (req, res) => {
  try {
    const { advertiserID } = req.params; // Assuming advertiserID is passed as a parameter

    // Find all activities created by this advertiser
    const activities = await attractionModel.find({ Creator: advertiserID });

    // Map through activities to calculate the number of tourists for each
    const report = await Promise.all(
      activities.map(async (activity) => {
        const bookings = await bookingSchema.find({
          itemId: activity._id,
          itemModel: "Attraction",
        });
        return {
          activityName: activity.Name,
          totalTourists: bookings.length,
        };
      })
    );

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating activity usage report:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/////////////////////////////////////MARIO S3///////////////////////
const notifyAdvertiser = async (advertiserId, eventId) => {
  try {
    const notificationMessage =
      "Your event has been flagged as inappropriate by the admin.";

    // Add the notification
    const notification = await Notification.findOneAndUpdate(
      { userID: advertiserId, userModel: "Advertiser" },
      {
        $push: {
          notifications: {
            aboutID: eventId,
            aboutModel: "Attraction",
            message: notificationMessage,
          },
        },
      },
      { upsert: true, new: true }
    );

    console.log("Notification added for advertiser:", notification);
  } catch (error) {
    console.error("Error adding notification for advertiser:", error);
  }
};

const getAdvertiserById = async (req, res) => {
  const { advertiserId } = req.params; // Extract sellerId from request parameters
  try {
    const advertiser = await advertiserModel
      .findById(advertiserId)
      .select("-Password"); // Fetch advertiser info excluding Password
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    res.status(200).json({ advertiser });
  } catch (error) {
    res.status(400).json({
      message: "Error fetching advertiser information",
      error: error.message,
    });
  }
};


const getAttractionSalesReport = async (req, res) => {
  const { advertiserId } = req.params; // Assuming the advertiser's ID is passed in the URL
  try {
    // Step 1: Fetch all attractions created by the advertiser
    const attractions = await Attraction.find({ Creator: advertiserId }).select(
      "_id Name Price"
    );
    const attractionIds = attractions.map((attraction) => attraction._id);

    if (attractions.length === 0) {
      return res
        .status(404)
        .json({ message: "No attractions found for this advertiser." });
    }

    // Step 2: Aggregate bookings for the advertiser's attractions
    const salesData = await bookingSchema.aggregate([
      {
        $match: {
          itemId: { $in: attractionIds }, // Only include bookings for the advertiser's attractions
          itemModel: "Attraction", // Ensure we're looking at attractions
        },
      },
      {
        $group: {
          _id: {
            attractionId: "$itemId",
            bookedDate: "$bookedDate", // Group by attraction and booking date
          },
          totalBookings: { $sum: 1 }, // Count bookings
          totalRevenue: { $sum: "$price" }, // Sum up revenue from prices
        },
      },
      {
        $lookup: {
          from: "attractions", // Join with attractions to get the price
          localField: "_id.attractionId",
          foreignField: "_id",
          as: "attractionDetails",
        },
      },
      {
        $unwind: "$attractionDetails", // Unwind to flatten attraction details
      },
      {
        $project: {
          _id: 0,
          attractionId: "$_id.attractionId",
          attractionName: "$attractionDetails.Name",
          bookedDate: "$_id.bookedDate",
          totalBookings: 1,
          totalRevenue: { $multiply: ["$totalBookings", "$attractionDetails.Price"] }, // Calculate revenue
        },
      },
    ]);

    if (salesData.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this advertiser's attractions." });
    }

    // Step 3: Send response
    res.status(200).json({
      message: "Sales report generated successfully.",
      salesReport: salesData,
    });
  } catch (error) {
    console.error("Error generating attraction sales report:", error);
    res
      .status(500)
      .json({ message: "Server error while generating sales report." });
  }
};

const viewMyNotificationsAd = async (req, res) => {
  const { advertiserID } = req.params; // Assuming the tourist ID is passed as a URL parameter

  try {
    // Find the notifications for the given tourist ID
    const notifications = await Notification.findOne({ userID: advertiserID });

    if (!notifications || notifications.notifications.length === 0) {
      return res.status(201).json({
        message: "No notifications found for this Tour Guide.",
      });
    }

    res.status(200).json({
      message: "Notifications retrieved successfully.",
      notifications: notifications.notifications, // Return all the notifications array for the tourist
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeNotificationAd = async (req, res) => {
  const { advertiserID, notificationId } = req.params; // Get touristId and notificationId from the request body
  try {
    // Validate input
    if (!advertiserID || !notificationId) {
      return res
        .status(400)
        .json({ message: "Tour Guide ID and Notification ID are required." });
    }

    // Validate that the touristId and notificationId are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(advertiserID) ||
      !mongoose.Types.ObjectId.isValid(notificationId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Tourist ID or Notification ID." });
    }

    // Find the notification document for the given tourist ID
    const notificationDoc = await Notification.findOne({ userID: advertiserID });

    if (!notificationDoc) {
      return res
        .status(404)
        .json({ message: "No notifications found for this tourist." });
    }

    // Find the index of the notification to remove by notificationId
    const notificationIndex = notificationDoc.notifications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Notification not found in the list." });
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const markNotificationAsReadAd = async (req, res) => {
  const { userID, notificationId } = req.params;

  try {
    // Validate input
    if (!userID || !notificationId) {
      return res
        .status(400)
        .json({ message: "UserID and NotificationID are required." });
    }

    // Step 1: Find the user notification document by userID
    const notificationDocument = await Notification.findOne({ userID: userID });

    if (!notificationDocument) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user." });
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getAdvertiserDocuments = async (req, res) => {
  try {
    const ownerId = req.params.ownerId; // Get the ownerId from the request parameters

    // Fetch the documents from the database where the owner is the TourGuide and the model is "TourGuide"
    const documents = await PdfDetails.find({
      Owner: ownerId,
      ownerModel: "Advertiser",
    });



    // Return the fetched documents
    return res.status(200).json({
      message: "Documents fetched successfully!",
      documents: documents,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error fetching documents" });
  }
};


module.exports = {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  readActivities,
  createAdvertiserInfo,
  readAdvertiserInfo,
  viewAll2,
  updateAdvertiserInfo,
  getAdvertisers,
  getAdvertisers,
  uploadAdvertiserDocuments,
  changePasswordAdvertiser,
  addTransportation,
  requestAdvertiserAccountDeletion,
  uploadPictureadvertiser,
  getadvertiserImage,
  viewActivityReport,
  notifyAdvertiser,
  getAdvertiserById,
  getAttractionSalesReport,
  viewMyNotificationsAd,
  markNotificationAsReadAd,
  removeNotificationAd,
  getAdvertiserDocuments,
};
