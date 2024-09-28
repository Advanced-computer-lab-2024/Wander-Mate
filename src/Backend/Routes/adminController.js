const adminModel = require("../Models/admin.js");
const Category = require("../Models/category.js"); // Adjusted to use the correct category model
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

// Creating a category
const createCategory = async (req, res) => {
    try {
        const { Name } = req.body;

        
        if (!Name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        
        const existingCategory = await Category.findOne({ Name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        
        const category = await Category.create({ Name });

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Can't create the category" });
    }
};

module.exports = { createAdmin, createCategory };
