const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./server/models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
    {
        title: "Sony Bravia 139 cm (55 inches) 4K Ultra HD Smart LED Google TV",
        brand: "Sony",
        description: "Breathtaking colors make everything so real. Over a billion colors are brought to life by TRILUMINOS PRO and our 4K HDR Processor X1.",
        price: 57990,
        deliveryFee: 500,
        category: "Televisions",
        stockQuantity: 15,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/television/h/6/5/-original-imagtweygquhxtz5.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Resolution", value: "4K Ultra HD (3840 x 2160)" },
            { key: "Refresh Rate", value: "60 Hz" },
            { key: "Sound", value: "20 Watts Output" }
        ],
        rating: 4.6,
        numReviews: 310
    },
    {
        title: "LG 1.5 Ton 5 Star AI DUAL Inverter Split AC",
        brand: "LG",
        description: "Split AC with inverter compressor: Variable speed compressor which adjusts power depending on heat load. It is most energy efficient and has lowest-noise operation.",
        price: 45490,
        deliveryFee: 800,
        category: "AC",
        stockQuantity: 20,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/air-conditioner-new/w/x/3/-original-imagsjngzyqzyzk8.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Capacity", value: "1.5 Ton" },
            { key: "Energy Rating", value: "5 Star" },
            { key: "Condenser", value: "Copper With ocean black protection" }
        ],
        rating: 4.4,
        numReviews: 125
    },
    {
        title: "Samsung 236 L 2 Star Digital Inverter Frost Free Double Door Refrigerator",
        brand: "Samsung",
        description: "Frost Free Refrigerator: Auto defrost function to prevent ice-build up. Capacity 236 Litres: Suitable for families with 2 to 3 members.",
        price: 24990,
        deliveryFee: 600,
        category: "Refrigerators",
        stockQuantity: 12,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/refrigerator-new/d/k/3/-original-imagvz8gf6ngcxhg.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Capacity", value: "236 L" },
            { key: "Energy Rating", value: "2 Star" },
            { key: "Defrosting Type", value: "Frost Free" }
        ],
        rating: 4.3,
        numReviews: 89
    },
    {
        title: "Nilkamal Arthur 3 Seater Fabric Sofa (Grey)",
        brand: "Nilkamal",
        description: "Enhance your living space with the elegant Arthur 3 Seater Sofa. It features soft fabric upholstery and a robust wooden frame.",
        price: 18500,
        deliveryFee: 1200,
        category: "Sofa",
        stockQuantity: 8,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/sofa-set/i/3/x/-original-imagy4hcfd9u39fh.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Material", value: "Fabric Primary, Wood Frame" },
            { key: "Seating Capacity", value: "3" },
            { key: "Color", value: "Grey" }
        ],
        rating: 4.4,
        numReviews: 56
    },
    {
        title: "Wakefit Taurus Engineered Wood Queen Bed",
        brand: "Wakefit",
        description: "Sturdy engineered wood bed with box storage. Finished in Columbian Walnut for a classic look.",
        price: 11999,
        deliveryFee: 800,
        category: "Bed",
        stockQuantity: 40,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/bed/h/e/y/-original-imagzyfh2fshjhzc.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Bed Size", value: "Queen" },
            { key: "Material", value: "Engineered Wood" },
            { key: "Storage", value: "Box Storage" }
        ],
        rating: 4.3,
        numReviews: 520
    },
    {
        title: "LG 8.0 Kg Inverter Fully-Automatic Front Loading Washing Machine",
        brand: "LG",
        description: "Fully-automatic front load washing machine with Inverter Direct Drive Technology. AI DD intelligently senses fabric types.",
        price: 33990,
        deliveryFee: 400,
        category: "Washing Machine",
        stockQuantity: 25,
        images: ["https://rukminim2.flixcart.com/image/832/832/xif0q/washing-machine-new/3/b/j/-original-imagztm9nuzhysyv.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Capacity", value: "8.0 Kg" },
            { key: "Energy Rating", value: "5 Star" },
            { key: "RPM", value: "1400" }
        ],
        rating: 4.5,
        numReviews: 215
    },
    {
        title: "Symphony Diet 12T Personal Tower Air Cooler",
        brand: "Symphony",
        description: "Diet 12T is a sleek, highly-effective personal tower cooler. It is equipped with honeycomb cooling pads, and an ice chamber.",
        price: 5499,
        deliveryFee: 200,
        category: "Air Coolers",
        stockQuantity: 50,
        images: ["https://rukminim2.flixcart.com/image/832/832/l2krs7k0/air-cooler/m/a/1/-original-imagdvdymhghrsqq.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Tank Capacity", value: "12 L" },
            { key: "Cooling Pad", value: "Honeycomb" },
            { key: "Power", value: "170 Watts" }
        ],
        rating: 4.0,
        numReviews: 1200
    },
    {
        title: "SpaceWood 3 Door Wardrobe/Almirah (Walnut)",
        brand: "SpaceWood",
        description: "Spacewood Optima 3 Door Wardrobe comes with a beautiful wood pore finish. It has multiple shelves and a hanging rod.",
        price: 10499,
        deliveryFee: 900,
        category: "Almirah",
        stockQuantity: 15,
        images: ["https://rukminim2.flixcart.com/image/832/832/krp9d3k0/wardrobe-closet/a/1/p/particle-board-na-3-door-optima-3-door-wardrobe-spacewood-natural-original-imag5etvytn3nbf3.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Material", value: "Engineered Wood" },
            { key: "Doors", value: "3" },
            { key: "Finish", value: "Walnut Particle" }
        ],
        rating: 4.1,
        numReviews: 320
    },
    {
        title: "Bajaj Maxima 600 mm Ceiling Fan (White)",
        brand: "Bajaj",
        description: "Bajaj Maxima 600 mm ceiling fan provides maximum air delivery. High torque motor gives high speed performance.",
        price: 1290,
        deliveryFee: 50,
        category: "Ceiling Fan",
        stockQuantity: 100,
        images: ["https://rukminim2.flixcart.com/image/832/832/l58iaa80/fan/l/b/6/-original-imagfxn5hg2uuhgz.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Blade Sweep", value: "600 mm" },
            { key: "Power Consumption", value: "66 W" },
            { key: "Speed", value: "870 RPM" }
        ],
        rating: 4.2,
        numReviews: 450
    },
    {
        title: "Philips HL7756/00 Mixer Grinder, 750W",
        brand: "Philips",
        description: "New Philips mixer grinder gives you a smooth and fine grinding experience. Comes with 3 stainless steel jars.",
        price: 3699,
        deliveryFee: 100,
        category: "Small Appliances",
        stockQuantity: 65,
        images: ["https://rukminim2.flixcart.com/image/832/832/kq6yefk0/mixer-grinder-juicer/e/6/6/hl7756-00-philips-original-imag492r5hyxgtzx.jpeg?q=70&crop=false"],
        specifications: [
            { key: "Power", value: "750 W" },
            { key: "Jars", value: "3" },
            { key: "Material", value: "ABS Plastic" }
        ],
        rating: 4.5,
        numReviews: 2100
    }
];

const seedData = async () => {
    try {
        await connectDB();

        await Product.deleteMany({});
        console.log("Cleared existing products from database");

        await Product.insertMany(products);
        console.log("Successfully seeded 10 new electronics/furniture products into MongoDB Atlas!");

    } catch (error) {
        console.log("FULL ERROR:", error);
        console.error("Error seeding products:", error);
    }
};

seedData().then(() => {
    console.log("Done");
    process.exit();
}).catch(e => {
    console.log("Unhandled:", e);
    process.exit(1);
});
