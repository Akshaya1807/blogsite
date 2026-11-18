// Import formidable to handle form data, including file uploads
const formidable = require("formidable");

// Import slugify to convert blog titles into URL-friendly slugs
const slugify = require("slugify");

// Import cli-strip-html to remove HTML tags from blog content
// This is used to generate a clean meta description
// const stripHtml = require("string-strip-html");
const stripHtml = require("cli-strip-html");

// Import lodash to merge updated fields into an existing blog object
const _ = require("lodash");

// Import Mongoose models to interact with MongoDB collections
const Blog = require("../models/blogSchema");
const Category = require("../models/categorySchema");
const Tag = require("../models/tagSchema");
const User = require("../models/user");

// Import helper function to convert database errors into readable messages
const {errorHandler} = require("../helpers/databaseErrorHandler");

// Import Node.js file system module to read uploaded image files
const fs = require("fs");

// Import helper function to generate a shortened blog excerpt
const {excerptTrim} = require("../helpers/excerptTrim");

// Load environment variables from the .env file
require("dotenv").config();


// Controller to create a new blog post
exports.create = (req, res) => {

  // Create a new formidable form instance to handle incoming form data
  let form = new formidable.IncomingForm();

  // Preserve the file extension of uploaded files
  form.keepExtensions = true;

  // Parse the incoming request to extract text fields and uploaded files
  form.parse(req, (err, fields, files) => {

      // Return an error if parsing or file upload fails
      if (err) {
          return res.status(400).json({
              error: 'Image upload failure'
          });
      }

      // Extract blog details from the submitted form
      const { title, body, categories, taglists } = fields;

      // Validate that the blog title is provided
      if (!title || !title.length) {
          return res.status(400).json({
              error: `--------------------->Title is required<----------------------`
          });
      }

      // Validate that the blog body contains at least 200 characters
      if (!body || body.length < 200) {
          return res.status(400).json({
              error: `-------------------->Blog is either short or too big<----------------------`
          });
      }

      // Ensure that at least one category is selected
      if (!categories || categories.length === 0) {
          return res.status(400).json({
              error: '------------------->Please select at least one category<-----------------'
          });
      }

      // Ensure that at least one tag is selected
      if (!taglists || taglists.length === 0) {
          return res.status(400).json({
              error: '---------------------->Please select at least one tag<--------------------'
          });
      }

      // Create a new Blog model instance
      let blog = new Blog();

      // Assign the submitted title and body to the blog object
      blog.title = title;
      blog.body = body;

      // Generate a short excerpt from the blog body
      blog.excerpt = excerptTrim(body, 160, ' ', '.....');

      // Generate a URL-friendly slug from the title and convert it to lowercase
      blog.slug = slugify(title).toLowerCase();

      // Generate the meta title using the blog title and website name
      blog.mtitle = `${title} | ${process.env.BLOG_NAME}`;

      // Remove HTML tags from the first 160 characters to generate a meta description
      blog.mdesc = stripHtml(body.substring(0,160));

      // Associate the blog post with the currently logged-in user
      // req.user is populated by the authentication middleware
      blog.postedBy = req.user._id;

      // Convert the comma-separated category IDs into an array
      let allTheListOfCategories = categories && categories.split(',');

      // Convert the comma-separated tag IDs into an array
      let allTheListOfTags = taglists && taglists.split(',');

      // Check whether an image was uploaded
      if (files.photo) {

          // Reject images larger than 10 MB
          if (files.photo.size > 10000000) {
              return res.status(400).json({
                  error: 'Image size too big'
              });
          }

          // Read the uploaded image file and store its binary data in MongoDB
          blog.photo.data = fs.readFileSync(files.photo.path);

          // Store the image's MIME type (e.g., image/jpeg or image/png)
          blog.photo.contentType = files.photo.type;
      }

      // Save the newly created blog document in MongoDB
      blog.save((err, result) => {

          // Handle database validation or duplicate key errors
          if (err) {
              return res.status(400).json({
                  error: errorHandler(err)
              });
          }

          // Add the selected category IDs to the blog's categories array
          Blog.findByIdAndUpdate(
              result._id,
              { $push: { categories: allTheListOfCategories } },
              { new: true }
          ).exec((err, result) => {

              // Handle errors while updating categories
              if (err) {
                  return res.status(400).json({
                      error: errorHandler(err)
                  });
              } else {

                  // Add the selected tag IDs to the blog's taglists array
                  Blog.findByIdAndUpdate(
                      result._id,
                      { $push: { taglists: allTheListOfTags } },
                      { new: true }
                  ).exec((err, result) => {

                      // Handle errors while updating tags
                      if (err) {
                          return res.status(400).json({
                              error: errorHandler(err)
                          });
                      } else {

                          // Return the successfully created blog with its updated data
                          res.json(result);
                      }
                  });
              }
          });
      });
  });
};


