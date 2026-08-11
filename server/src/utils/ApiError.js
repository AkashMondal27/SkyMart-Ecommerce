// Custom error class used to create consistent API error responses


class ApiError extends Error {
    // Constructor runs automatically when a new ApiError object is created
    constructor(
        statuscode,                         // HTTP status code (404, 500, etc.)
        message = "something went wrong",   // Error message
        error = [],                         // Additional error details
        stack = ""                         // Custom stack trace
    ) {
        super(message);      // Call the parent Error class constructor

        this.statuscode = statuscode; // Store the HTTP status code

        this.data = null;       // Error responses usually don't contain data

        this.message = message; // Store the error message

        this.success = false; // Error response is always unsuccessful

        this.error = error;    // Store extra error information

        if (stack) {    // Use the provided stack trace if available
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export  { ApiError }
