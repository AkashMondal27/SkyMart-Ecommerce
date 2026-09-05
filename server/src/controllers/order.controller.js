
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import { ApiError } from "../utils/ApiError.js";


/*=======================================================
            Cash On Delevary 
========================================================*/
export const newOrderCod = asyncHandler(async (req, res) => {

    // Get order details from the request body
    const { method, phone, address } = req.body;


    // Fetch all cart items belonging to the logged-in user
    // Populate product details so we can access title, price, and _id
    const cart = await Cart.find({
        user: req.user._id
    }).populate({
        path: "product",
        select: "title price"
    });


    // Prevent order creation when the cart is empty
    if (!cart.length) {
        return res.status(400).json({
            message: "Cart is empty"
        });
    }


    let subTotal = 0;

    // Check whether requested quantity is available
    for (const item of cart) {
        if (item.quantity > item.product.stock) {
            return res.status(400).json({
                message: `${item.product.title} is out of stock`
            });
        }
    }

    // Convert cart items into the format required by the Order model
    const items = cart.map((i) => {

        // Calculate the subtotal for the individual product
        const itemSubtotal = i.product.price * i.quantity;

        // Add the item's subtotal to the complete order subtotal
        subTotal += itemSubtotal;


        return {
            product: i.product._id,
            // name: i.product.title,
            productName: i.product.title,
            price: i.product.price,
            quantity: i.quantity
        };
    });


    // Create the order using the cart information
    const order = await Order.create({
        items,
        method,
        user: req.user._id,
        phone,
        address,
        subTotal
    });


    // Update product stock and sold quantity after creating the order
    for (const item of order.items) {

        const product = await Product.findById(item.product);

        // Make sure the product still exists before updating inventory
        if (product) {

            // Decrease available stock according to ordered quantity
            product.stock -= item.quantity;

            // Increase the total number of products sold
            product.sold += item.quantity;

            await product.save();
        }
    }

    

    // Remove all cart items belonging to the user
    // The cart is cleared only after the order has been created
    await Cart.deleteMany({
        user: req.user._id
    });


    //Send condirmation mail to user
    await sendOrderConfirmation({
        email: req.user.email,
        subject: "SkyCart - Order Confirmation",
        orderId: order._id,
        products: items,
        totalAmount: subTotal
    });

    // Send the newly created order to the client
    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order created successfully"
        )
    );
});



/*=======================================================
           Get All Orders
========================================================*/

//user poin of view , show the new order 1st 
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json({ orders: orders.reverse() })
})


//Admin point of view , show new order 1st 

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json(
            new ApiError(
                403,
                null,
                "Access denied.You are not a ADMIN !"
            )
        );
    }
    const order = await Order.find().populate("user").sort({ createAt: -1 });
    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "You can see thr Newest Orders now "
        )
    );
})


// Sngle Order Fetch 

export const getMyOder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("items.product").populate("user");
    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Single Order Fetch SuccessFully "
        )
    );
})


/*=======================================================
           Orders Update Status 
========================================================*/

export const updateStatus = asyncHandler(async (req, res) => {

    // Only admin can update order status
    if (req.user.role !== "admin") {
        return res.status(403).json(
            new ApiError(
                403,
                null,
                "Access denied. You are not an ADMIN!"
            )
        );
    }

    // Find order using order ID from URL
    const order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
        return res.status(404).json(
            new ApiError(
                404,
                null,
                "Order not found"
            )
        );
    }

    // Get new status from request body
    const { status } = req.body;

    // Update status
    order.status = status;

    // Save updated order
    await order.save();

    // Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    );
});
