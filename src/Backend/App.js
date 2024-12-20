const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cron = require("node-cron");
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
  calculateLoyaltyPoints,
  viewMyComplaints,
  // updateProductReviews,
  redeemPoints,
  searchHotel,
  searchHotellocation,
  bookHotel,
  reviewProduct,
  cancelBooking,
  rateEvent,
  bookItinerary,
  updateEventRatings,
  currencyConverter,
  viewAllTransportations,
  getMyBookings,
  getProductReviews,
  bookActivity,
  addDeliveryAddress,
  addItemToCart,
  showCart,
  getReviews,
  payWithWallet,
  assignBirthdayPromo,
  applyPromoCode,
  viewPastActivitiesAndItineraries,
  getDeliveryAddresses,
  addToWishlist,
  removeFromCart,
  viewMyWishlist,
  cancelOrder,
  removeFromWishlist,
  addWishlistItemToCart,
  viewOrderDetails,
  requestToBeNotified,
  PayByCard,
  ViewBookmarkedAttractions,
  checkOut,
  ViewOrders,
  sendUpcomingEventNotifications,
  previewPromoCode,
  Bookmarkevent,
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
  gettourist,
  getBookingDetails,
  getTouristLevel,
  getTouristWallet,
  getMyOrders,
  viewBoughtProducts,
  getTouristPoints,
  unbookmarkEvent,
  checkIfEventBookmarked,
  sendItineraryNotifications,
  requestToBeNotifiedForAttraction,
  sendAttractionNotifications,
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
  getSellerImage,
  getSellerById,
  sendOutOfStockNotificationSeller,
  viewProductsOfSeller,
  getSalesReport,
  getSellerDocuments,
  viewMyNotificationsSeller,
  removeNotificationSeller,
  markNotificationAsReadSeller,
  getTotalQuantitiesForSeller,
  getTouristsBySeller,
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
  getAllUsernames,
  getDistinctOwners,
  login,
  getAdminID,
  getUsername,
  forgetPassword,
  validateOtp,
  resetPassword,
  getAirports,
  createPromoCode,
  sendOutOfStockNotificationAdmin,
  viewAllUsers,
  updateRevenueSales,
  markComplaintAsPending,
  deleteComplaint,
  deleteProduct,
  viewAllOrders,
  getTourists,
  getadvertisers,
  getsellers,
  gettourguides,
  gettourismgov,
  viewTopUsers,
  updateProductQuantity,
  updateSellerSales,
  emptyCart,
  getRevenue,
  getEmail,
  getTotalQuantities,
  getTotalBookings,
  viewMyNotificationsAdmin,
  markNotificationAsReadAdmin,
  removeNotificationAdmin,
  getUserStatistics,
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
  getTourGuideDocuments,
  updateGuideRatings,
  changePasswordTourGuide,
  deactivateItinerary,
  requestTourGuideAccountDeletion,
  uploadPicturetourguide,
  gettourGuideImage,
  viewItineraryReport,
  notifyTourGuide,
  deleteMyItinerary,
  viewMyNotificationsTG,
  removeNotificationTG,
  markNotificationAsReadTG,
  getItinerarySalesReport,
  getTotalBookingsForItineraryTourGuide,
  getTouristsByTourGuide,
  getTourGuide,
  getTourGuideItineraries,
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
  getadvertiserImage,
  viewActivityReport,
  notifyAdvertiser,
  getAdvertiserById,
  getAttractionSalesReport,
  viewMyNotificationsAd,
  removeNotificationAd,
  markNotificationAsReadAd,
  getAdvertiserDocuments,
  getAdvertiserTotalAttractionBookings,
  getTouristsByAdvertiser,
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
  deleteHistoricalTags,
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
      assignBirthdayPromo();
      sendUpcomingEventNotifications();

      // Schedule the function to run every day at midnight
      cron.schedule("0 0 * * *", () => {
        assignBirthdayPromo();
      });
      // cron.schedule('0 0 * * *', () => {
      //   console.log('Running birthday promo assignment...');
      //   assignBirthdayPromo();
      // });
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
app.delete("/deleteProduct/:id", deleteProduct);
app.patch("/UpdateProductseller/:id", UpdateProductseller);
app.get("/viewProductsOfSeller/:sellerId", viewProductsOfSeller);
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
app.delete("/deletePreferenceTagsById/:id", deletPreferenceTagsById);
app.get("/readPreferenceTags", readPreferenceTags);
app.post("/addPreferenceTag", addPreference);
app.post("/complaints/:complaintId/reply", replytoComplaints);
app.delete("/deleteComplaint/:complaintId", deleteComplaint);
app.get(
  "/sellers/:sellerID/products/sales-and-quantity",
  viewSellerProductSalesAndQuantity
);

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
app.get("/seller/:sellerID/image", getSellerImage);
app.get("/ADvertiser/:advertiserID/image", getadvertiserImage);
app.get("/GUIDE/:guideID/image", gettourGuideImage);
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
app.patch("/updateHistoricalTags/:Id", updateHistoricalTags);
app.delete("/deleteHistoricalTags/:Id", deleteHistoricalTags);
app.post("/createItinerary", createItinerary);
app.post("/createProfileInformation", createProfileInformation);
app.post("/createAdvertiserInfo", createAdvertiserInfo);
app.get("/readProfileInformation/:Username", readProfileInformation);
app.put("/updateProfileInformation", updateProfileInformation);
app.put("/updateItinerary/:id", updateItinerary);
app.delete("/deleteItinerary", deleteItinerary);
app.delete("/deleteMyItinerary/:id", deleteMyItinerary);
app.post("/filterItineraries", filterItineraries);
app.patch("/readAdvertiserInfo", readAdvertiserInfo);
app.put("/updateAdvertiserInfo", updateAdvertiserInfo);
app.post("/filterActivities", filterActivities);
app.get("/getNations", getNations);
app.get("/getairports", getAirports);
app.post("/createPromoCode", createPromoCode);
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
app.get("/getTourGuide/:guideID", getTourGuide);
app.get("/getTourGuideItineraries/:guideID", getTourGuideItineraries);
app.post("/getAge", getAge);
app.get("/search-flights", SearchFlights);
app.post("/book-flight/:touristID", BookFlight);
app.put("/searchHotel", searchHotel);
app.put("/searchHotellocation", searchHotellocation);
app.post("/bookHotel", bookHotel);
// // app.post("/BookHotel", BookHotel);
app.post("/comment-on-itinerary/:id", commentOnItinerary);
app.post("/commentOnGuide/:id", commentOnGuide);
app.post("/makeComplaint", makeComplaint);
//upload docs
app.post("/uploadTourGuideDocuments", uploadPdfs, uploadTourGuideDocuments);
app.post("/uploadAdvertiserDocuments", uploadPdfs, uploadAdvertiserDocuments);
app.post("/uploadSellerDocuments", uploadPdfs, uploadSellerDocuments);
app.get("/viewDocuments", viewDocuments);
app.get("/getDistinctOwners", getDistinctOwners);
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
app.post("/reviewProduct", reviewProduct);
app.put("/updateProductRatings/:productId", updateProductRatings);
app.get("/getTouristLevel/:touristId", getTouristLevel);
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

