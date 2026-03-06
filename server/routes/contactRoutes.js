const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST route for handling contact form submission
router.post('/', contactController.submitContactForm);

module.exports = router;
