
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.Stripe_Secret_key);


/* ============================================================
   CASH ON DELIVERY
   ============================================================ */

export const newOrderCod = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;

    // Validate checkout information
    if (!name || !phone || !address) {
        throw new ApiError(
            400,
            null,
            "Name ,Phone number and address are required"
        );
    }

    // Get user's cart with current product information
    const cart = await Cart.find({
        user: req.user._id,
    }).populate({
        path: "product",
        select: "title price stock",
    });

    // Cart must contain at least one product
    if (!cart.length) {
        throw new ApiError(400, null, "Cart is empty");
    }

    let subTotal = 0;
    const items = [];

    // Validate stock and prepare order items
    for (const cartItem of cart) {
        if (!cartItem.product) {
            throw new ApiError(
                400,
                null,
                "One of the products in your cart is no longer available"
            );
        }

        const product = cartItem.product;

        // Check available stock
        if (cartItem.quantity > product.stock) {
            throw new ApiError(
                400,
                null,
                `${product.title} is out of stock`
            );
        }

        const itemSubtotal =
            product.price * cartItem.quantity;

        subTotal += itemSubtotal;

        items.push({
            product: product._id,
            productName: product.title,
            price: product.price,
            quantity: cartItem.quantity,
        });
    }

    // Create COD order
    const order = await Order.create({
        items,
        method: "COD",
        user: req.user._id,
        name,
        phone,
        address,
        subTotal,

        // COD payment is not completed yet
        paymentStatus: "Pending",

        // Order can start as pending
        status: "Pending",
    });

    // Reduce stock after order creation
    for (const item of order.items) {
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: item.product,
                stock: { $gte: item.quantity },
            },
            {
                $inc: {
                    stock: -item.quantity,
                    sold: item.quantity,
                },
            },
             { new: true }
        );
        if (!updatedProduct) {
         throw new ApiError(400, null, "Insufficient stock");
        }
    }

    // Clear user's cart
    await Cart.deleteMany({
        user: req.user._id,
    });

    // Send order confirmation email
    await sendOrderConfirmation({
        email: req.user.email,
        subject: "SkyCart - Order Confirmation",
        orderId: order._id,
        products: items,
        totalAmount: subTotal,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order created successfully"
        )
    );
});


/* ============================================================
   GET USER ORDERS
   ============================================================ */

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    })
        .populate("items.product")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
});


/* ============================================================
   GET ALL ORDERS - ADMIN
   ============================================================ */

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
    // Only admin can access all orders
    if (req.user.role !== "admin") {
        throw new ApiError(
            403,
            null,
            "Access denied. You are not an ADMIN!"
        );
    }

    const orders = await Order.find()
        .populate("user")
        .populate("items.product")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Newest orders fetched successfully"
        )
    );
});


/* ============================================================
   GET SINGLE ORDER
   ============================================================ */

export const getMyOder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("items.product")
        .populate("user");

    if (!order) {
        throw new ApiError(
            404,
            null,
            "Order not found"
        );
    }

    // Make sure normal users can only see their own orders
    if (
        req.user.role !== "admin" &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            null,
            "You are not authorized to view this order"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    );
});
/* ============================================================
   GET ORDER STATUS
   USER + ADMIN
   ============================================================ */

export const getOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).select(
        "user status paymentStatus method paidAt"
    );

    if (!order) {
        throw new ApiError(
            404,
            null,
            "Order not found"
        );
    }

    // Normal user can only see their own order status
    if (
        req.user.role !== "admin" &&
        order.user.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            null,
            "You are not authorized to view this order status"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orderId: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                method: order.method,
                paidAt: order.paidAt,
            },
            "Order status fetched successfully"
        )
    );
});


/* ============================================================
   UPDATE ORDER STATUS - ADMIN
   ============================================================ */

