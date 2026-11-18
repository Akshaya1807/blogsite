const {validationResult} = require("express-validator");

// Middleware to check the results of the validation rules
exports.runValidation = (req,res,next) =>{

    // Collect all validation errors from the request
    const errors = validationResult(req);

    // Check whether any validation errors exist
    if (!errors.isEmpty()){

        // If errors exist, return a 422 (Unprocessable Entity) response
        // Send the first validation error message to the client
        return res.status(422).json({error:errors.array()[0].msg})
    }

    // If there are no validation errors, pass control to the next middleware or route handler
    next();
};