// Controller to retrieve all blog posts
exports.list = (req, res) => {

    // Find all blogs and populate their referenced categories, tags, and authors
    // Populate replaces MongoDB reference IDs with selected fields from related documents
    Blog.find({})
        .populate("categories", "_id name slug")
        .populate("taglists", "_id name slug")
        .populate("postedBy", "_id name username")

        // Select only the fields required in the response
        .select("_id title slug excerpt categories taglists postedBy createdAt updatedAt")

        // Execute the database query
        .exec((err, data) => {

            // Return an error if the database query fails
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }

            // Return the list of blogs
            res.json(data);
        });
};


// Controller to retrieve blogs along with all categories and tags
exports.bloglistsallCategoriesTags = (req, res) => {

    // Read pagination values from the request body
    // Use 10 as the default limit and 0 as the default skip value
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    // Variables to store the retrieved data
    let blogs;
    let categories;
    let tags;

    // Retrieve blogs and populate their referenced categories, tags, and authors
    Blog.find({})
        .populate("categories", "_id name slug")
        .populate("taglists", "_id name slug")
        .populate("postedBy", "_id name username profile")

        // Sort blogs by creation date, newest first
        .sort({createdAt: -1})

        // Skip the specified number of documents for pagination
        .skip(skip)

        // Limit the number of documents returned
        .limit(limit)

        // Select only the required fields
        .select("_id title slug excerpt categories taglists postedBy createdAt updatedAt")

        .exec((err, data) => {

            // Handle errors while fetching blogs
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }

            // Store the retrieved blogs
            blogs = data;

            // Retrieve all categories from MongoDB
            Category.find({}).exec((err, cat) => {

                // Handle category retrieval errors
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }

                // Store the retrieved categories
                categories = cat;

                // Retrieve all tags from MongoDB
                Tag.find({}).exec((err, tagg) => {

                    // Handle tag retrieval errors
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }

                    // Store the retrieved tags
                    taglists = tagg;

                    // Return blogs, categories, tags, and the number of blogs retrieved
                    res.json({blogs, categories, taglists, size: blogs.length});
                });
            });
        });
};


// Controller to retrieve a single blog using its slug
exports.read = (req, res) => {

    // Extract the slug from the URL parameters and convert it to lowercase
    const slug = req.params.slug.toLowerCase();

    // Find the blog matching the given slug
    Blog.findOne({slug})

        // Populate category, tag, and author references
        .populate("categories", "_id name slug")
        .populate("taglists", "_id name slug")
        .populate("postedBy", "_id name username")

        // Select the fields required for displaying a single blog
        .select("_id title body slug mtitle mdesc categories taglists postedBy createdAt updatedAt")

        .exec((err, data) => {

            // Handle database errors
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }

            // Return the requested blog
            res.json(data);
        });
};


// Controller to delete a blog using its slug
exports.remove = (req, res) => {

    // Extract the slug from the URL and convert it to lowercase
    const slug = req.params.slug.toLowerCase();

    // Find the blog by slug and remove it from MongoDB
    Blog.findOneAndRemove({slug}).exec((err, data) => {

        // Handle deletion errors
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }

        // Return a success message after deletion
        res.json({
            message: "Blog has been succesfully deleted"
        });
    });
};


