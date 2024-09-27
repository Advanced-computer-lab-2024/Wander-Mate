const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config({ path: "../.env" });
const { guestRegister } = require("./Routes/guestController");

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
app.post("/guestRegister", guestRegister);
