const { z } = require('zod');

// Regex to block basic script tags to prevent XSS/script injections
const noScriptRegex = /^[^<>]*$/;

const replacementOptions = [
    'No Replacement',
    '1 Day Replacement',
    '3 Days Replacement',
    '7 Days Replacement',
    '10 Days Replacement'
];

const productCreateSchema = z.object({
    title: z.string({ required_error: "Title is required" })
        .min(3, "Title must be at least 3 characters long")
        .regex(noScriptRegex, "Invalid characters detected"),
    price: z.number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
        .positive("Price must be a positive number"),
    category: z.string({ required_error: "Category is required" })
        .min(1, "Category is required")
        .regex(noScriptRegex, "Invalid characters detected"),
    // In backend it is called stockQuantity
    stockQuantity: z.number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
        .int()
        .nonnegative("Stock must be a positive integer"),
    description: z.string().optional(),
    warranty: z.string().optional(),
    replacementPolicy: z.enum(replacementOptions).optional(),
    specifications: z.array(
        z.object({
            title: z.string().min(1, "Specification title is required"),
            value: z.string().min(1, "Specification value is required")
        })
    ).optional()
});

module.exports = {
    productCreateSchema
};
