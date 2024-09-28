const adminModel = require("../Models/admin.js");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Creating an admin
const createAdmin = async (req, res) => {
    try {
        const { Username, Password } = req.body; 

        
        if (!Username || !Password) {
            return res.status(400).json({ message: "Username and Password are required" });
        }

       
        if (/\s/.test(Username)) {
            return res.status(400).json({ message: "Username should not contain spaces" });
        }

      
        const existingAdmin = await adminModel.findOne({ UserName: Username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Username already exists" });
        }

       
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

       
        const admin = await adminModel.create({ UserName: Username, Password: hashedPassword });

        res.status(200).json(admin);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Can't create the admin" });
    }
};

module.exports = { createAdmin };
