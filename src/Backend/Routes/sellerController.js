const sellerModel = require("../Models/seller.js"); 
const { default: mongoose } = require('mongoose');

// Creating a seller
const createSeller = async (req, res) => {
    try {
        const { Username, Password } = req.body; 
        const seller = await sellerModel.create({ UserName: Username, Password });
        res.status(200).json(seller);
    } catch (err) {
        console.error(err); 
        res.status(400).json({ message: "Can't create the seller" });
    }
};

//Updating a seller
const updateSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { Username, Password } = req.body;
        const seller = await sellerModel.findByIdAndUpdate(id, { UserName: Username, Password }, { new:
            true });
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
        const { id } = req.params;
        const seller = await sellerModel.findById(id);
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

module.exports = { createSeller, updateSeller, readSeller };
