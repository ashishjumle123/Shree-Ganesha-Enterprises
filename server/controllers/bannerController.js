const Banner = require('../models/Banner');

const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving banners', error: error.message });
    }
};

const createBanner = async (req, res) => {
    try {
        const { image, alt, link } = req.body;
        const banner = new Banner({ image, alt, link });
        const savedBanner = await banner.save();
        res.status(201).json(savedBanner);
    } catch (error) {
        res.status(400).json({ message: 'Invalid banner data', error: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting banner', error: error.message });
    }
};

module.exports = { getBanners, createBanner, deleteBanner };
