
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
    const { phone, address } = req.body;

    // Validate checkout information
    if (!phone || !address) {
        throw new ApiError(
            400,
            null,
            "Phone number and address are required"
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


/* ============================================================
   ONLINE PAYMENT : - Create Stripe Checkout Session  
   ============================================================ */

export const newOrderOnlinePayment = asyncHandler(async (req, res) => {
    const { phone, address } = req.body;

    // Validate checkout information
    if (!phone || !address) {
        throw new ApiError(
            400,
            null,
            "Phone number and address are required"
        );
    }

    // Get user's cart with current product information
    const cart = await Cart.find({
        user: req.user._id,
    }).populate({
        path: "product",
        select: "title price stock image",
    });

    // Cart must not be empty
    if (!cart.length) {
        throw new ApiError(400, null, "Cart is empty");
    }

    let subTotal = 0;
    const items = [];

    // Validate products and stock
    for (const cartItem of cart) {
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

    /* ----------------------------------------------------------
     Create a pending order BEFORE sending the user to Stripe.
     This is important because we should not depend on the
     cart after payment is completed.
    ----------------------------------------------------------*/

    const order = await Order.create({
        items,
        method: "Online",
        user: req.user._id,
        phone,
        address,
        subTotal,

        paymentStatus: "Pending",
        status: "Pending Payment",
    });

    try {
        /* ------------------------------------------------------
         Create Stripe line items
         ------------------------------------------------------*/

        const lineItems = cart.map((cartItem) => {
            const product = cartItem.product;

            const productData = {
                name: product.title,
            };

            // Add product image only if it exists
            if (product.image?.[0]) {
                productData.images = [product.image[0]];
            }

            return {
                price_data: {
                    currency: "inr",
                    product_data: productData,                   
                    unit_amount: Math.round(product.price * 100), // INR uses paise. Example: ₹500 = 50000 paise.
                },
                quantity: cartItem.quantity,
            };
        });

        /* ------------------------------------------------------
         Create Stripe Checkout Session
        -----------------------------------------------------*/
        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: lineItems,

            success_url:
                `${process.env.CLIENT_URL}` +
                `/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                `${process.env.CLIENT_URL}/cart`,

            // Only store IDs in Stripe metadata.
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        // Save Stripe session ID to our order
        order.stripeSessionId = session.id;

        await order.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    url: session.url,
                    orderId: order._id,
                },
                "Stripe checkout session created successfully"
            )
        );
    } catch (error) {
        // Stripe session failed, so remove the pending order
        await Order.findByIdAndDelete(order._id);

        console.error("Stripe checkout error:", error);

        throw new ApiError(
            500,
            null,
            "Failed to create Stripe payment session"
        );
    }
});


/* ============================================================
   VERIFY ONLINE PAYMENT
   ============================================================ */

export const verifyPayment = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    // Validate Stripe session ID
    if (!sessionId) {
        throw new ApiError(
            400,
            null,
            "Stripe session ID is required"
        );
    }

    // Retrieve the Stripe Checkout Session
    const session =
        await stripe.checkout.sessions.retrieve(sessionId);

    /* ----------------------------------------------------------
      Make sure this Stripe session belongs to the logged-in user
    ----------------------------------------------------------*/
    if (
        session.metadata?.userId !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            null,
            "You are not authorized to verify this payment"
        );
    }


    if (session.payment_status !== "paid") {
        throw new ApiError(
            400,
            null,
            "Payment has not been completed"
        );
    }

    // Get order ID from Stripe metadata
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        throw new ApiError(
            400,
            null,
            "Order information is missing"
        );
    }

    // Find the pending order
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            null,
            "Order not found"
        );
    }

    // Make sure the Stripe session belongs to this order
    if (order.stripeSessionId !== session.id) {
        throw new ApiError(
            400,
            null,
            "Stripe session does not match the order"
        );
    }
   
    // Prevent duplicate verification. 
    if (order.paymentStatus === "Paid") {
        return res.status(200).json(
            new ApiResponse(
                200,
                order,
                "Payment already verified"
            )
        );
    }

    // Get Stripe Payment Intent ID
    const paymentIntentId =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;


            
    // Update payment information
    order.paymentStatus = "Paid";
    order.status = "Pending";
    order.paidAt = new Date();
    order.stripePaymentIntentId = paymentIntentId;

    await order.save();

    // Reduce stock using an atomic update.  
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
            {
                new: true,
            }
        );

        // Product does not have enough stock anymore
        if (!updatedProduct) {
            throw new ApiError(
                400,
                null,
                "A product in this order is no longer available"
            );
        }
    }

   
    // Clear the cart.
    await Cart.deleteMany({
        user: req.user._id,
    });

    // Send confirmation email
    await sendOrderConfirmation({
        email: req.user.email,
        subject: "SkyCart - Order Confirmation",
        orderId: order._id,
        products: order.items,
        totalAmount: order.subTotal,
    });

    // Return completed order
    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Payment verified and order created successfully"
        )
    );
});










// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Cart } from "../models/cart.model.js";
// import { Order } from "../models/order.model.js";
// import { Product } from "../models/product.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import { ApiError } from "../utils/ApiError.js";
// import Stripe from "stripe";


// /*=======================================================
//             Cash On Delevary 
// ========================================================*/
// export const newOrderCod = asyncHandler(async (req, res) => {

//     // Get order details from the request body
//     const { method, phone, address } = req.body;


//     // Fetch all cart items belonging to the logged-in user
//     // Populate product details so we can access title, price, and _id
//     const cart = await Cart.find({
//         user: req.user._id
//     }).populate({
//         path: "product",
//         select: "title price"
//     });


//     // Prevent order creation when the cart is empty
//     if (!cart.length) {
//         return res.status(400).json({
//             message: "Cart is empty"
//         });
//     }


//     let subTotal = 0;

//     // Check whether requested quantity is available
//     for (const item of cart) {
//         if (item.quantity > item.product.stock) {
//             return res.status(400).json({
//                 message: `${item.product.title} is out of stock`
//             });
//         }
//     }

//     // Convert cart items into the format required by the Order model
//     const items = cart.map((i) => {

//         // Calculate the subtotal for the individual product
//         const itemSubtotal = i.product.price * i.quantity;

//         // Add the item's subtotal to the complete order subtotal
//         subTotal += itemSubtotal;


//         return {
//             product: i.product._id,
//             // name: i.product.title,
//             productName: i.product.title,
//             price: i.product.price,
//             quantity: i.quantity
//         };
//     });


//     // Create the order using the cart information
//     /*    const order = await Order.create({
//         items,
//         method,
//         user: req.user._id,
//         phone,
//         address,
//         subTotal
//     }); */
//     const order = await Order.create({
//     items,
//     method: "COD",
//     user: req.user._id,
//     phone,
//     address,
//     subTotal,

//     // COD order does not require online payment
//     paymentStatus: "Pending",
//     status: "Pending",
// });


//     // Update product stock and sold quantity after creating the order
//     for (const item of order.items) {

//         const product = await Product.findById(item.product);

//         // Make sure the product still exists before updating inventory
//         if (product) {

//             // Decrease available stock according to ordered quantity
//             product.stock -= item.quantity;

//             // Increase the total number of products sold
//             product.sold += item.quantity;

//             await product.save();
//         }
//     }



//     // Remove all cart items belonging to the user
//     // The cart is cleared only after the order has been created
//     await Cart.deleteMany({
//         user: req.user._id
//     });


//     //Send condirmation mail to user
//     await sendOrderConfirmation({
//         email: req.user.email,
//         subject: "SkyCart - Order Confirmation",
//         orderId: order._id,
//         products: items,
//         totalAmount: subTotal
//     });

//     // Send the newly created order to the client
//     return res.status(201).json(
//         new ApiResponse(
//             201,
//             order,
//             "Order created successfully"
//         )
//     );
// });



// /*=======================================================
//            Get All Orders
// ========================================================*/

// //user poin of view , show the new order 1st 
// export const getAllOrders = asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id })
//     res.json({ orders: orders.reverse() })
// })


// //Admin point of view , show new order 1st 

// export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json(
//             new ApiError(
//                 403,
//                 null,
//                 "Access denied.You are not a ADMIN !"
//             )
//         );
//     }
//     const order = await Order.find().populate("user").sort({ createAt: -1 });
//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             order,
//             "You can see thr Newest Orders now "
//         )
//     );
// })


// // Sngle Order Fetch 

// export const getMyOder = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id).populate("items.product").populate("user");
//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             order,
//             "Single Order Fetch SuccessFully "
//         )
//     );
// })


// /*=======================================================
//            Orders Update Status 
// ========================================================*/

// export const updateStatus = asyncHandler(async (req, res) => {

//     // Only admin can update order status
//     if (req.user.role !== "admin") {
//         return res.status(403).json(
//             new ApiError(
//                 403,
//                 null,
//                 "Access denied. You are not an ADMIN!"
//             )
//         );
//     }

//     // Find order using order ID from URL
//     const order = await Order.findById(req.params.id);

//     // Check if order exists
//     if (!order) {
//         return res.status(404).json(
//             new ApiError(
//                 404,
//                 null,
//                 "Order not found"
//             )
//         );
//     }

//     // Get new status from request body
//     const { status } = req.body;

//     // Update status
//     order.status = status;

//     // Save updated order
//     await order.save();

//     // Send response
//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             order,
//             "Order status updated successfully"
//         )
//     );
// });


// /*=======================================================
//             Online Payment Controller
// ========================================================*/
// const stripe = new Stripe(process.env.Stripe_Secret_key);

// export const newOrderOnlinePayment = asyncHandler(async (req, res) => {
//     try {
//         const { method, phone, address } = req.body;

//         const cart = await Cart.find({
//             user: req.user._id
//         }).populate("products");


//         if (!cart.length) {
//             return res.status(400).json({
//                 message: "Cart is empty"
//             });
//         }

//         const subTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

//         const LineItems = cart.map((item) => ({
//             price_data: {
//                 currency: "inr",
//                 product_data: {
//                     name: item.product.title,
//                     image: [item.product.image[0], url],
//                 },

//                 unit_amount: Math.round(item.product.price * 100),
//             },
//             quantity: item.quantity,
//         }))


//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: LineItems,
//             mode: "payment",
//             success_url: `${process.env.CLIENT_URL}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.CLIENT_URL}/cart`,
//             metadata: {
//                 userId: req.user._id.toString(),
//                 method,
//                 phone,
//                 address,
//                 subTotal: subTotal.toString(),
//             },
//         });

//         res.json({ url: session.url });
//     } catch (error) {
//         console.error("Error creating Stripe checkout session:", error);
//         res.status(500).json({
//             message: "Failed to create Stripe Payment session",
//         });
//     }
// });

// //Verify Payment and Create Order

// export const verifyPayment = asyncHandler(async (req, res) => {
//     const { sessionId } = req.body;

//     try {
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         const { userId, method, phone, address, subTotal } = session.metadata;

//         const cart = await Cart.find({
//             user: userId
//         }).populate("product");

//         const items = cart.map((i) => ({
//             product: i.product._id,
//             productName: i.product.title,
//             price: i.product.price,
//             quantity: i.quantity
//         }));


//         if (cart.length == 0) {
//             return res.status(400).json({
//                 message: "Cart is empty"
//             });
//         }

//         const existingOrder = await Order.findOne({ paymentIntentId: sessionId });

//         if (!existingOrder) {
//             await Order.create({
//                 items: cart.map((item) => ({
//                     product: item.product._id,
//                     productName: item.product.title,
//                     price: item.product.price,
//                     quantity: item.quantity
//                 })),
//                 method,
//                 user: userId,
//                 phone,
//                 address,
//                 subTotal,
//                 paidAt: new Date(),
//                 paymentIntentId: sessionId,
//             });



//             // Update product stock and sold quantity after creating the order
//             for (const item of Order.items) {

//                 const product = await Product.findById(item.product);

//                 // Make sure the product still exists before updating inventory
//                 if (product) {

//                     // Decrease available stock according to ordered quantity
//                     product.stock -= item.quantity;

//                     // Increase the total number of products sold
//                     product.sold += item.quantity;

//                     await product.save();
//                 }
//             }

//             // Remove all cart items belonging to the user
//             // The cart is cleared only after the order has been created
//             await Cart.deleteMany({
//                 user: req.user._id
//             });


//             //Send condirmation mail to user
//             await sendOrderConfirmation({
//                 email: req.user.email,
//                 subject: "SkyCart - Order Confirmation",
//                 orderId: order._id,
//                 products: items,
//                 totalAmount: subTotal
//             });

//             return res.status(201).json(
//                 new ApiResponse(
//                     201,
//                     order,
//                     "Order created successfully"
//                 )
//             );
//         }

//     } catch (error) {
//         console.log("Error Veryfing payment:", error);
//         return res.status(500).json({
//             message: "Error creating order"|| error.message
//         });
//     }
// })
