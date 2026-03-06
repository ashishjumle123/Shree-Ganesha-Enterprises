const nodemailer = require('nodemailer');
require('dotenv').config();

// Temporary credentials for Nodemailer (Fallback or Environment based)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Standard setup assuming Gmail, could be changed in env
    auth: {
        user: process.env.EMAIL_USER || 'dhanrajvaidhya@gmail.com', // Replace with real email
        pass: process.env.EMAIL_PASS || 'your_app_password_here'   // Replace with 16 character App password
    }
});

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER || 'dhanrajvaidhya@gmail.com', // Must match auth user
            replyTo: email,
            to: process.env.EMAIL_USER || 'dhanrajvaidhya@gmail.com', // Admin receiving the email
            subject: `New Contact Request: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2874f0;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #2874f0; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
};