export const updateStatus = asyncHandler(async (req, res) => {
    // Only admin can update order status
    if (req.user.role !== "admin") {
        throw new ApiError(
            403,
            null,
            "Access denied. You are not an ADMIN!"
        );
    }

    const { status } = req.body;

    // Validate status
    const allowedStatuses = [
        "Pending Payment",
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            null,
            "Invalid order status"
        );
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(
            404,
            null,
            "Order not found"
        );
    }

    // Update order status
    order.status = status;

    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    );
});


export const newOrderOnlinePayment = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
        throw new ApiError(
            400,
            null,
            "Name, phone number and address are required"
        );
    }

    const cart = await Cart.find({
        user: req.user._id,
    }).populate({
        path: "product",
        select: "title price stock image",
    });

    if (!cart.length) {
        throw new ApiError(400, null, "Cart is empty");
    }

    let subTotal = 0;
    
    const items = []; 

    const lineItems = cart.map((cartItem) => {
        if (!cartItem.product) {
            throw new ApiError(
                400,
                null,
                "One of the products in your cart is no longer available"
            );
        }

        const product = cartItem.product;

        if (cartItem.quantity > product.stock) {
            throw new ApiError(
                400,
                null,
                `${product.title} does not have enough stock`
            );
        }

        subTotal += product.price * cartItem.quantity;
        items.push({
    product: product._id,
    productName: product.title,
    price: product.price,
    quantity: cartItem.quantity,
});

        const productData = {
            name: product.title,
        };

        // if (product.image?.[0]) {
        //     productData.images = [product.image[0]];
        // }

        return {
            price_data: {
                currency: "inr",
                product_data: productData,
                unit_amount: Math.round(product.price * 100),
            },
            quantity: cartItem.quantity,
        };
    });
    const order = await Order.create({
    items,
    method: "Online",
    user: req.user._id,
    name,
    phone,
    address,
    subTotal,
    paymentStatus: "Pending",
    status: "Pending Payment",
});

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: lineItems,

            success_url:
                `${process.env.CLIENT_URL}/ordersuccess` +
                `?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                `${process.env.CLIENT_URL}/cart`,

            metadata: {
                
                userId: req.user._id.toString(),
                userId: req.user._id.toString(),
                 
                name,
                phone,
                address: JSON.stringify(address),
                subTotal: subTotal.toString(),
            },
        });
         order.stripeSessionId = session.id;
         await order.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    url: session.url,
                    sessionId: session.id,
                },
                "Stripe checkout session created successfully"
            )
        );
    } catch (error) {
        console.error("Stripe checkout error:", error);

        throw new ApiError(
            500,
            null,
            "Failed to create Stripe payment session"
        );
    }
});


export const verifyPayment = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        throw new ApiError(
            400,
            null,
            "Stripe session ID is required"
        );
    }

    // Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check payment
    if (session.payment_status !== "paid") {
        throw new ApiError(
            400,
            null,
            "Payment has not been completed"
        );
    }

    // Check user
    const userId = session.metadata?.userId;

    if (!userId || userId !== req.user._id.toString()) {
        throw new ApiError(
            403,
            null,
            "You are not authorized to verify this payment"
        );
    }

    // Find existing order
    const order = await Order.findOne({
        stripeSessionId: session.id,
        user: req.user._id,
    });

    if (!order) {
        throw new ApiError(
            404,
            null,
            "Order not found"
        );
    }

    // Prevent duplicate verification
    if (order.paymentStatus === "Paid") {
        return res.status(200).json(
            new ApiResponse(
                200,
                order,
                "Payment already verified"
            )
        );
    }

    // Mark existing order as paid
    order.paymentStatus = "Paid";
    order.status = "Pending";
    order.paidAt = new Date();

    order.stripePaymentIntentId =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

    await order.save();

    // Clear cart only after successful payment
    await Cart.deleteMany({
        user: req.user._id,
    });

    // Confirmation email
    await sendOrderConfirmation({
        email: req.user.email,
        subject: "SkyCart - Order Confirmation",
        orderId: order._id,
        products: order.items,
        totalAmount: order.subTotal,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Payment verified successfully"
        )
    );
});
