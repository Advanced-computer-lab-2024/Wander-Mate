const sellerModel = require("../Models/seller.js");
const ProductModel = require("../Models/products.js");
const OrderModel = require("../Models/order.js");
const userModel = require("../Models/users.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { query } = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bookingSchema = require("../Models/bookings.js");
const PdfDetails = require("../Models/pdfDetails.js");
const Notification = require("../Models/notifications.js");
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
    const { Username, Password, Email, Description, FullName } = req.body;

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
      FullName,
    });

    const userID = seller._id;
    const token = createToken(Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    await userModel.create({
      Username: Username,
      userID,
      Type: "Seller",
      Email,
    });

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

const viewProductsOfSeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // Get the username from query parameters
    const products = await ProductModel.find({ seller: sellerId }); // Query the database
    res.status(200).json(products);
  } catch {
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
    const product = await ProductModel.create({
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
const getSellerById = async (req, res) => {
  const { sellerId } = req.params; // Extract sellerId from request parameters
  try {
    const seller = await sellerModel.findById(sellerId).select("-Password"); // Fetch seller info excluding Password
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json({ seller });
  } catch (error) {
    res.status(400).json({
      message: "Error fetching seller information",
      error: error.message,
    });
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

    res
      .status(200)
      .json({ message: "Product image uploaded successfully!", product });
  } catch (err) {
    console.error("Error uploading product image:", err);
    res.status(500).json({ error: "Failed to upload product image." });
  }
};

const SellerarchiveProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from request parameters
    const { isArchived } = req.body; // Get the new archive status from request body

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
    res
      .status(200)
      .json({ message: `Product ${status} successfully!`, product });
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
      return res
        .status(404)
        .json({ message: "Seller not found or already deleted" });
    }

    // Check for upcoming paid bookings
    // const currentDate = new Date();
    // const upcomingBookings = await bookingSchema.find({
    //   userId: sellerID,
    //   paid: true,
    //   bookedDate: { $gte: currentDate }
    // });

    // if (upcomingBookings.length > 0) {
    //   return res.status(400).json({
    //     message: "Account cannot be deleted. There are upcoming bookings that are paid for."
    //   });
    // }

    // // Mark the account as deleted (soft delete)
    // seller.isDeleted = true;
    // await seller.save();

    // Hide all associated products
    await sellerModel.findByIdAndDelete(sellerID);
    await userModel.findOneAndDelete({ userID: sellerID });
    await ProductModel.deleteMany({ seller: sellerID });

    res.status(200).json({
      message:
        "Account deletion requested successfully. Profile and associated products will no longer be visible.",
    });
  } catch (error) {
    console.error("Error processing account deletion request:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
    const products = await ProductModel.find(
      { Seller: sellerID },
      "name quantity sales"
    ); // Adjust the fields as necessary

    // Check if products exist
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller." });
    }

    // Prepare the response to include only relevant information
    const productDetails = products.map((product) => ({
      name: product.name,
      availableQuantity: product.quantity,
      sales: product.sales, // Assuming 'sales' is a field in your product schema
    }));

    // Return the product details
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error fetching seller product sales and quantity:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getSellerImage = async (req, res) => {
  try {
    const { sellerID } = req.params; // Get the guide ID from the request parameters

    // Find the guide by ID
    const seller = await sellerModel.findById(sellerID);

    // Check if guide exists
    if (
      !seller ||
      !seller.picture ||
      !seller.picture.data ||
      !seller.picture.data.buffer
    ) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Extract the buffer from the Binary object
    const imageBuffer = seller.picture.data.buffer;

    // Set the content type for the image
    res.set("Content-Type", seller.picture.contentType);

    // Send the image data as a buffer
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

const sendOutOfStockNotificationSeller = async (req, res) => {
  try {
    // Destructure data from the request body
    const { message, sellerId, productId, productName } = req.body;

    if (!message || !sellerId) {
      return res
        .status(400)
        .json({ error: "Message, sellerId, and productId are required." });
    }

    // Find or update the notification for the specified admin
    const notification = await Notification.findOneAndUpdate(
      { userID: sellerId, userModel: "Seller" },
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
    ).populate("userID");

    let data = {
      service_id: process.env.EMAILJS_SERVICE_ID_2,
      template_id: "template_duqg74i",
      user_id: process.env.EMAILJS_USER_ID_2,
      accessToken: process.env.EMAILJS_PRIVATE_KEY_2,
      template_params: {
        to_email: notification.userID.Email,
        product_name: productName,
        restock_alert_link: "http://localhost:3000/loginPage",
        logo_url:
          "https://drive.google.com/uc?id=1XRUvHmFG98cHMtw8ZlSf61uAwtKlkQJo",
      },
    };
    const reply = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.EMAILJS_PRIVATE_KEY_2}`,
      },
      body: JSON.stringify(data),
    });

    res.status(200).json({
      message: "Notification added successfully for seller.",
      notification,
    });

    console.log("Notification added for seller:", notification);
  } catch (error) {
    console.error("Error adding notification for seller:", error);
    res.status(500).json({ error: "Failed to add notification for seller." });
  }
};

const getSalesReport = async (req, res) => {
  const { sellerId } = req.params;
  try {
    // Step 1: Get all products by the seller
    const sellerProducts = await ProductModel.find({ seller: sellerId }).select(
      "_id name"
    );
    const productIds = sellerProducts.map((product) => product._id);

    if (sellerProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller." });
    }

    // Step 2: Aggregate orders containing the seller's products
    const salesData = await OrderModel.aggregate([
      {
        $match: {
          products: { $in: productIds }, // Orders containing seller's products
          status: { $in: ["shipped", "delivered", "pending", "cancelled"] }, // Include relevant statuses
        },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true }, // Unwind products
      },
      {
        $unwind: { path: "$quantities", preserveNullAndEmptyArrays: true }, // Unwind quantities to align with products
      },
      {
        $lookup: {
          from: "products", // Join with Product collection
          localField: "products",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Unwind product details
      },
      {
        $match: {
          products: { $in: productIds }, // Ensure seller's products are included
        },
      },
      {
        $group: {
          _id: { productId: "$products", purchaseDate: "$date" }, // Group by product ID and date
          totalQuantity: { $sum: { $ifNull: ["$quantities", 1] } }, // Sum quantities, default to 1 if missing
          totalRevenue: {
            $sum: { $multiply: ["$quantities", "$productDetails.price"] },
          }, // Calculate revenue
        },
      },
      {
        $lookup: {
          from: "products", // Join for product details
          localField: "_id.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Unwind product details
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          productName: "$productDetails.name",
          purchaseDate: "$_id.purchaseDate", // Include purchase date
          totalQuantity: 1,
          totalRevenue: {
            $multiply: ["$totalQuantity", "$productDetails.price"],
          },
        },
      },
    ]);

    if (salesData.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales data found for this seller." });
    }

    // Step 3: Send response
    res.status(200).json({
      message: "Sales report generated successfully.",
      salesReport: salesData,
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res
      .status(500)
      .json({ message: "Server error while generating sales report." });
  }
};

const getSellerDocuments = async (req, res) => {
  try {
    const ownerId = req.params.ownerId; // Get the ownerId from the request parameters

    // Fetch the documents from the database where the owner is the TourGuide and the model is "TourGuide"
    const documents = await PdfDetails.find({
      Owner: ownerId,
      ownerModel: "Seller",
    });



    // Return the fetched documents
    return res.status(200).json({
      message: "Documents fetched successfully!",
      documents: documents,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error fetching documents" });
  }
};

const viewMyNotificationsSeller  = async (req, res) => {
  const { sellerId } = req.params; // Assuming the tourist ID is passed as a URL parameter

  try {
    // Find the notifications for the given tourist ID
    const notifications = await Notification.findOne({ userID: sellerId });

    if (!notifications || notifications.notifications.length === 0) {
      return res.status(201).json({
        message: "No notifications found for this Tour Guide.",
      });
    }

    res.status(200).json({
      message: "Notifications retrieved successfully.",
      notifications: notifications.notifications, // Return all the notifications array for the tourist
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeNotificationSeller  = async (req, res) => {
  const { sellerId, notificationId } = req.params; // Get touristId and notificationId from the request body
  try {
    // Validate input
    if (!sellerId || !notificationId) {
      return res
        .status(400)
        .json({ message: "Tour Guide ID and Notification ID are required." });
    }

    // Validate that the touristId and notificationId are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(sellerId) ||
      !mongoose.Types.ObjectId.isValid(notificationId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Tourist ID or Notification ID." });
    }

    // Find the notification document for the given tourist ID
    const notificationDoc = await Notification.findOne({ userID: sellerId });

    if (!notificationDoc) {
      return res
        .status(404)
        .json({ message: "No notifications found for this tourist." });
    }

    // Find the index of the notification to remove by notificationId
    const notificationIndex = notificationDoc.notifications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Notification not found in the list." });
    }

    // Remove the notification from the array
    notificationDoc.notifications.splice(notificationIndex, 1);

    // Save the updated notification document
    await notificationDoc.save();

    res.status(200).json({
      message: "Notification removed successfully.",
      notifications: notificationDoc.notifications, // Return the updated notifications array
    });
  } catch (error) {
    console.error("Error removing notification:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const markNotificationAsReadSeller = async (req, res) => {
  const { userID, notificationId } = req.params;

  try {
    // Validate input
    if (!userID || !notificationId) {
      return res
        .status(400)
        .json({ message: "UserID and NotificationID are required." });
    }

    // Step 1: Find the user notification document by userID
    const notificationDocument = await Notification.findOne({ userID: userID });

    if (!notificationDocument) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user." });
    }

    // Step 2: Find the specific notification by notificationId
    const notification = notificationDocument.notifications.find(
      (notif) => notif._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Step 3: Check if isRead is not defined, set it to false if undefined
    if (notification.isRead === undefined) {
      notification.isRead = false;
    }

    // Step 4: Mark the notification as read (set isRead to true)
    notification.isRead = true;

    // Step 5: Save the updated notifications array in the user document
    await notificationDocument.save();

    // Step 6: Respond with a success message
    res.status(200).json({
      message: "Notification marked as read successfully.",
      notification: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getTotalQuantitiesForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // Extract sellerId from route parameters

    // Step 1: Fetch the seller's products
    const sellerProducts = await ProductModel.find({ seller: sellerId }).select('_id name price');
    
    if (sellerProducts.length === 0) {
      return res.status(404).json({ message: "No products found for the seller Alah." });
    }

    // Create a map for product details
    const productDetailsMap = sellerProducts.reduce((map, product) => {
      map[product._id.toString()] = {
        name: product.name,
        price: product.price,
      };
      return map;
    }, {});

    // Step 2: Fetch total quantities sold for the seller's products
    const productIds = sellerProducts.map(product => product._id);
    
    const result = await OrderModel.aggregate([
      {
        $match: {
          products: { $exists: true, $ne: [] },
          quantities: { $exists: true, $ne: [] },
        },
      },
      {
        $project: {
          productQuantities: { $zip: { inputs: ["$products", "$quantities"] } },
        },
      },
      {
        $unwind: "$productQuantities",
      },
      {
        $project: {
          productId: { $arrayElemAt: ["$productQuantities", 0] },
          quantity: { $arrayElemAt: ["$productQuantities", 1] },
        },
      },
      {
        $match: { productId: { $in: productIds } },
      },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          totalQuantity: 1,
        },
      },
    ]);

    // Step 3: Combine results with product details
    const response = result.map(item => ({
      productId: item.productId,
      totalQuantity: item.totalQuantity,
      productDetails: productDetailsMap[item.productId.toString()],
    }));

    res.status(200).json({
      message: "Total quantities calculated and populated successfully.",
      data: response,
    });
  } catch (error) {
    console.error("Error calculating total quantities by seller:", error);
    res.status(500).json({
      message: "Server error while calculating total quantities by seller.",
    });
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
  getSellerById,
  sendOutOfStockNotificationSeller,
  viewProductsOfSeller,
  getSalesReport,
  getSellerDocuments,
  viewMyNotificationsSeller,
  removeNotificationSeller,
  markNotificationAsReadSeller,
  getTotalQuantitiesForSeller
};
