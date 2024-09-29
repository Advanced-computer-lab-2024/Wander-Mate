const sellerModel = require("../Models/seller.js"); 
const { default: mongoose } = require('mongoose');
const bcrypt = require("bcrypt");

// Creating a seller
// const createSeller = async (req, res) => {
//     try {
//         const { UserName, /*FullName,*/ Password, Description} = req.body;

//         // Validate input
//         if (!UserName || typeof UserName !== 'string' || !Password || typeof Password !== 'string') {
//             return res.status(400).json({ message: "Invalid input: Username and Password are required and should be strings." });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(Password, saltRounds);

//         const seller = await sellerModel.create({ UserName, Password: hashedPassword, Description: Description});
//         res.status(200).json(seller);
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ message: "Can't create the seller" });
//     }
// };

const createSeller = async (req, res) => {
    try {
        const { Username, Password, Email } = req.body;

        // Check if Username, Password, and Email are provided
        if (!Username || !Password || !Email) {
            return res.status(400).json({ message: "Username, Password, and Email are all required" });
        }

        // Check if Username or Email already exists
        const existingSeller = await sellerModel.findOne({
            $or: [{ UserName: Username }, { Email: Email }]
        });

        if (existingSeller) {
            return res.status(400).json({ message: "Seller already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Create the seller using the hashed password
        const seller = await sellerModel.create({ UserName: Username, Password: hashedPassword, Email: Email });

        res.status(200).json(seller);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Can't create the seller" });
    }
};



//Updating a seller
const updateSeller = async (req, res) => {
    try {
        const { UserName, FullName, Description } = req.body;
        const seller = await sellerModel.findOneAndUpdate({ UserName },{FullName, Description});
            if(!seller){
                return res.status(404).json({ message: "Seller not found" });
            }
            else{
            res.status(200).json(seller);
            }
            } catch (err) {
                console.error(err);
                res.status(400).json({ message: "Can't update the seller" });
                }
            }

//Reading a seller
const readSeller = async (req, res) => {
    try {
        const { UserName, Password, Description } = req.body;
        const seller = await sellerModel.find({UserName});
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        else{
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


module.exports = { createSeller, updateSeller, readSeller,viewSellerProducts };
