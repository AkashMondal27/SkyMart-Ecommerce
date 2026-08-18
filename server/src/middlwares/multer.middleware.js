import multer from "multer";


// Configure multer storage to store uploaded files in memory/cloud
const storage = multer.memoryStorage();

 
export const uploadFiles = multer({ storage: storage }).array("files", 10);  // Accept up to 10 files with the field name "files"
