const adminModel = require("../Models/admin.js"); 
const mongoose = require('mongoose');

// Creating an admin
const createAdmin = async (req, res) => {
    try {
        const { Username, Password } = req.body; 
        const admin = await adminModel.create({ UserName: Username, Password });
        res.status(200).json(admin);
    } catch (err) {
        console.error(err); 
        res.status(400).json({ message: "Can't create the seller" });
    }
};

module.exports = { createAdmin};