// Controller to update an existing blog
exports.update = (req, res) => {

    // Extract the blog slug from the URL
    const slug = req.params.slug.toLowerCase();

    // Find the existing blog document using its slug
    Blog.findOne({slug}).exec((err, oldBlog) => {

        // Handle errors while finding the blog
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Create a formidable instance to handle form fields and image uploads
        let form = new formidable.IncomingForm();

        // Preserve uploaded file extensions
        form.keepExtensions = true;

        // Parse the incoming update request
        form.parse(req, (err, fields, files) => {

            // Handle errors while parsing the form
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            // Preserve the original slug so that merging fields does not change it
            let slugBeforeMerge = oldBlog.slug;

            // Merge the submitted fields into the existing blog document
            oldBlog = _.merge(oldBlog, fields);

            // Restore the original slug
            oldBlog.slug = slugBeforeMerge;

            // Extract fields that need special processing
            const {body, mdesc, categories, taglists} = fields;

            // Update the excerpt and meta description if a new body is provided
            if (body) {
                oldBlog.excerpt = excerptTrim(body, 320, ' ', ' ...');
                oldBlog.mdesc = stripHtml(body.substring(0, 160));
            }

            // Convert the updated category IDs into an array
            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            // Convert the updated tag IDs into an array
            if (taglists) {
                oldBlog.taglists = taglists.split(',');
            }

            // Check whether a new image was uploaded
            if (files.photo) {

                // Reject images larger than 10 MB
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }

                // Read the uploaded image and store its binary data
                oldBlog.photo.data = fs.readFileSync(files.photo.path);

                // Store the uploaded image's MIME type
                oldBlog.photo.contentType = files.photo.type;
            }

            // Save the updated blog document in MongoDB
            oldBlog.save((err, result) => {

                // Handle errors while saving the updated blog
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                // Return the updated blog document
                res.json(result);
            });
        });
    });
};


// Controller to retrieve the image associated with a blog
exports.photo = (req, res) => {

    // Extract the blog slug from the URL
    const slug = req.params.slug.toLowerCase();

    // Find the blog and retrieve only its photo field
    Blog.findOne({slug}).select("photo").exec((err, blog) => {

        // Return an error if the query fails or the blog does not exist
        if (err || !blog) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // Set the response Content-Type header to the image's MIME type
        res.set('Content-Type', blog.photo.contentType);

        // Send the image's binary data as the response
        return res.send(blog.photo.data);
    });
};


// Controller to retrieve blogs related to a particular blog
exports.blogListRelated = (req, res) => {

    // Set the maximum number of related blogs to return (default is 3)
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;

    // Extract the current blog's ID and categories from the request body
    const {_id, categories} = req.body.blog;

    // Find blogs that belong to at least one of the same categories
    // $ne excludes the current blog ID
    // $in matches documents containing any of the specified category IDs
    Blog.find({
        _id: {$ne: _id},
        categories: {$in: categories}
    })

        // Limit the number of related blogs returned
        .limit(limit)

        // Populate author details
        .populate('postedBy', '_id name profile')

        // Select only the fields needed to display related blogs
        .select('slug title excerpt postedBy createdAt updatedAt')

        .exec((err, blogs) => {

            // Return an error if the query fails
            if (err) {
                return res.status(400).json({
                    error: "Blog not found"
                });
            }

            // Return the related blogs
            res.json(blogs);
        });
};


// Controller to search for blogs using a search term
exports.listSearchItems = (req, res) => {

    // Extract the search term from the URL query parameters
    const {search} = req.query;

    // Perform the search only when a search term is provided
    if (search) {

        // Find blogs where either the title or body contains the search term
        // $or means at least one condition must match
        // $regex performs pattern matching
        // $options: 'i' makes the search case-insensitive
        Blog.find({
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {body: {$regex: search, $options: 'i'}}
            ]
        }, (err, blogs) => {

            // Handle database search errors
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            // Return the matching blogs
            res.json(blogs);

        // Exclude the photo and body fields from the search results
        }).select("-photo -body");
    }
};