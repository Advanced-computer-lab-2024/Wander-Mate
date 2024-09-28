const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config({ path: "../.env" });
//Requiring functions from Controllers
const {
  touristRegister,
  searchAttractions,
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
  deleteCategory
} = require("./Routes/adminController.js");


const{
  createTourGuide,
}=require("./Routes/tourGuideController.js");
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
app.post("/searchAttractions", searchAttractions);
app.post("/addAdmin", createAdmin);
app.post("/createCategory", createCategory);