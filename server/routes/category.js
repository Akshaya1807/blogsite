const express = require('express');

// Create an Express router to define category-related API routes
const router = express.Router();

// Import controller functions for category operations
const {create, list, read, remove} = require("../controllers/category.js");

// Import middleware for login verification and admin authorization
const {requireLogin, adminAuthenticationMiddleware} = require("../controllers/userAuthentication.js");

// Import middleware to check validation results
const {runValidation} = require("../validators");

// Import validation rules for creating a category
const {createCategoryValidator} = require("../validators/category");

// Route to create a new category
// Validate the category name, check login and admin permissions, then create it
router.post('/category', createCategoryValidator, runValidation, requireLogin, adminAuthenticationMiddleware, create);

// Route to get the list of all categories
router.get('/categories', list);

// Route to get a specific category using its slug
router.get('/category/:slug', read);

// Route to delete a category using its slug
// Only logged-in administrators are allowed to delete categories
router.delete('/category/:slug', requireLogin, adminAuthenticationMiddleware, remove);

// Export the router to make these routes available in the main application
module.exports = router;