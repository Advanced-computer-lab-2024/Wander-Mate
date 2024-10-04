const sellerModel = require("../Models/seller.js");
const ProductModel = require("../Models/products.js");
const userModel = require("../Models/users.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { query } = require("express");

// Creating a seller
// const createSeller = async (req, res) => {
//     try {
//         const { Username, /*FullName,*/ Password, Description} = req.body;

//         // Validate input
//         if (!Username || typeof Username !== 'string' || !Password || typeof Password !== 'string') {
//             return res.status(400).json({ message: "Invalid input: Username and Password are required and should be strings." });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(Password, saltRounds);

//         const seller = await sellerModel.create({ Username, Password: hashedPassword, Description: Description});
//         res.status(200).json(seller);
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ message: "Can't create the seller" });
//     }
// };

const createSeller = async (req, res) => {
  try {
    const { Username, Password, Email, Description } = req.body;

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

    // Create the seller using the hashed password
    const seller = await sellerModel.create({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
      Description: Description,
    });
    await userModel.create({ Username: Username });

    res.status(200).json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the seller" });
  }
};

//Updating a seller
const updateSeller = async (req, res) => {
  try {
    const { Username, FullName, Description } = req.body;
    const seller = await sellerModel.findOneAndUpdate(
      { Username },
      { FullName, Description }
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    } else {
      res.status(200).json(seller);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't update the seller" });
  }
};

//Reading a seller
const readSeller = async (req, res) => {
  try {
    const { username } = req.query; // Get the username from query parameters
    const seller = await sellerModel.find({ Username: username }); // Query the database

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    } else {
      res.status(200).json(seller);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't read the seller" });
  }
};

const viewSellerProducts = async (req, res) => {
  try {
    // Find all products with the relevant fields
    const products = await ProductModel.find({}); // Populate seller info if needed

    // Check if products exist
    if (!products) {
      return res.status(400).json({ message: "No products available" });
    }

    // Return the list of products
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: "Unable to fetch products" });
  }
};

const sortProductsByRatingsseller = async (req, res) => {
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

const SellersearchProductByName = async (req, res) => {
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

module.exports = {
  createSeller,
  updateSeller,
  readSeller,
  viewSellerProducts,
  sortProductsByRatingsseller,
  SellersearchProductByName,
};
