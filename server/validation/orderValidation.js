const { z } = require('zod');

// Standard template for Order Validation
const orderValidationSchema = z.object({
    orderItems: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive()
    })).min(1, "Order must contain at least one item"),
    shippingAddress: z.object({
        address: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        country: z.string().min(1)
    }),
    paymentMethod: z.string().min(1)
});

module.exports = {
    orderValidationSchema
};
