
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import { Address } from "../models/address.model.js";

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


    // Convert cart items into the format required by the Order model
    const items = cart.map((i) => {

        // Calculate the subtotal for the individual product
        const itemSubtotal = i.product.price * i.quantity;

        // Add the item's subtotal to the complete order subtotal
        subTotal += itemSubtotal;


        return {
            product: i.product._id,
            name: i.product.title,
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
        subject: "SkyMart - Order Confirmation",
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
