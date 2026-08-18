import { asyncHandler } from "../utils/asyncHandler.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import cloudinary from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


export const createProduct = asyncHandler(async (req, res) => {

    // Check admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            statusCode: 403,
            message: "Access denied. Only admins can create products."
        });
    }

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            statusCode: 400,
            message: "No data found"
        });
    }

    // Get product details from request body
    const {
        title,
        description,
        category,
        price,
        stock
    } = req.body;

    // Get uploaded files from Multer
    const files = req.files;

    // Check if images were uploaded
    if (!files || files.length === 0) {
        
        return res.status(403).json({
            statusCode: 403,
            message: "At least one image is required for the product."
        });
    }


    try {

    // Upload all images to Cloudinary
    const imageUploadPromises = files.map(async (file) => {


        // Convert buffer into Cloudinary-compatible data
        const fileBuffer = bufferGenerator(file);


        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(
            fileBuffer.content
        );


        // Return only the information we need
        return {
            id: result.public_id,
            url: result.secure_url
        };
    });



    // Wait for all images to finish uploading
    const uploadedImages = await Promise.all(imageUploadPromises);

     console.log("✅ All images uploaded:", uploadedImages); 
         console.log("🔥 Before Product.create()");


    // Create product in MongoDB
    
        const product = await Product.create({
            title,
            description,
            category,
            price,
            stock,
            images: uploadedImages
        });


         console.log("✅ Product created:", product);

        // Send successful response
        return res.status(201).json(
            new ApiResponse(
                201,
                 product,
                "Product created successfully",
               
            )
        );
    } catch (error) {
        console.error("❌ PRODUCT CREATE ERROR:");
        console.error("Message:", error?.message);
        console.error("Full error:", error);
        console.error("Stack:", error.stack);

        return res.status(500).json({
            success: false,
            message: error?.message || "Product creation failed",
            error: error
        });
    }
});