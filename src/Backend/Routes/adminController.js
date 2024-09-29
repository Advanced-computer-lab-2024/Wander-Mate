const adminModel = require("../Models/admin.js");
const Category = require("../Models/category.js");
const mongoose = require("mongoose");
const productModel = require("../Models/products.js");
const bcrypt = require("bcrypt");
const Advertiser = require("../Models/advertiser.js");
const Seller = require("../Models/seller.js");
const tourGuide = require("../Models/tourGuide.js");
const TourismGoverner = require("../Models/tourismGoverner.js");
const tourist = require("../Models/tourist.js");

// Creating an admin
const createAdmin = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    // Check if both fields are provided
    if (!Username || !Password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    // Check if the username contains spaces
    if (/\s/.test(Username)) {
      return res
        .status(400)
        .json({ message: "Username should not contain spaces" });
    }

    // Check if the username already exists
    const existingAdmin = await adminModel.findOne({ UserName: Username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Create admin with hashed password
    const admin = await adminModel.create({
      UserName: Username,
      Password: hashedPassword,
    });

    res.status(200).json(admin);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't create the admin" });
  }
};

// Creating a category
const createCategory = async (req, res) => {
  try {
    const { Name } = req.body;

    // Check if category name is provided
    if (!Name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ Name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create the category
    const category = await Category.create({ Name });

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't create the category" });
  }
};

// Updating a category by its name
const updateCategory = async (req, res) => {
  try {
    const { currentName, newName } = req.body; // Get current and new category names from the request body

    // Check if both names are provided
    if (!currentName || !newName) {
      return res
        .status(400)
        .json({ message: "Both current and new category names are required" });
    }

    // Check if the category with the current name exists
    const existingCategory = await Category.findOne({ Name: currentName });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the new category name already exists
    const categoryWithSameName = await Category.findOne({ Name: newName });
    if (categoryWithSameName) {
      return res
        .status(400)
        .json({ message: "Category with this new name already exists" });
    }

    // Update the category name
    existingCategory.Name = newName;
    await existingCategory.save();

    res.status(200).json(existingCategory);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't update the category" });
  }
};

// Deleting a category by its name
const deleteCategory = async (req, res) => {
  try {
    const { Name } = req.body; // Get the category name from the request body

    // Check if the category name is provided
    if (!Name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category exists
    const existingCategory = await Category.findOne({ Name });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await Category.deleteOne({ Name });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't delete the category" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { UserName } = req.body;

    if (!UserName) {
      return res.status(400).json({ message: "Username is required" });
    }

    let accountDeleted = false;

    const existingAdmin = await adminModel.findOne({ UserName });
    if (existingAdmin) {
      await adminModel.deleteOne({ UserName });
      accountDeleted = true;
    }

    const existingAdvertiser = await Advertiser.findOne({ UserName });
    if (existingAdvertiser) {
      await Advertiser.deleteOne({ UserName });
      accountDeleted = true;
    }

    const existingSeller = await Seller.findOne({ UserName });
    if (existingSeller) {
      await Seller.deleteOne({ UserName });
      accountDeleted = true;
    }

    const existingTourGuide = await tourGuide.findOne({ UserName });
    if (existingTourGuide) {
      await tourGuide.deleteOne({ UserName });
      accountDeleted = true;
    }

    const existingTourismGoverner = await TourismGoverner.findOne({ UserName });
    if (existingTourismGoverner) {
      await TourismGoverner.deleteOne({ UserName });
      accountDeleted = true;
    }

    const existingTourist = await tourist.findOne({ UserName });
    if (existingTourist) {
      await tourist.deleteOne({ UserName });
      accountDeleted = true;
    }

    if (!accountDeleted) {
      return res.status(404).json({ message: "User not found in any system" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account" });
  }
};

const createTourismGov = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    if (/\s/.test(Username)) {
      return res
        .status(400)
        .json({ message: "Username should not contain spaces" });
    }

    const existingTourismGoverner = await TourismGoverner.findOne({
      UserName: Username,
    });
    if (existingTourismGoverner) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const TourismGov = await TourismGoverner.create({
      UserName: Username,
      Password: hashedPassword,
    });

    res.status(200).json(TourismGov);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't create the tourism governer" });
  }
};

const addProduct = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { Price, Description, Seller, Quantity } = req.body;

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Create a new product instance
    const product = await productModel.create({
      picture: {
        data: req.file.buffer, // Get image data (Buffer)
        contentType: req.file.mimetype, // Get content type of the image
      },
      price: parseFloat(Price), // Ensure price is a number
      description: Description, // Product description
      seller: Seller, // Seller ID
      ratings: 0, // Optional: Initialize ratings
      reviews: [], // Optional: Initialize reviews
      quantity: parseInt(Quantity), // Convert quantity to an integer
    });

    res.status(200).json({ message: "Product added successfully!", product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(400).json({ error: "Failed to add product." });
  }
};

const getImage = async (req, res) => {
  try {
    const { productId } = req.params; // Get the product ID from the request parameters

    // Find the product by ID
    const product = await productModel.findById(productId);

    // Check if product exists
    if (!product || !product.picture || !product.picture.data) {
      return res.status(404).json({ error: "Product or image not found." });
    }

    // Set the content type for the image
    res.set("Content-Type", product.picture.contentType);

    // Send the image data
    res.send(product.picture.data);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

const viewAdminProducts = async (req, res) => {
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



module.exports = {
  createAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAccount,
  createTourismGov,
  addProduct,
  getImage,
  viewAdminProducts
};
