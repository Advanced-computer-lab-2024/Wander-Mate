const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');

const populateAirports = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://Antony:Tony%401952003@wandermate.w2qd6.mongodb.net/WanderMate?retryWrites=true&w=majority&appName=WanderMate", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;
        const collection = db.collection("AirportsLookUp");

        const airports = [];

        // Read and parse the CSV file
        fs.createReadStream("C:/Users/nadee/Downloads/ACL/archive/airports.csv")
            .pipe(csvParser()) // Pipe to csv-parser for automatic parsing
            .on('data', (row) => {
                // Log the row to check its structure
                console.log(row); // Check if the columns match the CSV headers

                // Push to airports array only if the required data is valid
                airports.push({
                    airport_code: row.IATA || row.ICAO || null,  // Use IATA code if available, else ICAO
                    airport_name: row.Name || null,  // Use Name from the CSV
                    city: row.City || null,  // Use City from the CSV
                    country: row.Country || null,  // Use Country from the CSV
                    latitude: parseFloat(row.Latitude) || null,  // Parse Latitude, set null if invalid
                    longitude: parseFloat(row.Longitude) || null,  // Parse Longitude, set null if invalid
                });
            })
            .on('end', async () => {
                // Check the data that will be inserted
                console.log(airports);  // This will log the array before insertion

                // Insert airports into MongoDB if data is not empty
                if (airports.length > 0) {
                    await collection.insertMany(airports);
                    console.log("Airports data inserted successfully!");
                } else {
                    console.log("No valid airport data to insert.");
                }

                mongoose.connection.close(); // Close MongoDB connection
            })
            .on('error', (error) => {
                console.error("Error reading CSV file:", error);
            });

    } catch (error) {
        console.error("Error:", error);
    }
};

// Run the function to populate data
populateAirports();
