const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    result.forEach(r => {
        console.log(`${r._id}: ${r.count}`);
    });
    process.exit();
};

check()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
