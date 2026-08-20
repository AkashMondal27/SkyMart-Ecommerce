import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addToCart = asyncHandler(async (req, res) => {

    const { product } = req.body;

    // Check product ID
    if (!product) {
        return res.status(400).json({
            statusCode: 400,
            message: "Product ID is required"
        });
    }

    // Find product
    const cartProd = await Product.findById(product);

    if (!cartProd) {
        return res.status(404).json({
            statusCode: 404,
            message: "Product not found"
        });
    }

    // Check stock
    if (cartProd.stock <= 0) {
        return res.status(400).json({
          
            message: "Out of stock"
        });
    }

    // Find existing cart item
    let cart = await Cart.findOne({
        product: product,
        user: req.user._id
    }).populate("product");

    // If product already exists in cart
    if (cart) {

        // Check if requested quantity reaches stock limit
        if (cart.quantity >= cart.product.stock) {
            return res.status(400).json({
                statusCode: 400,
                message: "Out of stock"
            });
        }

        // Increase quantity
        cart.quantity += 1;

        // Save cart
        await cart.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                
                "Product added to cart successfully"
            )
        );
    }

    

    // Create new cart item
    cart = await Cart.create({
        quantity: 1,
        product: product,
        user: req.user._id
    });

    // Success response
    return res.status(201).json(
        new ApiResponse(
            201,
           
            "Product added to cart successfully"
        )
    );
});