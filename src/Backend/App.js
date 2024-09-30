const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Initialize multer
mongoose.set("strictQuery", false);
require("dotenv").config({ path: "../.env" });
//Requiring functions from Controllers
const {
  touristRegister,
  searchAttractions,
  handleTourist,
  filterPlaces,
  viewTouristProducts,
  TouristsearchProductByName,
  viewUpcomingActivitiesAndItineraries
} = require("./Routes/touristController");
const {
  createSeller,
  readSeller,
  updateSeller,
  viewSellerProducts
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
} = require("./Routes/adminController.js");

const { 
    createTourGuide,
    createItinerary,
    createProfileInformation, 
    updateProfileInformation,
    readProfileInformation,
} = require("./Routes/tourGuideController.js");

const {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  readActivities,
} = require("./Routes/AdvertiserController.js");

const {
  deletePlace,
  createPlace,
  updatePlace,
  getPlaces,
  getPlace,
  createTags,
} = require("./Routes/tourismGovernerController.js");
const MongoURI = process.env.MONGO_URI;
console.log(MongoURI);
//App variables
const app = express();
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
app.post("/createPlace", createPlace);
app.get("/getPlace/:id", getPlace);
app.get("/getPlaces", getPlaces);
app.put("/updatePlace", updatePlace);
app.delete("/deleteplace/:id", deletePlace);
//////////////////////////////////////////////////

app.post("/searchAttractions", searchAttractions);
app
  .route("/handleTourist/:touristID")
  .get(handleTourist) // Handle GET requests for reading tourist information
  .put(handleTourist);
app.get("/viewUpcomingActivitiesAndItineraries",viewUpcomingActivitiesAndItineraries);
//Admin CRUD categories
app.post("/addAdmin", createAdmin);
app.post("/createCategory", createCategory);
app.delete("/deleteAccount", deleteAccount);
app.post("/addTourismGov", createTourismGov);
//Read remaining
app.patch("/updateCategory", updateCategory);
app.delete("/deleteCategory", deleteCategory);

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
app.get("/viewAdminProducts" ,viewAdminProducts);
app.get("/viewSellerProducts",viewSellerProducts);
app.post("/addProduct", upload.single("picture"), addProduct); // 'picture' matches the field name in the form
app.get("/products/:productId/image", getImage); //getImage with productID
app.post("/TouristsearchProductByName",TouristsearchProductByName);
app.get("/viewTouristProducts",viewTouristProducts);
//////////////////////////////////////////
app.post("/createTags", createTags);
app.post('/createItinerary', createItinerary);


app.post("/createProfileInformation/:username", createProfileInformation);
app.put("/updateProfileInformation",updateProfileInformation);
app.get("/readProfileInformation",readProfileInformation);

