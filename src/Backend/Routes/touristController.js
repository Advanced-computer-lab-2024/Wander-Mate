const userModel = require('../Models/tourist.js');
const mongoose = require('mongoose');

// Registration function
const touristRegister = async (req, res) => {
    try {
        const { email, UserName, Password, mobileNumber, nationality, DOB, JobOrStudent } = req.body;

        // 1. Validate the request data (check required fields)
        if (!email || !UserName || !Password || !mobileNumber || !JobOrStudent) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // 2. Check if the user already exists (by email)
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // 3. Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // 4. Create new user
        const newUser = await userModel.create ({
            email,
            UserName,
            Password: hashedPassword, // Store the hashed password
            mobileNumber,
            nationality,
            DOB,
            JobOrStudent
        });

       

        // 6. Send success response
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        // Handle errors (e.g., database issues)
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

module.exports = { touristRegister };