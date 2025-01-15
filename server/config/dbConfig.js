const mongoose = require('mongoose');

const Url = process.env.MONGODB_URI;  // MongoDB connection string (e.g., mongodb://localhost:27017)
const Db = process.env.DB_NAME;       // Database name (e.g., mydatabase)

const con = async () => {
    try {
        // Attempt to connect to the database
        const conDb = await mongoose.connect(`${Url}/${Db}`);
        // If the connection is successful, log and return success
        console.log("MongoDB connected successfully!");
        return "MongoDB has been connected successfully";
    } catch (error) {
        // Handle any connection errors and return failure
        console.error("Error connecting to MongoDB:", error);
        return "Failed to connect to the database";
    }
};

module.exports = con;
