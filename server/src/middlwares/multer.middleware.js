import multer from "multer";


// Configure multer storage to store uploaded files in memory/cloud
const storage = multer.memoryStorage();

 
export const uploadFiles = multer({ storage: storage }).array("files", 5);  // Accept up to 5 files with the field name "files"
