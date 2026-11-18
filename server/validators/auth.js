const {check} = require("express-validator");

// Validation rules for user signup
exports.userSignupValidator = [
    // Check that the name field is not empty
    check('name').not().isEmpty().withMessage("hold up!! Name is required"),

    // Check whether the email address is in a valid format
    check('email').isEmail().withMessage("Please enter valid email address"),

    // Ensure that the password contains at least 6 characters
    check('password').isLength({min:6}).withMessage("password must be 6 characters"),
];

// Validation rules for user login
exports.userLoginValidator = [
    // Check whether the email address is valid
    check('email').isEmail().withMessage("Please enter valid email address"),

    // Ensure that the password contains at least 6 characters
    check('password').isLength({min:6}).withMessage("password must be 6 characters"),
];