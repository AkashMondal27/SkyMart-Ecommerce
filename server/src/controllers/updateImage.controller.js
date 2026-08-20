import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import cloudinary from "../utils/cloudinary.js";

export const updateProductImage = asyncHandler(async (req, res) => {

    // Check admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            statusCode: 403,
            message: "Access denied. Only admins can update product images."
        });
    }

    const { id } = req.params;
    const files = req.files;

    // Check if images are uploaded
    if (!files || files.length === 0) {
        return res.status(400).json({
            statusCode: 400,
            message: "At least one image is required for the product."
        });
    }

    // Find the product
    const product = await Product.findById(id);

    // Product not found
    if (!product) {
        return res.status(404).json({
            statusCode: 404,
            message: "Product not found"
        });
    }

    // Get old images
    const oldImages = product.images || [];

    // Delete old images from Cloudinary
    for (const img of oldImages) {
        if (img.id) {
            await cloudinary.uploader.destroy(img.id);
        }
    }

    // Upload new images
    const imageUploadPromises = files.map(async (file) => {

        // Convert buffer into Cloudinary-compatible data
        const fileBuffer = bufferGenerator(file);

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(
            fileBuffer.content
        );

        // Return required image information
        return {
            id: result.public_id,
            url: result.secure_url
        };
    });

    // Wait for all uploads
    const uploadedImages = await Promise.all(imageUploadPromises);

    // Replace old images
    product.images = uploadedImages;

    // Save updated product
    const updatedProduct = await product.save();

    // Success response
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product images updated successfully"
        )
    );
});