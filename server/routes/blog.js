const express = require('express');

// Create an Express router to define blog-related API routes
const router = express.Router();

// Import controller functions for handling blog operations
const {
    create,
    list,
    bloglistsallCategoriesTags,
    read,
    remove,
    update,
    photo,
    blogListRelated,
    listSearchItems
} = require("../controllers/blog.js");

// Import middleware for login verification and admin authorization
const {requireLogin, adminAuthenticationMiddleware} = require("../controllers/userAuthentication.js");

// Route to create a new blog post
// Only logged-in administrators are allowed to create blog posts
router.post('/blog', requireLogin, adminAuthenticationMiddleware, create);

// Route to get a list of blog posts
router.get('/bloglists', list);

// Route to get blog posts along with their associated categories and tags
router.post('/bloglists-categories-taglists', bloglistsallCategoriesTags);

// Route to get a specific blog post using its slug
router.get('/blog/:slug', read);

// Route to delete a blog post using its slug
// Only logged-in administrators are allowed to delete blog posts
router.delete('/blog/:slug', requireLogin, adminAuthenticationMiddleware, remove);

// Route to update an existing blog post using its slug
// Only logged-in administrators are allowed to update blog posts
router.put('/blog/:slug', requireLogin, adminAuthenticationMiddleware, update);

// Route to fetch the photo associated with a blog post using its slug
router.get('/blog/photo/:slug', photo);

// Route to get related blog posts
router.post('/bloglists/related', blogListRelated);

// Route to search for blog posts based on search criteria
router.get('/bloglists/search', listSearchItems);

// Export the router to make these routes available in the main application
module.exports = router;