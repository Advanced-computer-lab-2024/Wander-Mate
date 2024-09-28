const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config({ path: "../.env" });
//Requiring functions from Controllers
const {
  touristRegister,
  searchAttractions,
  handleTourist,
} = require("./Routes/touristController");
const {
  createSeller,
  readSeller,
  updateSeller,
} = require("./Routes/sellerController.js");

const {
  createAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./Routes/adminController.js");

const { createTourGuide } = require("./Routes/tourGuideController.js");
const {
  createActivity,
  readActivity,
  updateActivity,
  deleteActivity,
  createAdvertiser,
  
} = require("./Routes/AdvertiserController.js");

const {deletePlace,createPlace,updatePlace,getPlaces}=require("./Routes/tourismGovernerController.js");
const MongoURI = process.env.MONGO_URI;
console.log(MongoURI);
//App variables
const app = express();
const port = process.env.PORT;
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
app.post("/addSeller", createSeller);
app.get("/readSeller", readSeller);
app.put("/updateSeller", updateSeller);
///////////////////////////////////////////

//TourismGoverner
app.post("/createPlace", createPlace);
app.get("/getPlaces", getPlaces);
app.put("/updatePlace", updatePlace);
app.delete("/deleteplace", deletePlace);
//////////////////////////////////////////////////

app.post("/searchAttractions", searchAttractions);
app.route("/handleTourist/:touristID")
  .get(handleTourist) // Handle GET requests for reading tourist information
  .put(handleTourist);
app.post("/addAdmin", createAdmin);
app.post("/createCategory", createCategory);

app.post("/createActivity", createActivity);
app.get("/readActivity", readActivity);
app.patch("/updateActivity", updateActivity);
app.delete("/deleteActivity", deleteActivity);
app.post("/createTourGuide",createTourGuide);
app.post("/createAdvertiser",createAdvertiser);

