const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./server/models/Category');
const Product = require('./server/models/Product');

const requested = [
    { name: "TV", type: "Electronics" },
    { name: "Dressing", type: "Furniture" },
    { name: "Cooler", type: "Home Appliances" },
    { name: "Sofa", type: "Furniture" },
    { name: "Bed", type: "Furniture" },
    { name: "Washing Machine", type: "Home Appliances" },
    { name: "Home Theatre", type: "Electronics" },
    { name: "Dining", type: "Furniture" },
    { name: "Table Fan", type: "Home Appliances" },
    { name: "Ceiling Fan", type: "Home Appliances" },
    { name: "Almirah", type: "Furniture" },
    { name: "Fridge", type: "Home Appliances" },
    { name: "Study Table", type: "Furniture" },
    { name: "Computer Table", type: "Furniture" },
    { name: "Mixer", type: "Home Appliances" }
];

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        // 1. Ensure all requested categories exist
        for (const req of requested) {
            let cat = await Category.findOne({ name: new RegExp(`^${req.name}$`, 'i') });
            if (!cat) {
                console.log(`Creating missing category: ${req.name}`);
                await Category.create({
                    name: req.name,
                    type: req.type,
                    image: 'https://via.placeholder.com/150?text=' + req.name,
                    fallback: req.name.substring(0, 2).toUpperCase(),
                    route: '/category/' + slugify(req.name)
                });
            } else {
                // Update to official name and type
                cat.name = req.name;
                cat.type = req.type;
                cat.route = '/category/' + slugify(req.name);
                await cat.save();
            }
        }

        // 2. Cleanup unused categories not in the requested list
        const requestedNames = requested.map(r => r.name.toLowerCase());
        const allCats = await Category.find({});
        for (const cat of allCats) {
            if (!requestedNames.includes(cat.name.toLowerCase())) {
                const prodCount = await Product.countDocuments({ category: cat.name });
                if (prodCount === 0) {
                    console.log(`Removing unused category: ${cat.name}`);
                    await Category.deleteOne({ _id: cat._id });
                } else {
                    console.log(`Keeping category with products: ${cat.name} (${prodCount} items)`);
                }
            }
        }

        console.log('Category sync complete.');
        process.exit(0);
    })
    .catch(e => { console.error(e); process.exit(1); });
