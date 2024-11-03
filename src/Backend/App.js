const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Initialize multer
const uploadMult = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
}).array("pictures", 10);
mongoose.set("strictQuery", false);
require("dotenv").config({ path: "../.env" });
const uploadPdfs = upload.fields([
  { name: "ID", maxCount: 1 },
  { name: "docs", maxCount: 1 },
]);

//Requiring functions from Controllers
const {
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
  viewPlaces,
  viewActivities,
  viewItineraries,
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
  // rateEvent
  calculateLoyaltyPoints,
  viewMyComplaints,
  // updateProductReviews,
  // BookHotel,
  redeemPoints,
  searchHotel,
  reviewProduct,
  cancelBooking,
  shareActivity,
  currencyConverter,
} = require("./Routes/touristController");

const {
  createSeller,
  readSeller,
  updateSeller,
  viewSellerProducts,
  SellersearchProductByName,
  sortProductsByRatingsseller,
  addProductseller,
  UpdateProductseller,
  getProduct,
  getSellers,
  uploadSellerDocuments,
  uploadProductImageSeller,
  SellerarchiveProduct,
  changePasswordSeller,
  requestSellerAccountDeletion,
  uploadPictureseller,
  viewSellerProductSalesAndQuantity,
} = require("./Routes/sellerController.js");

const {
  createAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAccount,
  createTourismGov,
  addProduct,
  getImage,
  viewAdminProducts,
  searchProductsByName,
  sortProductsByRatings,
  UpdateProduct,
  filterProductsByPrice,
  createPreferenceTags,
  updatePreferenceTags,
  deletePreferenceTags,
  readPreferenceTags,
  readCategory,
  getNations,
  getID,
  getCategories,
  getTags,
  deleteCategoryById,
  updateCategoryById,
  updatePreferenceTagById,
  deletPreferenceTagsById,
  replytoComplaints,
  acceptRejectUser,
  uploadProductImage,
  AdminarchiveProduct,
  viewDocuments,
  viewAllComplaints,
  changePasswordAdmin,
  checkUserName,
  viewComplaintDetails,
  markComplaintAsResolved,
  viewProductSalesAndQuantity,
  flagEventOrItinerary,
} = require("./Routes/adminController.js");

const {
  createTourGuide,
  createItinerary,
  createProfileInformation,
  readProfileInformation,
  updateProfileInformation,
  deleteItinerary,
  updateItinerary,
  viewAll1,
  readItinerary,
  getTourguides,
  uploadTourGuideDocuments,
  updateGuideRatings,
  changePasswordTourGuide,
  deactivateItinerary,
  requestTourGuideAccountDeletion,
  uploadPicturetourguide,
} = require("./Routes/tourGuideController.js");

const {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  readActivities,
  createAdvertiserInfo,
  viewAll2,
  readAdvertiserInfo,
  updateAdvertiserInfo,
  getAdvertisers,
  uploadAdvertiserDocuments,
  changePasswordAdvertiser,
  addTransportation,
  requestAdvertiserAccountDeletion,
  uploadPictureadvertiser,
} = require("./Routes/AdvertiserController.js");

const {
  deletePlace,
  createPlace,
  updatePlace,
  getPlaces,
  getPlace,
  createHistoricalTags,
  viewAll0,
  getPlaceImage,
  readHistoricalTags,
  updateHistoricalTags,
  changePasswordTourismGoverner,
} = require("./Routes/tourismGovernerController.js");
const MongoURI = process.env.MONGO_URI;
console.log(MongoURI);
//App variables
const app = express();
app.use(cors());
const port = process.env.PORT || 8000;
// #Importing the userController

// configurations
// Mongo DB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.post("/touristRegister", touristRegister);
//Seller
app.post("/createSeller", createSeller);
app.get("/readSeller", readSeller);
app.put("/updateSeller", updateSeller);
///////////////////////////////////////////

//TourismGoverner
app.post("/createPlace", uploadMult, createPlace);
app.get("/getPlace/:id", getPlace);
app.get("/getPlaces", getPlaces);
app.patch("/updatePlace/:Id", uploadMult, updatePlace);
app.delete("/deleteplace/:Id", deletePlace);
app.get("/getPlaceImage/:placeId", getPlaceImage);
app.get("/viewAll0", viewAll0);
app.get("/viewAll1", viewAll1);
app.get("/viewAll2", viewAll2);
//////////////////////////////////////////////////

app.post("/searchAttractions", searchAttractions);
app
  .route("/handleTourist/:touristID")
  .get(handleTourist) // Handle GET requests for reading tourist information
  .put(handleTourist);