app.put(
  "/uploadPicturetourguide/:guideID",
  upload.single("image"),
  uploadPicturetourguide
);

app.put(
  "/uploadPictureadvertiser/:advertiserID",
  upload.single("image"),
  uploadPictureadvertiser
);

app.put(
  "/uploadPictureseller/:sellerID",
  upload.single("image"),
  uploadPictureseller
);

//get attended activities, itenaries, and with whom
app.get("/viewAttendedActivities/:touristId", viewAttendedActivities);
app.get("/viewAttendedItineraries/:touristId", viewAttendedItineraries);
app.get("/viewBoughtProducts/:touristId", viewBoughtProducts);
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
app.put("/deactivateItinerary/:itineraryId", deactivateItinerary);
app.post("/selectPreferences", selectPreferences);
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
app.post("/calculateLoyaltyPoints", calculateLoyaltyPoints);
app.get("/viewMyComplaints/:touristID", viewMyComplaints);
app.put("/markComplaintAsResolved/:complaintId", markComplaintAsResolved);
app.put("/markComplaintAsPending/:complaintId", markComplaintAsPending);
app.get("/viewProductSalesAndQuantity", viewProductSalesAndQuantity);
app.get(
  "/viewSellerProductSalesAndQuantity/:sellerId",
  viewSellerProductSalesAndQuantity
);
app.get("/getMyBookings/:touristID", getMyBookings);
app.delete("/cancelBooking/:bookingID", cancelBooking);
app.post("/flag-event-or-itinerary", flagEventOrItinerary);
app.post("/bookItinerary", bookItinerary);
app.post("/bookActivity", bookActivity);
app.post("/rateEvent", rateEvent);
app.put("/updateEventRatings/:eventId", updateEventRatings);
app.put("/updateActivityRating/:eventId", updateActivityRatings);
app.put("/currencyConverter", currencyConverter);
app.get("/viewAllTransportations", viewAllTransportations);
app.get("/getAllUsernames", getAllUsernames);
app.get("/getProductReviews/:productId", getProductReviews);
app.post("/login", login);
app.get("/getAdminID", getAdminID);
app.get("/getUsername/:userid", getUsername);
app.get("/viewItineraryReport/:guideID", viewItineraryReport);
app.get("/viewActivityReport/:advertiserID", viewActivityReport);
app.post("/addDeliveryAddress/:touristId", addDeliveryAddress);
app.post("/addItemToCart", upload.single("picture"), addItemToCart);
app.post("/addWishlistItemToCart", addWishlistItemToCart);
app.post(
  "/addWishlistItemToCart",
  upload.single("picture"),
  addWishlistItemToCart
);
app.post("/forgetPassword", forgetPassword);
app.put("/validateOtp", validateOtp);
app.put("/resetPassword", resetPassword);
app.get("/showCart/:touristID", showCart);
app.post("/getReviews", getReviews);
app.put("/payWithWallet", payWithWallet);
app.post("/applyPromoCode/:touristID", applyPromoCode);

