const sellerModel = require("../Models/seller.js");
const ProductModel = require("../Models/products.js");
const userModel = require("../Models/users.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { query } = require("express");
const multer = require("multer");
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const bookingSchema = require("../Models/bookings.js"); 
const PdfDetails = require("../Models/pdfDetails.js");
const jwt = require("jsonwebtoken");



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

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, "supersecret", {
    expiresIn: maxAge,
  });
};

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

    const userID = seller._id;
    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    await userModel.create({ Username: Username, userID, Type: "Seller" });

    res.status(200).json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Can't create the seller" });
  }
};

//Updating a seller
const updateSeller = async (req, res) => {
  try {
    const { Username, FullName, Description, MobileNumber } = req.body;
    const seller = await sellerModel.findOneAndUpdate(
      { Username },
      { FullName, Description, MobileNumber }
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

const addProductseller = async (req, res) => {
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

const UpdateProductseller = async (req, res) => {
  try {
    const id = req.params.id; // Get product ID from request parameters
    const { price, description } = req.body; // Get updated fields from the request body

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await ProductModel.findByIdAndUpdate(id, {
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

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch {
    res.status(400).json({ message: "Error to get product" });
  }
};

const getSellers = async (req, res) => {
  try {
    const sellers = await sellerModel.find().select("-Password");
    res.status(200).json({ sellers });
  } catch {
    res.status(400).json({ message: "Error to get sellers" });
  }
};

const uploadSellerDocuments = async (req, res) => {
  if (!req.files) {
    return res.status(400).send("Files are required.");
  }

  try {
    const ownerId = req.body.ownerId;
    const ownerModel = "Seller";
    const idPdf = new PdfDetails({
      Title: "ID",
      pdf: req.files.ID[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    const certPdf = new PdfDetails({
      Title: "Taxation Registery",
      pdf: req.files.docs[0].buffer.toString("base64"),
      Owner: ownerId, // Dynamic owner ID
      ownerModel: ownerModel, // Dynamic owner model
    });
    await idPdf.save();
    await certPdf.save();

    return res.status(200).json({
      message: "Docs are uploaded successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error to upload documents" });
  }
};

const uploadProductImageSeller = async (req, res) => {
  try {
    const { productId } = req.params; // Extract the product ID from the URL params

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Find the product by ID
    const product = await ProductModel.findById(productId);
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

    res.status(200).json({ message: "Product image uploaded successfully!", product });
  } catch (err) {
    console.error("Error uploading product image:", err);
    res.status(500).json({ error: "Failed to upload product image." });
  }
};

const SellerarchiveProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from request parameters
    const { isArchived } = req.body;  // Get the new archive status from request body

    // Find the product by ID and update its isArchived status
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { isArchived },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const status = isArchived ? "archived" : "unarchived";
    res.status(200).json({ message: `Product ${status} successfully!`, product });
  } catch (err) {
    console.error("Error archiving/unarchiving product:", err);
    res.status(400).json({ error: "Failed to archive/unarchive product." });
  }
};

const changePasswordSeller = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Find the tour guide by id
    const seller = await sellerModel.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "seller not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, seller.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    seller.Password = hashedNewPassword;
    await seller.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const requestSellerAccountDeletion = async (req, res) => {
  const { sellerID } = req.params;

  try {
    // Ensure the seller exists
    const seller = await sellerModel.findById(sellerID);
    if (!seller || seller.isDeleted) {
      return res.status(404).json({ message: "Seller not found or already deleted" });
    }

    // Check for upcoming paid bookings
    const currentDate = new Date();
    const upcomingBookings = await bookingSchema.find({
      userId: sellerID,
      paid: true,
      bookedDate: { $gte: currentDate }
    });

    if (upcomingBookings.length > 0) {
      return res.status(400).json({
        message: "Account cannot be deleted. There are upcoming bookings that are paid for."
      });
    }

    // Mark the account as deleted (soft delete)
    seller.isDeleted = true;
    await seller.save();

    // Hide all associated products
    await ProductModel.updateMany({ Seller: sellerID }, { isVisible: false });

    res.status(200).json({
      message: "Account deletion requested successfully. Profile and associated products will no longer be visible."
    });
  } catch (error) {
    console.error("Error processing account deletion request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const uploadPictureseller = async (req, res) => {
  try {
    const { sellerID } = req.params; // Extract the seller ID from the URL params

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Update the seller's image using findByIdAndUpdate
    const updatedSeller = await sellerModel.findByIdAndUpdate(
      sellerID,
      {
        picture: {
          data: req.file.buffer, // Store the uploaded image as a buffer
          contentType: req.file.mimetype, // Set the content type (e.g., image/png)
        },
      },
      { new: true, runValidators: true } // Options: return the updated document and run validation
    );

    // Check if the seller was found and updated
    if (!updatedSeller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    res.status(200).json({
      message: "Seller image uploaded successfully!",
      seller: updatedSeller, // Return the updated seller object
    });
  } catch (err) {
    console.error("Error uploading seller image:", err);
    res.status(500).json({ error: "Failed to upload seller image." });
  }
};

const viewSellerProductSalesAndQuantity = async (req, res) => {
  try {
    const { sellerID } = req.params; // Get the seller ID from the request parameters

    // Fetch all products for the specific seller with their available quantity and sales information
    const products = await ProductModel.find({ Seller: sellerID }, 'name quantity sales'); // Adjust the fields as necessary

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this seller." });
    }

    // Prepare the response to include only relevant information
    const productDetails = products.map(product => ({
      name: product.name,
      availableQuantity: product.quantity,
      sales: product.sales // Assuming 'sales' is a field in your product schema
    }));

    // Return the product details
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error fetching seller product sales and quantity:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getSellerImage = async (req, res) => {
  try {
    const { sellerID } = req.params; // Get the product ID from the request parameters

    // Find the product by ID
    const seller = await sellerModel.findById(sellerID);

    // Check if product exists
    if (!seller || !seller.picture || !seller.picture.data) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Set the content type for the image
    res.set("Content-Type", seller.picture.contentType);

    // Send the image data
    res.send(seller.picture.data);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

module.exports = {
  createSeller,
  updateSeller,
  readSeller,
  viewSellerProducts,
  sortProductsByRatingsseller,
  SellersearchProductByName,
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
};