app.get(
  "/viewUpcomingActivitiesAndItineraries",
  viewUpcomingActivitiesAndItineraries
);
//Admin CRUD categories
app.post("/addAdmin", createAdmin);
app.post("/createCategory", createCategory);
app.delete("/deleteAccount", deleteAccount);
app.post("/addTourismGov", createTourismGov);
app.patch("/UpdateProduct/:id", UpdateProduct);
app.patch("/UpdateProductseller/:id", UpdateProductseller);
app.get("/readItinerary/:id", readItinerary);
//Read remaining
app.patch("/updateCategory", updateCategory);
app.patch("/updateCategoryById/:id", updateCategoryById);
app.delete("/deleteCategory", deleteCategory);
app.delete("/deleteCategoryById/:id", deleteCategoryById);
app.post("/createPreferenceTags", createPreferenceTags);
app.get("/readCategory", readCategory);
app.patch("/updatePreferenceTags", updatePreferenceTags);
app.patch("/updatePreferenceTagById/:id", updatePreferenceTagById);
app.delete("/deletePreferenceTags", deletePreferenceTags);
app.delete("/deletPreferenceTagsById/:id", deletPreferenceTagsById);
app.get("/readPreferenceTags", readPreferenceTags);
app.post("/complaints/:complaintId/reply", replytoComplaints);
app.get('/sellers/:sellerID/products/sales-and-quantity', viewSellerProductSalesAndQuantity);

//CRUD activity
app.get("/readActivities", readActivities);
app.post("/createActivity", createActivity);
app.get("/readActivity/:id", readActivity);
app.patch("/updateActivity", updateActivity);
app.delete("/deleteActivity", deleteActivity);
/////////////////////////////////////
app.post("/createTourGuide", createTourGuide);
app.post("/createAdvertiser", createAdvertiser);
app.post("/filterPlaces", filterPlaces);
app.get("/viewTouristProducts", viewTouristProducts);
app.get("/viewAdminProducts", viewAdminProducts);
app.get("/viewSellerProducts", viewSellerProducts);
app.get("/sortProductsByRatings", sortProductsByRatings);
app.get("/sortProductsByRatingsseller", sortProductsByRatingsseller);
app.get("/sortProductsByRatingstourist", sortProductsByRatingstourist);
app.post("/addProduct", upload.single("picture"), addProduct); // 'picture' matches the field name in the form
app.post("/addProductseller", upload.single("picture"), addProductseller);
app.get("/products/:productId/image", getImage); //getImage with productID
app.get("/TouristsearchProductByName", TouristsearchProductByName);
app.post("/searchProductsByName", searchProductsByName);
app.get("/SellersearchProductByName", SellersearchProductByName);
app.post("/filterProductsByPrice", filterProductsByPrice);
app.get("/getProduct/:id", getProduct);
app.get("/viewTouristProducts", viewTouristProducts);
app.post("/redeempoints", redeemPoints);
//////////////////////////////////////////
app.post("/createHistoricalTags", createHistoricalTags);
app.get("/readHistoricalTags", readHistoricalTags);
app.patch("/updateHistoricalTags/:id", updateHistoricalTags);
app.post("/createItinerary", createItinerary);
app.post("/createProfileInformation", createProfileInformation);
app.post("/createAdvertiserInfo", createAdvertiserInfo);
app.get("/readProfileInformation/:Username", readProfileInformation);
app.put("/updateProfileInformation", updateProfileInformation);
app.put("/updateItinerary/:id", updateItinerary);
app.delete("/deleteItinerary", deleteItinerary);
app.post("/filterItineraries", filterItineraries);
app.patch("/readAdvertiserInfo", readAdvertiserInfo);
app.put("/updateAdvertiserInfo", updateAdvertiserInfo);
app.post("/filterActivities", filterActivities);
app.get("/getNations", getNations);
app.get("/getCategories", getCategories);
app.get("/getTags", getTags);
app.get("/getID/:Username", getID);
app.get("/getSellers/", getSellers);
app.get("/viewPlaces", viewPlaces);
app.get("/viewActivities", viewActivities);
app.get("/viewItineraries", viewItineraries);
app.get("/getAdvertisers", getAdvertisers);
app.get("/searchActivities", searchActivities);
app.get("/sortActivitiesByRatings", sortActivitiesByRatings);
app.get("/readPlaces", readPlaces);
app.get("/getTourguides", getTourguides);
app.post("/getAge", getAge);
app.post("/search-flights", SearchFlights);
app.post("/book-flight/:touristID", BookFlight);
app.post("/searchHotel",searchHotel);
// app.post("/BookHotel", BookHotel);
app.post("/comment-on-itinerary/:id", commentOnItinerary);
app.post("/commentOnGuide/:id", commentOnGuide);
app.post("/makeComplaint", makeComplaint);
//upload docs
app.post("/uploadTourGuideDocuments", uploadPdfs, uploadTourGuideDocuments);
app.post("/uploadAdvertiserDocuments", uploadPdfs, uploadAdvertiserDocuments);
app.post("/uploadSellerDocuments", uploadPdfs, uploadSellerDocuments);
app.get("/viewDocuments/:ownerId", viewDocuments);
//////////////
app.put("/updateGuideRatings/:guideID", updateGuideRatings);
app.post("/RateGuide", RateGuide);
app.post("/addCommentONEvent", addCommentONEvent);
app.post("/acceptRejectUser", acceptRejectUser);
app.post("/changePasswordTourGuide", changePasswordTourGuide);
app.post("/changePasswordAdmin", changePasswordAdmin);
app.post("/changePasswordAdvertiser", changePasswordAdvertiser); //changePasswordTourist
app.post("/changePasswordTourismGoverner", changePasswordTourismGoverner);
app.post("/changePasswordAdvertiser", changePasswordAdvertiser);
app.post("/changePasswordTourist", changePasswordTourist);
app.post("/changePasswordSeller", changePasswordSeller);
app.put("/updateItineraryRatings/:itineraryId", updateItineraryRatings);
app.post("/rateItinerary", rateItinerary);
app.post("/rateProduct", rateProduct);
app.post("/reviewProduct",reviewProduct);
app.put("/updateProductRatings/:productId", updateProductRatings);
// app.put("/updateProductReviews/:productId",updateProductReviews);
app.put(
  "/uploadProductImage/:productId",
  upload.single("image"),
  uploadProductImage
);
app.put(
  "/uploadProductImageSeller/:productId",
  upload.single("image"),
  uploadProductImageSeller
);

