const express = require('express');

// Create an Express router to define tag-related API routes
const router = express.Router();

// Import controller functions that handle tag operations
const {create, list, read, remove} = require("../controllers/tag.js");

// Import middleware for login verification and admin authorization
const {requireLogin, adminAuthenticationMiddleware} = require("../controllers/userAuthentication.js");

// Import middleware to check validation results
const {runValidation} = require("../validators");

// Import validation rules for creating a tag
const {createTagValidator} = require("../validators/Tag");

// Route to create a new tag
// First validate the input, then check login and admin permissions
// Finally, execute the create controller
router.post('/tag', createTagValidator, runValidation, requireLogin, adminAuthenticationMiddleware, create);

// Route to get the list of all tags
router.get('/taglists', list);

// Route to get a specific tag using its slug
router.get('/tag/:slug', read);

// Route to delete a tag using its slug
// Only logged-in administrators are allowed to delete tags
router.delete('/tag/:slug', requireLogin, adminAuthenticationMiddleware, remove);

// Export the router to make these routes available in the main application
module.exports = router;