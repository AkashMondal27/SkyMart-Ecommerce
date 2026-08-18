import { v2 as cloudinary } from 'cloudinary'
// Import File System module to delete temporary files
import fs from "fs"
import path from "path"


// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