app.put("/uploadPicturetourguide/:guideID",upload.single("image"),uploadPicturetourguide);

app.put("/uploadPictureadvertiser/:advertiserID",upload.single("image"),uploadPictureadvertiser);

app.put(
  "/uploadPictureseller/:sellerID",
  upload.single("image"),
  uploadPictureseller
);

//get attended activities, itenaries, and with whom
app.get("/viewAttendedActivities/:touristId", viewAttendedActivities);
app.get("/viewAttendedItineraries/:touristId", viewAttendedItineraries);
///////////////////////////////////////////////////////////////////////////
app.put("/updateItineraryRatings/:itineraryId", updateItineraryRatings);
app.post("/rateItinerary", rateItinerary);
app.put(
  "/uploadProductImage/:productId",
  upload.single("image"),
  uploadProductImage
);
app.put(
  "/uploadProductImageSeller/:productId",
  upload.single("image"),
  uploadProductImageSeller
);
app.patch("/AdminarchiveProduct/:productId", AdminarchiveProduct);
app.patch("/SellerarchiveProduct/:productId", SellerarchiveProduct);
app.get("/viewAllComplaints", viewAllComplaints);

app.put("/checkUserName", checkUserName);
app.post("/bookTransportation", bookTransportation);
app.post("/addTransportation", addTransportation);
app.put("/deactivateItinerary", deactivateItinerary);
app.put("/selectPreferences", selectPreferences);
app.delete(
  "/requestTouristAccountDeletion/:touristID",
  requestTouristAccountDeletion
);
app.delete(
  "/requestTourGuideAccountDeletion/:guideID",
  requestTourGuideAccountDeletion
);
app.delete(
  "/requestAdvertiserAccountDeletion/:advertiserID",
  requestAdvertiserAccountDeletion
);
app.delete(
  "/requestSellerAccountDeletion/:sellerID",
  requestSellerAccountDeletion
);
app.get("/viewComplaintDetails/:complaintId", viewComplaintDetails);
// app.put("/rateEvent", rateEvent);
app.post("/calculateLoyaltyPoints", calculateLoyaltyPoints);

app.get("/viewMyComplaints/:touristID", viewMyComplaints);
app.patch("/markComplaintAsResolved/:complaintId", markComplaintAsResolved);
app.get("/viewProductSalesAndQuantity",viewProductSalesAndQuantity);
app.get("/viewSellerProductSalesAndQuantity/:sellerId",viewSellerProductSalesAndQuantity);

app.delete("/cancelBooking/:bookingID",cancelBooking);
app.post("/shareActivity", shareActivity);
app.post("/flag-event-or-itinerary", flagEventOrItinerary);
app.put("/currencyConverter", currencyConverter);