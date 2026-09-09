import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // Products included in this order
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                // Store product name at the time of purchase
                // so the order remains readable even if the product changes later
                productName: {
                    type: String,
                    required: true,
                },

                // Store the price at the time of purchase
                price: {
                    type: Number,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        // COD or Online
        method: {
            type: String,
            enum: ["COD", "Online"],
            required: true,
        },

        // User who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Customer phone number
        phone: {
            type: String,
            required: true,
        },

        // Shipping address saved with the order
        address: {

            location: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },

            post: {
                type: String,
                required: true,
                trim: true,
            },

            pinCode: {
                type: String,
                required: true,
                trim: true,
            },

            district: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                trim: true,
            },
        },
        // Total product amount
        subTotal: {
            type: Number,
            required: true,
            min: 0,
        },

        // Order delivery status
        status: {
            type: String,
            enum: [
                "Pending Payment",
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        // Payment status
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        // Stripe Checkout Session ID
        stripeSessionId: {
            type: String,
            unique: true,
            sparse: true,
        },

        // Stripe Payment Intent ID
        stripePaymentIntentId: {
            type: String,
            sparse: true,
        },

        // Date when online payment was completed
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);
