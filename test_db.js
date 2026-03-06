const mongoose = require('mongoose');
const uri = "mongodb+srv://aashishjumle03_db_user:a93Y3GPKK5UsQfUG@shree-ganesha-enterpris.jgnjkr8.mongodb.net/test?retryWrites=true&w=majority&appName=Shree-Ganesha-Enterprises";

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
