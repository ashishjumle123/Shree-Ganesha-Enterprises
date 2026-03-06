const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB Atlas:");

        // Get all collections
        const collections = await mongoose.connection.db.collections();
        console.log(`Found ${collections.length} collections.`);

        for (let collection of collections) {
            const count = await collection.countDocuments();
            console.log(`- ${collection.collectionName}: ${count} documents`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
