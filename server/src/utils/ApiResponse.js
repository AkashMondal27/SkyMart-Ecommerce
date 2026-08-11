import { ApiError } from "../utils/ApiError.js"; // Imports the ApiError class (not used in this file)

class ApiResponse {
    // Constructor is called automatically when a new ApiResponse object is created
    constructor(
        statuscode,          // HTTP status code (e.g., 200, 404)
        data,                // Data to send in the response
        message = "Success"  // Default message if none is provided
    ) {
        // Store the values inside the object
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;

        // success will be true for status codes less than 400
        // Example: 200, 201 -> true | 400, 404, 500 -> false
        this.success = statuscode < 400;
    }
}

// Export the class so it can be used in other files
export default ApiResponse;