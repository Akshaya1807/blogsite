// Import the Category model to perform database operations on categories
const Category = require("../models/categorySchema");

// Import the Blog model to retrieve blogs associated with a category
const Blog = require("../models/blogSchema");

// Import slugify to convert category names into URL-friendly slugs
const slugify = require("slugify");

// Import helper function to convert database errors into readable messages
const {errorHandler} = require("../helpers/databaseErrorHandler");


// Controller to create a new category
exports.create = (req, res) => {

    // Extract the category name from the request body
    const {name} = req.body;

    // Generate a URL-friendly slug from the category name and convert it to lowercase
    let slug = slugify(name).toLowerCase();

    // Create a new Category document with the name and generated slug
    let category = new Category({name, slug});

    // Save the category document in MongoDB
    category.save((err, data) => {

        // Handle database errors, such as duplicate category names
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Return the newly created category
        res.json(data);
    });
};


// Controller to retrieve all categories
exports.list = (req, res) => {

    // Find all category documents in MongoDB
    Category.find({}).exec((err, data) => {

        // Handle errors while fetching categories
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Return the list of categories
        res.json(data);
    });
};


// Controller to retrieve a specific category and its associated blogs
exports.read = (req, res) => {

    // Extract the category slug from the URL parameters and convert it to lowercase
    const slug = req.params.slug.toLowerCase();

    // Find the category document using its slug
    Category.findOne({slug}).exec((err, category) => {

        // Handle errors while retrieving the category
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Find all blogs associated with the retrieved category
        Blog.find({categories: category})

            // Populate category references with their ID, name, and slug
            .populate('categories', '_id name slug')

            // Populate tag references with their ID, name, and slug
            .populate('tags', '_id name slug')

            // Populate the author reference with their ID and name
            .populate('postedBy', '_id name')

            // Select only the required fields from the blog documents
            .select('_id title slug excerpt categories postedBy taglists createdAt updatedAt')

            .exec((err, data) => {

                // Handle errors while retrieving the associated blogs
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                // Return both the category details and its associated blogs
                res.json({
                    category: category,
                    blogs: data
                });
            });
    });
};


// Controller to delete a category using its slug
exports.remove = (req, res) => {

    // Extract the category slug from the URL parameters and convert it to lowercase
    const slug = req.params.slug.toLowerCase();

    // Find the category by slug and remove it from MongoDB
    Category.findOneAndRemove({slug}).exec((err, data) => {

        // Handle errors during category deletion
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Return a success message after deleting the category
        res.json({
            message: "Category Deleted"
        });
    });
};