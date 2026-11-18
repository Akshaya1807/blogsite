'use strict';

// Function to generate a user-friendly error message when a duplicate value is found
const uniqueMessage = error => {
    let output;

    try {
        // Extract the field name from the MongoDB duplicate key error message
        let fieldName = error.message.substring(
            error.message.lastIndexOf('.$') + 2,
            error.message.lastIndexOf('_1')
        );

        // Capitalize the first letter of the field name and append an error message
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        // Return a generic message if the field name cannot be extracted
        output = 'Unique field already exists';
    }

    // Return the generated error message
    return output;
};


// Function to extract a user-friendly error message from an error object
exports.errorHandler = error => {
    let message = '';

    // Check whether the error object contains an error code
    if (error.code) {

        // Handle errors based on their error codes
        switch (error.code) {

            // MongoDB error codes for duplicate key errors
            case 11000:
            case 11001:
                // Generate a message indicating which field already exists
                message = uniqueMessage(error);
                break;

            // Handle any other error codes
            default:
                message = 'Something went wrong';
        }

    } else {

        // Iterate through the individual errors in the error object
        for (let errorName in error.errorors) {

            // If an error message exists, assign it to the response message
            if (error.errorors[errorName].message) {
                message = error.errorors[errorName].message;
            }
        }
    }

    // Return the final error message
    return message;
};