const express = require('express');

// Create an Express router to define user-related API routes
const router = express.Router();

// Import middleware functions for checking user login and authentication
const {requireLogin, authenticationMiddleware} = require("../controllers/userAuthentication.js");

// Import controller functions for handling user profile requests
const {profileReadRequest, publicProfileReadRequest} = require("../controllers/user.js");

// Route to fetch the logged-in user's profile
// requireLogin checks whether the user is logged in
// authenticationMiddleware verifies the user's authentication token
// profileReadRequest handles the request and returns the user's profile
router.get('/profile', requireLogin, authenticationMiddleware, profileReadRequest);

// Route to fetch a user's public profile using their username
// :username is a dynamic route parameter
// No login is required because this profile is publicly accessible
router.get('/user/:username', publicProfileReadRequest);

// Export the router so it can be mounted in the main Express application
module.exports = router;