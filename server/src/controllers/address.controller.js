import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/*================================================
            Add a new address
===============================================*/  

export const addAddress = asyncHandler(async (req, res) => {

    // Get address details from request body
    const { name ,address, phone } = req.body;

    // Validate required fields
    if (!name || !address || !phone) {
        return res.status(400).json({
            message: "Name, address and phone are required"
        });
    }

    // Create address for the logged-in user
    const newAddress =await Address.create({
        name,
        address,
        phone,
        user: req.user._id
    });

    // Send success response
    return res.status(201).json(
        new ApiResponse(
            201,
            newAddress,
            "Address added successfully"
        )
    );
});


/*======================================================
            Fetch all addresses
=====================================================*/ 

export const getAllAddress = asyncHandler(async (req, res) => {

    // Find all addresses of the logged-in user
    const allAddress = await Address.find({
        user: req.user._id
    });

    // Send addresses in response
    return res.status(200).json(
        new ApiResponse(
            200,
            allAddress,
            "Addresses fetched successfully"
        )
    );
});



/*======================================================
         Fetch a single address
======================================================*/  

export const getSingleAddress = asyncHandler(async (req, res) => {

    // Find address by ID
    const address = await Address.findById(req.params.id);

    // Check if address exists
    if (!address) {
        return res.status(404).json({
            statusCode: 404,
            message: "Address not found"
        });
    }

    // Send address in response
    return res.status(200).json(
        new ApiResponse(
            200,
            address,
            "Address fetched successfully"
        )
    );
});


/*===================================================
             Delete a single address
===================================================*/
             
export const deleteAddress = asyncHandler(async (req, res) => {

    // Find the address belonging to the logged-in user
    const address = await Address.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    // Check if address exists
    if (!address) {
        return res.status(404).json({
            statusCode: 404,
            message: "Address not found"
        });
    }

    // Delete the address
    await address.deleteOne();

    // Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Address deleted successfully"
        )
    );
});