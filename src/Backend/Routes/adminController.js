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
const userModel = require("../Models/users.js");
const PreferenceTags = require("../Models/preferenceTags.js");

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

    // Check if the Username contains spaces
    if (/\s/.test(Username)) {
      return res
        .status(400)
        .json({ message: "Username should not contain spaces" });
    }

    // Check if the Username already exists
    const existingAdmin = await adminModel.findOne({ Username: Username });
    const existingUser = await userModel.findOne({ Username: Username });
    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    //create UsreName
    // Create admin with hashed password
    const admin = await adminModel.create({
      Username: Username,
      Password: hashedPassword,
    });
    const userId = admin._id;
    await userModel.create({ Username: Username, userId });

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
    const { Username } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    let accountDeleted = false;

    const existingAdmin = await adminModel.findOne({ Username });
    if (existingAdmin) {
      await adminModel.deleteOne({ Username });
      accountDeleted = true;
    }

    const existingAdvertiser = await Advertiser.findOne({ Username });
    if (existingAdvertiser) {
      await Advertiser.deleteOne({ Username });
      accountDeleted = true;
    }

    const existingSeller = await Seller.findOne({ Username });
    if (existingSeller) {
      await Seller.deleteOne({ Username });
      accountDeleted = true;
    }

    const existingTourGuide = await tourGuide.findOne({ Username });
    if (existingTourGuide) {
      await tourGuide.deleteOne({ Username });
      accountDeleted = true;
    }

    const existingTourismGoverner = await TourismGoverner.findOne({ Username });
    if (existingTourismGoverner) {
      await TourismGoverner.deleteOne({ Username });
      accountDeleted = true;
    }

    const existingTourist = await tourist.findOne({ Username });
    if (existingTourist) {
      await tourist.deleteOne({ Username });
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

const readCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No preference categories found." });
    }
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories." });
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

    const existingTourismGoverner = await userModel.findOne({
      Username: Username,
    });
    if (existingTourismGoverner) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const TourismGov = await TourismGoverner.create({
      Username: Username,
      Password: hashedPassword,
    });
    const userId = TourismGov._id;
    await userModel.create({ Username: Username, userId });

    res.status(200).json(TourismGov);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't create the tourism governer" });
  }
};

const addProduct = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { Name, Price, Description, Seller, Quantity } = req.body;

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
      name: Name,
      price: parseFloat(Price), // Ensure price is a number
      description: Description, // Product description
      seller: Seller, // Seller ID
      ratings: 0, // Initialize ratings
      reviews: [], // Initialize reviews
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
    const products = await productModel.find({}); // Populate seller info if needed

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

const sortProductsByRatings = async (req, res) => {
  try {
    // Find and sort products by ratings in descending order (-1 for descending)
    const products = await productModel.find({}).sort({ ratings: -1 });

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

const AdminsearchProductByName = async (req, res) => {
  try {
    const { name } = req.body; // Expecting the product name in the request body

    // Check if a name is provided
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Search for products that match the name (case-insensitive)
    const products = await productModel.find({
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
    res
      .status(400)
      .json({ message: "Error searching for products", error: err.message });
  }
};
const UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id; // Get product ID from request parameters
    const { price, description } = req.body; // Get updated fields from the request body

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await productModel.findByIdAndUpdate(id, {
      price: price,
      description: description,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error to update product", error: err.message });
  }
};
const filterProductsByPrice = async (req, res) => {
  try {
    // Destructure minPrice and maxPrice from the request query
    const { minPrice, maxPrice } = req.body;

    // Build the filter object based on provided prices
    const priceFilter = {};

    if (minPrice) {
      priceFilter.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
    }

    if (maxPrice) {
      priceFilter.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
    }

    // Fetch products that match the price range
    const products = await productModel.find({
      price: priceFilter, // Apply price filter
    });

    // Check if any products were found
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found within the specified price range",
      });
    }

    // Return the filtered products
    res.status(200).json(products);
  } catch (err) {
    console.error("Error filtering products by price:", err);
    res.status(500).json({
      message: "Failed to filter products by price",
      error: err.message,
    });
  }
};
const createPreferenceTags = async (req, res) => {
  try {
    const { Name } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existingTag = await PreferenceTags.findOne({ Name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    // Create the category
    const Tag = await PreferenceTags.create({ Name });

    res.status(200).json(Tag);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't create the tag" });
  }
};

const updatePreferenceTags = async (req, res) => {
  try {
    const { currentName, newName } = req.body; // Get current and new category names from the request body

    // Check if both names are provided
    if (!currentName || !newName) {
      return res
        .status(400)
        .json({ message: "Both current and new tags names are required" });
    }

    // Check if the category with the current name exists
    const existingTag = await PreferenceTags.findOne({ Name: currentName });
    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Check if the new category name already exists
    const tagWithSameName = await Category.findOne({ Name: newName });
    if (tagWithSameName) {
      return res
        .status(400)
        .json({ message: "Category with this new name already exists" });
    }

    // Update the category name
    existingTag.Name = newName;
    await existingTag.save();

    res.status(200).json(existingTag);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't update the category" });
  }
};

const deletePreferenceTags = async (req, res) => {
  try {
    const { Name } = req.body; // Get the category name from the request body

    // Check if the category name is provided
    if (!Name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Check if the category exists
    const existingTag = await PreferenceTags.findOne({ Name });
    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Delete the category
    await PreferenceTags.deleteOne({ Name });

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Tag delete the category" });
  }
};

const readPreferenceTags = async (req, res) => {
  try {
    // Fetch all preference tags from the database
    const preferenceTags = await PreferenceTags.find();

    // Check if there are any tags
    if (preferenceTags.length === 0) {
      return res.status(404).json({ message: "No preference tags found." });
    }

    // Respond with the retrieved tags
    res.status(200).json(preferenceTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching preference tags." });
  }
};

const getNations = async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection("NationsLookUp");
    const nations = await collection.find({}).toArray(); // Convert cursor to array
    res.status(200).json(nations); // Send nations as JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching nations", error });
  }
};

const getID = async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection("users");
    const user = await collection.findOne({ Username: req.params.Username });
    res.status(200).json({ userID: user.userID }); // Send user as JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

module.exports = {
  createAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  readCategory,
  deleteAccount,
  createTourismGov,
  addProduct,
  getImage,
  viewAdminProducts,
  sortProductsByRatings,
  AdminsearchProductByName,
  UpdateProduct,
  filterProductsByPrice,
  createPreferenceTags,
  updatePreferenceTags,
  deletePreferenceTags,
  readPreferenceTags,
  getNations,
  getID,
};
