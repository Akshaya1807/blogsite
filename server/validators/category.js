const {check} = require("express-validator");

// Validation rule for creating a category
exports.createCategoryValidator = [
    // Check that the category name is not empty
    check('name').not().isEmpty().withMessage("hold up!! Name is required")
];