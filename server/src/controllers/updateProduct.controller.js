import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const updateProduct = asyncHandler(async (req, res) => {

    // Check admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            statusCode: 403,
            message: "Access denied. Only admins can update products."
        });
    }

    const {
        title,
        description,
        category,
        price,
        stock
    } = req.body;

    // Fields to update
    const updateFields = {};

    if (title !== undefined) {
        updateFields.title = title;
    }

    if (description !== undefined) {
        updateFields.description = description;
    }

    if (category !== undefined) {
        updateFields.category = category;
    }

    if (price !== undefined) {
        updateFields.price = price;
    }

    if (stock !== undefined) {
        updateFields.stock = stock;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateFields,
        {
            new: true,
            runValidators: true
        }
    );

    // Product not found
    if (!updatedProduct) {
        return res.status(404).json({
            statusCode: 404,
            message: "Product not found"
        });
    }

    // Success response
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product updated successfully"
        )
    );
});