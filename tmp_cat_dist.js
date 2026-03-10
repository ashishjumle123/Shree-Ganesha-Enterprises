const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./server/models/Product');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        console.log(JSON.stringify(counts, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
