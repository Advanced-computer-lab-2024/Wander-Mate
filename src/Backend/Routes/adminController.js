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
const Complaints = require("../Models/complaints.js");
const Reply = require("../Models/reply.js");
const PdfDetails = require("../Models/pdfDetails.js");
const Itinerary = require("../Models/itinerary.js");
const touristModel = require("../Models/tourist.js");
const Users = require("../Models/users.js");
const advertiserModel = require("../Models/advertiser.js");
const sellerModel = require("../Models/seller.js");
const tourGuideModel = require("../Models/tourGuide.js");
const otpModel = require("../Models/otp.js");
const jwt = require("jsonwebtoken");
const PromoCode = require("../Models/promoCode.js");
const attractions = require("../Models/attractions.js");
const Notification = require("../Models/notifications.js");
const bookings = require("../Models/bookings.js");
const { notifyAdvertiser } = require("./AdvertiserController.js");
const { notifyTourGuide } = require("./tourGuideController.js");
const Sales = require("../Models/sales.js");
const orderModel = require("../Models/order.js");
const salesModel = require("../Models/sales.js");
const Product = require("../Models/products.js");
const cartModel = require("../Models/cart.js");
const Comment = require("../Models/comments.js");
const Rating = require("../Models/rating.js");
const Review = require("../Models/review.js");
const BookedFlights= require("../Models/bookedFlights.js");
const BookedHotel=require("../Models/bookedHotel.js");
const BookedMarks=require("../Models/bookMark.js");
const address =require("../Models/address.js");
const cart = require("../Models/cart.js");
const wishlist = require("../Models/whishlist.js");
const notifications = require("../Models/notifications.js");
const promocode = require("../Models/promoCode.js");
const sales = require("../Models/sales.js");
const transportations = require("../Models/transportation.js");
const { default: axios } = require("axios");

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
    await userModel.create({
      Username: Username,
      userID: userId,
      Type: "Admin",
    });
    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
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

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params; // Get the category ID from the URL parameters
    const { newName } = req.body; // Get the new category name from the request body
    // Check if the ID and new name are provided
    if (!id || !newName) {
      return res.status(400).json("Id, name are required");
    }
    // Check if the category with the given ID exists
    const category = await Category.findById(id);
    if (!category) {
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
    category.Name = newName;
    await category.save();
    res.status(200).json(category);
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

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params; // Get the category ID from the URL parameters
    // Check if the category ID is provided
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    // Check if the category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Delete the category
    await Category.deleteOne({ _id: id });
    res.status(200).json("Deleted");
  } catch {
    res.status(400).json({ message: "Can't delete the category" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { Username, userID } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Username is required" });
    }

    let accountDeleted = false;

    const existingAdmin = await adminModel.findOne({ Username });
    if (existingAdmin) {
      await adminModel.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});
      accountDeleted = true;
    }

    const existingAdvertiser = await Advertiser.findOne({ Username });
    if (existingAdvertiser) {
      await Advertiser.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});
      accountDeleted = true;
    }

    const existingSeller = await Seller.findOne({ Username });
    if (existingSeller) {
      await Seller.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});
      accountDeleted = true;
    }

    const existingTourGuide = await tourGuide.findOne({ Username });
    if (existingTourGuide) {
      await tourGuide.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});
      accountDeleted = true;
    }

    const existingTourismGoverner = await TourismGoverner.findOne({ Username });
    if (existingTourismGoverner) {
      await TourismGoverner.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});

      accountDeleted = true;
    }

    const existingTourist = await tourist.findOne({ Username });
    
    if (existingTourist) {
      await tourist.deleteOne({ Username });
      await bookings.deleteMany({userId : userID});
      await Comment.deleteMany({userId : userID});
      await Rating.deleteMany({userId : userID});
      await BookedFlights.deleteMany({userId : userID});
      await BookedHotel.deleteMany({userId : userID});
      await orderModel.deleteMany({userId : userID});
      await Review.deleteMany({userId : userID});
      await Complaints.deleteMany({Maker : userID});
      await BookedMarks.deleteMany({userId : userID});
      await address.deleteMany({userId : userID});
      await cart.deleteMany({touristID : userID});
      await wishlist.deleteMany({userId : userID});
      await notifications.deleteMany({userID : userID});
      await attractions.deleteMany({Creator : userID});
      await Itinerary.deleteMany({Creator : userID});
      await Product.deleteMany({Seller : userID});
      await promocode.deleteMany({assignedTo : userID});
      await sales.deleteMany({user : userID});
      await transportations.deleteMany({advertiserId : userID});
      await PdfDetails.deleteMany({Owner : userID});

      accountDeleted = true;
    }

    if (!accountDeleted) {
      return res.status(400).json({ message: "User not found in any system" });
    }
    await userModel.deleteOne({ Username });

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(400)
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
    await userModel.create({
      Username: Username,
      userID: userId,
      Type: "TourismGoverner",
    });
    const token = createToken(TourismGov.Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

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

const searchProductsByName = async (req, res) => {
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
    const { price, description, discount, quantity, name } = req.body; // Get updated fields from the request body

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await productModel.findByIdAndUpdate(id, {
      price: price,
      description: description,
      discount: discount,
      quantity,
      name,
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

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id; // Get product ID from request parameters
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch {
    res.status(400).json({ message: "Error to delete product" });
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
    const { Name, icon } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Tag name is required" });
    }
    if (!icon) {
      return res.status(400).json({ message: "Icon is required" });
    }
    const existingTag = await PreferenceTags.findOne({ Name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    // Create the category
    const Tag = await PreferenceTags.create({ Name, icon });

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
    const tagWithSameName = await PreferenceTags.findOne({ Name: newName });
    if (tagWithSameName) {
      return res
        .status(400)
        .json({ message: "Tag with this new name already exists" });
    }

    // Update the category name
    existingTag.Name = newName;
    await existingTag.save();

    res.status(200).json(existingTag);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can't update the Tag" });
  }
};

const updatePreferenceTagById = async (req, res) => {
  try {
    const { id } = req.params; // Get the category ID from the URL parameters
    const { newName } = req.body; // Get the new category name from the request body
    // Check if the ID and new name are provided
    if (!id || !newName) {
      return res.status(400).json("Id, name are required");
    }
    // Check if the category with the given ID exists
    const category = await PreferenceTags.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Check if the new category name already exists
    const categoryWithSameName = await PreferenceTags.findOne({
      Name: newName,
    });
    if (categoryWithSameName) {
      return res
        .status(400)
        .json({ message: "Category with this new name already exists" });
    }
    // Update the category name
    category.Name = newName;
    await category.save();
    res.status(200).json(category);
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

const deletPreferenceTagsById = async (req, res) => {
  try {
    const { id } = req.params; // Get the category ID from the URL parameters
    // Check if the category ID is provided
    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }
    // Check if the category exists
    const existingCategory = await PreferenceTags.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Tag not found" });
    }
    // Delete the category
    await PreferenceTags.deleteOne({ _id: id });
    res.status(200).json("Deleted");
  } catch {
    res.status(400).json({ message: "Can't delete the Tag" });
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
const getAirports = async (req, res) => {
  try {
    const db = mongoose.connection; // Get the current database connection
    const collection = db.collection("AirportsLookUp"); // Access the AirportsLookUp collection
    console.log(collection);
    const airports = await collection.find({}).toArray(); // Convert cursor to an array
    res.status(200).json(airports); // Send the airports as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching airports", error }); // Handle any errors
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

const getAdminID = async (req, res) => {
  try {
    const { Username } = req.body;

    const user = await userModel.findOne({ Username: Username });
    res.status(200).json({ userID: user.userId }); // Send user as JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const getCategories = async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection("categories");
    const categories = await collection.find({}).toArray();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const getTags = async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection("tags");
    const Tags = await collection.find({}).toArray();

    res.status(200).json(Tags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

/////////////////////Sprint 2 Nadeem/////////////////////////////////
const replytoComplaints = async (req, res) => {
  const { complaintId } = req.params;
  const { Body } = req.body;

  if (!Body) {
    return res.status(400).json({ message: "Body is required for the reply" });
  }

  try {
    // Find the complaint by its ID
    const complaint = await Complaints.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Create the reply object
    const reply = {
      Body,
      Date: Date.now(),
    };

    // Update the reply field in the complaint
    complaint.reply = reply;

    // Save the updated complaint with the reply
    await complaint.save();

    return res
      .status(200)
      .json({ message: "Reply added successfully", complaint });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComplaint = async (req, res) => {
  const { complaintId } = req.params;
  try {
    // Find the complaint by its ID
    const complaint = await Complaints.findByIdAndDelete(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    // Delete the complaint

    return res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error(error);
  }
};

///////////////////////////////////////////////////////////////////////

//////////////////Sprint 2 Donny
const acceptRejectUser = async (req, res) => {
  try {
    const { userId, decision } = req.body; // userType can be 'tourGuide', 'advertiser', or 'seller'
    // Find the user based on userType
    const user = await userModel.findOne({ userID: userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    let userLogged;
    switch (user.Type) {
      case "Seller":
        userLogged = await sellerModel.findOne({ _id: userId });
        break;
      case "TourGuide":
        userLogged = await tourGuideModel.findOne({ _id: userId });
        break;
      case "Advertiser":
        userLogged = await advertiserModel.findOne({ _id: userId });
        break;
    }
    // Check if the user exists
    if (!userLogged) {
      return res.status(404).json({ message: `not found` });
    }

    // Update the user status based on decision
    if (decision === "accept") {
      userLogged.status = "accepted";
    } else if (decision === "reject") {
      userLogged.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid decision" });
    }

    // Save the updated user
    await userLogged.save();
    res.status(200).json({ message: "status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user status" });
  }
};

const AdminarchiveProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from request parameters
    const { isArchived } = req.body; // Get the new archive status from request body

    // Find the product by ID and update its isArchived status
    const product = await productModel.findByIdAndUpdate(
      productId,
      { isArchived },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const status = isArchived ? "archived" : "unarchived";
    res
      .status(200)
      .json({ message: `Product ${status} successfully!`, product });
  } catch (err) {
    console.error("Error archiving/unarchiving product:", err);
    res.status(400).json({ error: "Failed to archive/unarchive product." });
  }
};
/////////////////////////////////////////////////////

const uploadProductImage = async (req, res) => {
  try {
    const { productId } = req.params; // Extract the product ID from the URL params

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Find the product by ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Update the product's image
    product.picture = {
      data: req.file.buffer, // Store the uploaded image as a buffer
      contentType: req.file.mimetype, // Set the content type (e.g., image/png)
    };

    // Save the updated product
    await product.save();

    res
      .status(200)
      .json({ message: "Product image uploaded successfully!", product });
  } catch (err) {
    console.error("Error uploading product image:", err);
    res.status(500).json({ error: "Failed to upload product image." });
  }
};

const viewDocuments = async (req, res) => {
  try {
    // Step 1: Get all unique ownerIds in the collection
    const distinctOwners = await PdfDetails.distinct("Owner");

    // Step 2: Prepare a response object to hold all documents grouped by ownerId
    const allDocuments = [];

    // Step 3: Fetch documents for each distinct ownerId
    for (const ownerId of distinctOwners) {
      // Fetch all documents associated with the owner, filtered by status
      const documents = await PdfDetails.find({ Owner: ownerId }).populate({
        path: "Owner",
        match: { status: "pending" }, // Filter owners with "pending" status
      });

      // Filter out documents where Owner is null (because the status did not match)
      const filteredDocuments = documents.filter((doc) => doc.Owner !== null);

      // If there are filtered documents, group them by ownerId
      if (filteredDocuments.length > 0) {
        const ownerDocuments = {
          ownerId: ownerId, // Include the ownerId
          role: filteredDocuments[0].ownerModel, // Assuming the role is the same for all docs from the same owner
          Owner: filteredDocuments[0].Owner, // The owner info is the same for all docs
          documents: filteredDocuments.map((doc) => ({
            Title: doc.Title,
            pdf: doc.pdf, // Base64 string of the PDF
          })),
        };

        // Add this owner with their documents to the response array
        allDocuments.push(ownerDocuments);
      }
    }

    // Step 4: Send back all documents grouped by ownerId
    return res.status(200).json({
      message: "Documents retrieved successfully.",
      documents: allDocuments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving documents." });
  }
};

const markComplaintAsResolved = async (req, res) => {
  const { complaintId } = req.params; // Extract complaint ID from the request parameters

  try {
    // Find the complaint by its ID
    const complaint = await Complaints.findById(complaintId);

    // Check if the complaint was found
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the status to "Resolved"
    complaint.Status = "Resolved";

    // Save the updated complaint
    const updatedComplaint = await complaint.save();

    // Send a response with the updated complaint
    return res.status(200).json({
      message: "Complaint status updated to resolved",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const markComplaintAsPending = async (req, res) => {
  const { complaintId } = req.params; // Extract complaint ID from the request parameters

  try {
    // Find the complaint by its ID
    const complaint = await Complaints.findById(complaintId);

    // Check if the complaint was found
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the status to "Resolved"
    complaint.Status = "Pending";

    // Save the updated complaint
    const updatedComplaint = await complaint.save();

    // Send a response with the updated complaint
    return res.status(200).json({
      message: "Complaint status updated to pending",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const viewAllComplaints = async (req, res) => {
  try {
    // Step 1: Fetch all complaints from the database
    const complaints = await Complaints.find(); // Fetches all complaints

    // Step 2: Check if there are no complaints
    if (!complaints || complaints.length === 0) {
      return res
        .status(200)
        .json({ message: "No complaints found.", complaints: [] });
    }

    // Step 3: Map through the complaints to prepare the response
    const complaintList = complaints.map((complaint) => ({
      id: complaint._id, // Unique complaint ID
      Title: complaint.Title, // Complaint title
      Body: complaint.Body, // Complaint body text
      Date: complaint.Date, // Date when the complaint was made
      Status: complaint.Status, // Status (pending/resolved)
      Maker: complaint.Maker,
    }));

    // Step 4: Return the list of complaints with their statuses
    return res.status(200).json({
      message: "Complaints retrieved successfully.",
      complaints: complaintList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const changePasswordAdmin = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields (id, oldPassword, newPassword) are required",
      });
    }

    // Find the admin by id
    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, admin.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    if (!salt || !newPassword) {
      console.error("Salt or newPassword is not defined");
      return res
        .status(500)
        .json({ message: "Server error during password hashing" });
    }
    console.log("Hashing new password with salt:", salt);

    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    admin.Password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePasswordAdmin:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const checkUserName = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await userModel.findOne({ Username: username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    return res.status(200).json({ message: "Username is available" });
  } catch (error) {
    console.error(error);
  }
};

const viewComplaintDetails = async (req, res) => {
  const { complaintId } = req.params; // Extract complaint ID from request parameters

  try {
    // Find the complaint by its ID
    const complaint = await Complaints.findById(complaintId);

    // Check if the complaint exists
    if (!complaint) {
      return res.status(400).json({ message: "Complaint not found" });
    }

    // Return the complaint details
    return res.status(200).json({
      message: "Complaint details retrieved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error retrieving complaint details:", error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

const viewProductSalesAndQuantity = async (req, res) => {
  try {
    // Fetch all products with their available quantity and sales information
    const products = await productModel.find({}, "name quantity sales"); // Adjust the fields as necessary

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    // Prepare the response to include only relevant information
    const productDetails = products.map((product) => ({
      name: product.name,
      availableQuantity: product.quantity,
      // Assuming 'sales' is a field in your product schema
    }));

    // Return the product details
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error fetching product sales and quantity:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const flagEventOrItinerary = async (req, res) => {
  const { id, type } = req.body; // Expecting the ID and type of the item (event or itinerary)

  if (!id || !type) {
    return res.status(400).json({ message: "ID and type are required." });
  }

  try {
    let updateData = {};

    // Determine which model to use based on the type
    if (type === "event") {
      // Check the current flag status of the event
      const event = await attractions.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      // Toggle the flag
      updateData.isFlagged = !event.isFlagged;

      const updatedItem = await attractions.findByIdAndUpdate(
        id,
        { $set: { isFlagged: updateData.isFlagged } }, // Dynamically toggle the `isFlagged` field
        { new: true, runValidators: true } // Return the updated document and run validations
      );

      // Notify the creator about the flag change
      await notifyAdvertiser(updatedItem.Creator, id);
      res.status(200).json({
        message: `Event ${
          updatedItem.isFlagged ? "flagged" : "unflagged"
        } successfully.`,
        updatedItem, // Return the updated item with the `isFlagged` field
      });
    } else if (type === "itinerary") {
      // Check the current flag status of the itinerary
      const itinerary = await Itinerary.findById(id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found." });
      }

      // Toggle the flag
      updateData.isFlagged = !itinerary.isFlagged;

      const updatedItem = await Itinerary.findByIdAndUpdate(
        id,
        { $set: { isFlagged: updateData.isFlagged } }, // Dynamically toggle the `isFlagged` field
        { new: true, runValidators: true } // Return the updated document and run validations
      );

      // Notify the creator about the flag change
      await notifyTourGuide(updatedItem.Creator, id);
      res.status(200).json({
        message: `Itinerary ${
          updatedItem.isFlagged ? "flagged" : "unflagged"
        } successfully.`,
        updatedItem, // Return the updated item with the `isFlagged` field
      });
    } else {
      return res.status(400).json({ message: "Invalid type specified." });
    }
  } catch (error) {
    console.error("Error flagging item:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsernames = async (req, res) => {
  try {
    // Fetch usernames from all collections in parallel
    const [advertisers, tourGuides, sellers] = await Promise.all([
      Advertiser.find().select("Username"), // Only select the "Username" field
      tourGuide.find().select("Username"),
      Seller.find().select("Username"),
    ]);

    // Extract usernames from each collection
    const usernames = [
      ...advertisers.map((advertiser) => advertiser.Username),
      ...tourGuides.map((tourGuide) => tourGuide.Username),
      ...sellers.map((seller) => seller.Username),
    ];

    // Respond with the collected usernames
    res.status(200).json({ usernames });
  } catch (error) {
    res.status(400).json({ message: "Error fetching usernames" });
  }
};

const getDistinctOwners = async (req, res) => {
  try {
    // Step 1: Fetch distinct owner IDs from the PdfDetails collection
    const distinctOwnerIds = await PdfDetails.distinct("Owner");

    // Step 2: Check if there are any owners found
    if (!distinctOwnerIds || distinctOwnerIds.length === 0) {
      return res.status(404).json({ message: "No distinct owner IDs found." });
    }

    // Step 3: Fetch usernames for each distinct ownerId
    const ownersWithUsernames = await userModel.find(
      { _id: { $in: distinctOwnerIds } }, // Find users whose _id is in the list of distinct ownerIds
      "Username" // Only retrieve the Username field
    );

    // Step 4: Map the results to match ownerId with Username
    const ownerDetails = ownersWithUsernames.map((user) => ({
      ownerId: user._id,
      username: user.Username,
    }));

    // Step 5: Send the owner details back to the client
    return res.status(200).json({
      message: "Owner usernames retrieved successfully.",
      owners: ownerDetails,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving owner usernames." });
  }
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: maxAge,
  });
};

const login = async (req, res) => {
  try {
    const { Username, Password, rememberMe } = req.body;

    // Check if both fields are provided
    if (!Username || !Password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    const user = await userModel.findOne({ Username: Username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    let userLogged;
    let status = "";
    switch (user.Type) {
      case "Admin":
        userLogged = await adminModel.findOne({ Username: Username });
        break;
      case "Tourist":
        userLogged = await touristModel.findOne({ Username: Username });
        break;
      case "Seller":
        userLogged = await sellerModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
      case "TourGuide":
        userLogged = await tourGuideModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
      case "TourismGoverner":
        userLogged = await TourismGoverner.findOne({ Username: Username });
        break;
      case "Advertiser":
        userLogged = await advertiserModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
    }

    // Check if the admin exists in the database
    if (!userLogged) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const saltRounds = 10;
    const isPasswordValid = await bcrypt.compare(Password, userLogged.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    // Create a session or token (if using JWT, generate a token here)
    // Example using JWT:
    const token = createToken(userLogged.Username);
    const cookieOptions = {
      httpOnly: true,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ Username: Username, Type: user.Type, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

const getUsername = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await userModel.findOne({ userID: userid });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user.Username);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "User not found" });
  }
};

const forgetPassword = async (req, res) => {
  const { Username, OTP, ExpirationTime } = req.body;
  try {
    const user = await userModel.findOne({ Username: Username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const email = user.Email;
    const type = user.Type;
    await otpModel.create({
      email,
      otp: OTP,
      expiration: ExpirationTime,
    });
    res.status(200).json({ Email: email, Type: type });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "An error occurred during OTP generation" });
  }
};

const validateOtp = async (req, res) => {
  const { Username, OTP } = req.body;

  try {
    // Find the user by Username
    const user = await userModel.findOne({ Username: Username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const email = user.Email;

    // Find the OTP record for the user's email
    const otpRecord = await otpModel.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // Check if the OTP matches
    if (otpRecord.otp !== OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > otpRecord.expiration) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    await otpModel.deleteOne({ email });
    // OTP is valid
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred during OTP validation" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, type, newPassword } = req.body;

    // Validate inputs
    if (!newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let user;

    switch (type) {
      case "Admin":
        user = await adminModel.findOne({ Username: username });
        break;
      case "Tourist":
        user = await touristModel.findOne({ Username: username });
        break;
      case "TourGuide":
        user = await tourGuideModel.findOne({ Username: username });
        break;
      case "Seller":
        user = await sellerModel.findOne({ Username: username });
        break;
      case "Advertiser":
        user = await advertiserModel.findOne({ Username: username });
        break;
      case "TourismGoverner":
        user = await TourismGoverner.findOne(TourismGoverner);
        break;
    }

    // Find the admin by id
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    if (!salt || !newPassword) {
      console.error("Salt or newPassword is not defined");
      return res
        .status(500)
        .json({ message: "Server error during password hashing" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.Password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
///////////////////////////Nadeem Sprint 3//////////////////////////
const createPromoCode = async (req, res) => {
  try {
    const { code, expiryDate, assignedTo, isUsed } = req.body;
    const promoCode = await PromoCode.create({
      code,
      expiryDate,
      assignedTo,
      isUsed,
    });
    return res
      .status(201)
      .json({ message: "Promo code created successfully", promoCode });
  } catch (error) {
    console.error("Error in createPromoCode:", error);
    return res
      .status(500)
      .json({ message: "Error creating promo code", error: error.message });
  }
};

const viewAllUsers = async (req, res) => {
  try {
    // Get the total number of users
    const totalUsers = await Users.countDocuments();
    // Aggregate to find new users per month
    const newUsersPerMonth = await Users.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
    ]);

    // Respond with the results
    res.status(200).json({
      totalUsers,
      newUsersPerMonth,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

///////////////////////////Nadeem Sprint 3//////////////////////////

const sendOutOfStockNotificationAdmin = async (req, res) => {
  try {
    // Destructure data from the request body
    const { message, adminId, productId,productName } = req.body;

    if (!message || !adminId) {
      return res
        .status(400)
        .json({ error: "Message, adminId, and productId are required." });
    }

    // Find or update the notification for the specified admin
    const notification = await Notification.findOneAndUpdate(
      { userID: adminId },
      {
        $push: {
          notifications: {
            aboutID: productId,
            aboutModel: "Product",
            message,
          },
        },
      },
      { upsert: true, new: true } // Create a new document if it doesn't exist
    )
    const user = await userModel.findOne({ userID: adminId });
    console.log(process.env.EMAILJS_SERVICE_ID_2);
    let data = {
      service_id: process.env.EMAILJS_SERVICE_ID_2,
      template_id: "template_duqg74i",
      user_id: process.env.EMAILJS_USER_ID_2,
      accessToken: process.env.EMAILJS_PRIVATE_KEY_2,
      template_params: {
        to_email: user.Email,
        product_name: productName,
        restock_alert_link: "http://localhost:3000/loginPage",
      }
      };
    
    const reply = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.EMAILJS_PRIVATE_KEY_2}`,
      },
      body: JSON.stringify(data),
    });
    console.log(reply);

    res.status(200).json({
      message: "Notification added successfully for admin.",
      notification,
    });

  } catch (error) {
    console.error("Error adding notification for admin:", error);
    res.status(500).json({ error: "Failed to add notification for admin." });
  }
};

const updateRevenueSales = async (req, res) => {
  const { userID, userModel, amount } = req.body;

  // Validate input
  if (!userID || !userModel || !amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: userID, userModel, or amount",
    });
  }

  try {
    // Check if the user already exists in the Sales table
    let salesRecord = await Sales.findOne({ user: userID, userModel });

    if (salesRecord) {
      // If the user exists, update the revenue
      salesRecord.revenue += amount;
      await salesRecord.save();

      return res.status(200).json({
        success: true,
        message: "Revenue updated successfully",
        sales: salesRecord,
      });
    } else {
      // If the user doesn't exist, create a new record
      salesRecord = new Sales({
        user: userID,
        userModel,
        revenue: amount,
      });

      await salesRecord.save();

      return res.status(201).json({
        success: true,
        message: "Sales record created successfully",
        sales: salesRecord,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating sales record",
      error: error.message,
    });
  }
};

const viewAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("products")
      .populate("userId")
      .sort({ date: -1 });
    return res.status(200).json(orders);
  } catch {
    return res.status(400).json("ERROR");
  }
};

const getTourists = async (req, res) => {
  try {
    const tourists = await touristModel.find();
    return res.status(200).json(tourists);
  } catch {
    return res.status(400).json("ERROR");
  }
};
const getadvertisers = async (req, res) => {
  try {
    const advertisers = await advertiserModel.find();
    return res.status(200).json(advertisers);
  } catch {
    return res.status(400).json("ERROR");
  }
};
const getsellers = async (req, res) => {
  try {
    const sellers = await sellerModel.find();
    return res.status(200).json(sellers);
  } catch {
    return res.status(400).json("ERROR");
  }
};
const gettourguides = async (req, res) => {
  try {
    const tourGuides = await tourGuideModel.find();
    return res.status(200).JSON(tourGuides);
  } catch {
    return res.status(400).json("ERROR");
  }
};
const gettourismgov = async (req, res) => {
  try {
    const tourismGov = await TourismGoverner.find();
    return res.status(200).json(tourismGov);
  } catch {
    return res.status(400).json("ERROR");
  }
};

const viewTopUsers = async (req, res) => {
  try {
    const topSellers = await salesModel
      .find()
      .populate("user")
      .sort({ revenue: -1 })
      .limit(10);
    return res.status(200).json(topSellers);
  } catch {
    return res.status(400).json("ERROR");
  }
};

const updateProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $inc: { quantity: -quantity } }, // Use $inc to decrement the quantity
      { new: true } // Ensure the returned document is the updated one
    );

    console.log(updatedProduct);

    if(updatedProduct.quantity <= 0){
      await axios.put("http://localhost:8000/sendOutOfStockNotificationAdmin",{
        message: `Be aware Product ${updatedProduct.name} is out of stock`,
        adminId: updatedProduct.seller,
        productId: updatedProduct._id,
        productName: updatedProduct.name
      })
    }

    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(400).json("ERROR");
  }
};

const updateSellerSales = async (req, res) => {
  const { productId, sales } = req.body;
  try {
    const product = await Product.findById(productId);
    const sellerId = product.seller;
    const seller = await salesModel.findOne({ user: sellerId });
    if (!seller) {
      const user = await userModel.findOne({ userID: sellerId });
      const type = user.Type;
      const newSales = new salesModel({
        user: sellerId,
        userModel: type,
        revenue: sales,
      });
      await newSales.save();
    } else {
      seller.revenue = sales + seller.revenue;
      await seller.save();
      return res.status(200).json(seller);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("ERROR");
  }
};

const emptyCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json("Cart not found");
    }
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(400).json("ERROR");
  }
};

const getRevenue = async (req, res) => {
  const {userID} = req.params;
  try{
    const sales = await Sales.findOne({user: userID});
    return res.status(200).json(sales.revenue);
  }catch{
    res.status(400).json("ERROR");
  }
}

const getEmail = async (req, res) => {
  const {userID} = req.params;
  try{
    const response = await userModel.findOne({userID});
    return res.status(200).json(response);
  }catch{
    res.status(400).json("Error");
  }
}

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
  searchProductsByName,
  UpdateProduct,
  filterProductsByPrice,
  createPreferenceTags,
  updatePreferenceTags,
  deletePreferenceTags,
  readPreferenceTags,
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
  viewAllUsers,
  sendOutOfStockNotificationAdmin,
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
  updateSellerSales,
  updateProductQuantity,
  emptyCart,
  getRevenue,
  getEmail
};
