const { z } = require('zod');

// Regex to block basic script tags to prevent XSS/script injections
const noScriptRegex = /^[^<>]*$/;

const registerSchema = z.object({
    name: z.string({ required_error: "Name is required" })
        .min(3, "Name must be at least 3 characters long")
        .regex(noScriptRegex, "Invalid characters detected (Script injection prevention)"),
    email: z.string({ required_error: "Email is required" })
        .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
});

const loginSchema = z.object({
    email: z.string({ required_error: "Email is required" })
        .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
});

module.exports = {
    registerSchema,
    loginSchema
};
