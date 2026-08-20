import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ============================================================
   Add Product to Cart
   ============================================================ */

export const addToCart = asyncHandler(async (req, res) => {
    const { product } = req.body;

    // Validate product ID
    if (!product) {
        return res.status(400).json({
            statusCode: 400,
            message: "Product ID is required"
        });
    }

    // Find the product
    const cartProd = await Product.findById(product);

    if (!cartProd) {
        return res.status(404).json({
            statusCode: 404,
            message: "Product not found"
        });
    }

    // Check product stock
    if (cartProd.stock <= 0) {
        return res.status(400).json({
            message: "Out of stock"
        });
    }

    // Check if product already exists in the user's cart
    let cart = await Cart.findOne({
        product: product,
        user: req.user._id
    }).populate("product");

    // Increase quantity if product is already in cart
    if (cart) {

        // Prevent quantity from exceeding available stock
        if (cart.quantity >= cart.product.stock) {
            return res.status(400).json({
                statusCode: 400,
                message: "Out of stock"
            });
        }

        // Increase product quantity
        cart.quantity += 1;

        // Save updated cart
        await cart.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Product added to cart successfully"
            )
        );
    }

    // Create a new cart item
    cart = await Cart.create({
        quantity: 1,
        product: product,
        user: req.user._id
    });

    // Send success response
    return res.status(201).json(
        new ApiResponse(
            201,
            "Product added to cart successfully"
        )
    );
});


/* ============================================================
   Remove Product from Cart
   ============================================================ */

export const removeFromCart = asyncHandler(async (req, res) => {

    // Find the cart item
    const cart = await Cart.findById(req.params.id); // need get method

    if (!cart) {
        return res.status(404).json({
            statusCode: 404,
            message: "Cart item not found"
        });
    }

    // Remove the cart item
    await cart.deleteOne();

    // Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Product removed from cart successfully"
        )
    );
});


/* ============================================================
   Update Cart Product Quantity
   ============================================================ */

export const updateCart = asyncHandler(async (req, res) => {
    const { action } = req.query;

    // Increase product quantity
    if (action === "inc") {

        const { id } = req.body; // need post method

        // Find the cart item
        const cart = await Cart.findById(id).populate("product");

        // Check stock before increasing quantity
        if (cart.quantity < cart.product.stock) {
            cart.quantity++;

            // Save updated quantity
            await cart.save();
        } else {
            return res.status(400).json({
                message: "Out of stock"
            });
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Cart Updated successfully"
            )
        );
    }

    // Decrease product quantity
    if (action === "dec") {

        const { id } = req.body;

        // Find the cart item
        const cart = await Cart.findById(id).populate("product");

        // Decrease quantity only if more than one item exists
        if (cart.quantity > 1) {
            cart.quantity--;

            // Save updated quantity
            await cart.save();
        } else {
            return res.status(400).json({
                message: "You have only one item"
            });
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Cart Updated successfully"
            )
        );
    }
});


/* ============================================================
     Fetch Cart
   ============================================================ */

  // Fetch all cart items for the logged-in user
export const fetchCart = asyncHandler(async (req, res) => {

    // Get user's cart and populate product details
    const cart = await Cart.find({
        user: req.user._id
    }).populate("product");

    // Calculate total quantity of all products
    const sumOfQuantities = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Calculate total cart price
    let subTotal = 0;

    cart.forEach((item) => {
        const itemSubTotal = item.product.price * item.quantity;
        subTotal += itemSubTotal;
    });

    // Send cart details and totals
    return res.status(200).json(
    new ApiResponse(
        200,
        {
            cart,
            subTotal,
            sumOfQuantities
        },
        "Cart fetched successfully"
    )
);
});