app.post("/previewPromoCode/:touristId", previewPromoCode);

app.get(
  "/viewPastActivitiesAndItineraries/:touristId",
  viewPastActivitiesAndItineraries
);
app.get(
  "/viewPastActivitiesAndItineraries/:touristId",
  viewPastActivitiesAndItineraries
);
app.get("/getDeliveryAddresses/:touristId", getDeliveryAddresses);
app.post("/addToWishlist", addToWishlist);
app.post("/removeFromCart", removeFromCart);
app.delete("/removeProduct", removeProduct);
app.get("/viewOrderDetails/:OrderId", viewOrderDetails);
app.get("/viewAllOrders", viewAllOrders);
app.get("/viewMyWishlist/:touristId", viewMyWishlist);
app.get("/viewMyNotifications/:touristId", viewMyNotifications);
app.get("/viewMyNotificationsTG/:guideID", viewMyNotificationsTG);
app.get("/viewMyNotificationsAd/:advertiserId", viewMyNotificationsAd);
app.get("/viewMyNotificationsSeller/:sellerId", viewMyNotificationsSeller);
app.get("/viewMyNotificationsAdmin/:adminId", viewMyNotificationsAdmin);
app.delete("/cancel-order/:orderId", cancelOrder);
app.post("/makeOrder", makeOrder);
app.get("/getSellerById/:sellerId", getSellerById);
app.delete("/removeFromWishlist", removeFromWishlist);
app.delete(
  "/removeNotification/:touristId/:notificationId",
  removeNotification
);
app.delete(
  "/removeNotificationTG/:guideID/:notificationId",
  removeNotificationTG
);
app.delete(
  "/removeNotificationAd/:advertiserId/:notificationId",
  removeNotificationAd
);
app.delete(
  "/removeNotificationSeller/:sellerId/:notificationId",
  removeNotificationSeller
);
app.delete(
  "/removeNotificationAdmin/:adminId/:notificationId",
  removeNotificationAdmin
);
app.put("/isInWishlist", isInWishList);
app.post("/Bookmarkevent", Bookmarkevent);
app.put("/notifyAdvertiser", notifyAdvertiser);
app.put("/notifyTourGuide", notifyTourGuide);
app.delete("/unbookmarkEvent", unbookmarkEvent);
app.put("/sendOutOfStockNotificationSeller", sendOutOfStockNotificationSeller);
app.put("/sendOutOfStockNotificationAdmin", sendOutOfStockNotificationAdmin);
app.get("/getAdvertiserById/:advertiserId", getAdvertiserById);
app.post("/requestToBeNotified", requestToBeNotified);
app.post("/requestToBeNotifiedForAttraction", requestToBeNotifiedForAttraction);
app.get("/ViewBookmarkedAttractions/:userId", ViewBookmarkedAttractions);
app.get("/viewAllUsers", viewAllUsers);
app.get("/ViewOrders/:userId", ViewOrders);
app.post("/updateRevenueSales", updateRevenueSales);
app.post("/sendUpcomingEventNotifications", sendUpcomingEventNotifications);
app.post("/create-payment-intent", PayByCard);
app.get("/viewTopUsers", viewTopUsers);
app.get("/gettourists", getTourists);
app.get("/getadvertisers", getadvertisers);
app.get("/getsellers", getsellers);
app.get("/gettourguides", gettourguides);
app.get("/gettourismgov", gettourismgov);
app.put("/updateProductQuantity", updateProductQuantity);
app.put("/updateSellerSales", updateSellerSales);
app.put("/emptyCart/:cartId", emptyCart);
app.get("/getMyRating/:touristId/:itineraryId", getMyRating);
app.get("/getItineraryReviews/:itineraryId", getItineraryReviews);
app.get("/getGuideReviews/:guideId", getGuideReviews);
app.get("/getPreferences/:touristId", getPreferences);
app.delete("/removePreference/:touristId/:preferenceId", removePreference);
app.post("/checkIfEventBookmarked", checkIfEventBookmarked);
app.put(
  "/markNotificationAsRead/:userID/:notificationId",
  markNotificationAsRead
);
app.put(
  "/markNotificationAsReadTG/:userID/:notificationId",
  markNotificationAsReadTG
);
app.put(
  "/markNotificationAsReadAd/:userID/:notificationId",
  markNotificationAsReadAd
);
app.put(
  "/markNotificationAsReadSeller/:userID/:notificationId",
  markNotificationAsReadSeller
);
app.put(
  "/markNotificationAsReadAdmin/:userID/:notificationId",
  markNotificationAsReadAdmin
);
app.get("/getRevenue/:userID", getRevenue);
app.get("/getBookingDetails/:bookingID", getBookingDetails);
app.get("/getEmail/:userID", getEmail);
app.get("/gettourist/:touristID", gettourist);
app.get("/getTouristWallet/:touristId", getTouristWallet);
app.get("/getSalesReport/:sellerId", getSalesReport);
app.get("/getMyOrders/:userId", getMyOrders);
app.get("/getTourGuideDocuments/:ownerId", getTourGuideDocuments);
app.get("/getAdvertiserDocuments/:ownerId", getAdvertiserDocuments);
app.get("/getSellerDocuments/:ownerId", getSellerDocuments);
app.get("/getTouristPoints/:touristID", getTouristPoints);

app.get("/getItinerarySalesReport/:guideId", getItinerarySalesReport);
app.get("/getAttractionSalesReport/:advertiserId", getAttractionSalesReport);
app.post("/sendItineraryNotifications", sendItineraryNotifications);
app.post("/sendAttractionNotifications", sendAttractionNotifications);

app.get("/getTotalQuantities", getTotalQuantities);
app.get("/getTotalBookings", getTotalBookings);
app.get("/getTotalQuantitiesForSeller/:sellerId", getTotalQuantitiesForSeller);
app.get(
  "/getAdvertiserTotalAttractionBookings/:advertiserId",
  getAdvertiserTotalAttractionBookings
);
app.get(
  "/getTotalBookingsForItineraryTourGuide/:guideId",
  getTotalBookingsForItineraryTourGuide
);
app.get("/getTopCustomersSeller/:sellerId", getTouristsBySeller);
app.get("/getTopCustomersTourGuide/:tourGuideId", getTouristsByTourGuide);
app.get("/getTopCustomersAdvertiser/:advertiserId", getTouristsByAdvertiser);
app.get("/getUserStatistics", getUserStatistics);
