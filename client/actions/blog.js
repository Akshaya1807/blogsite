// Import fetch to make HTTP requests from the frontend to the backend
import fetch from "isomorphic-fetch";

// Import the base URL of the backend API
import { API } from "../config.js";

// Import query-string to convert JavaScript objects into URL query strings
import queryString from "query-string";


// Function to create a new blog post
// blog contains the form data, including text fields and an optional image
// token is the authentication token of the logged-in admin
export const createBlog = (blog, token) => {

  // Send a POST request to the backend to create a blog
  return fetch(`${API}/blog`, {
    method: "POST",

    // Specify the accepted response format and pass the authentication token
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },

    // Send the blog data as the request body
    // FormData is used when the request contains file uploads
    body: blog,
  })

    // Convert the backend response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((error) => console.log(error));
};


// Function to retrieve blogs along with their categories and tags
// skip determines how many blogs to skip
// limit determines the maximum number of blogs to retrieve
export const listBlogsWithCategoriesAndTaglists = (skip, limit) => {

  // Create an object containing pagination details
  const data = { limit, skip };

  // Send a POST request to retrieve blogs with categories and tags
  return fetch(`${API}/bloglists-categories-taglists`, {
    method: "POST",

    // Specify that JSON data is being sent and expected
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    // Convert the pagination object into a JSON string
    body: JSON.stringify(data),
  })

    // Convert the response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((error) => console.log(error));
};


// Function to retrieve a single blog using its slug
// async allows us to use await for handling asynchronous operations
export const singleBlog = async (slug) => {
  try {

    // Send a GET request to retrieve the blog matching the given slug
    const response = await fetch(`${API}/blog/${slug}`, { method: "GET" });

    // Check whether the HTTP response indicates success
    if (!response.ok) {

      // Log the HTTP status code if the request fails
      console.error("❌ Failed to fetch blog:", response.status);

      // Return an error object containing the status code
      return { error: `Failed to fetch blog. Status: ${response.status}` };
    }

    // Convert the response body into JSON
    const data = await response.json();

    // Check whether the backend returned any blog data
    if (!data) {
      return { error: "No blog data found" };
    }

    // Return the retrieved blog data
    return data;

  } catch (err) {

    // Handle network errors or errors during request processing
    console.error("❌ Error fetching single blog:", err);

    // Return a generic error message
    return { error: "Something went wrong while fetching blog" };
  }
};


// Function to retrieve blogs related to a particular blog
export const blogListRelated = (blog) => {

  // Send a POST request containing the current blog's details
  return fetch(`${API}/bloglists/related`, {
    method: "POST",

    // Specify that JSON data is being sent and expected
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    // Convert the blog object into a JSON string
    body: JSON.stringify(blog),
  })

    // Convert the backend response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((error) => console.log(error));
};


// Function to retrieve the list of all blogs
export const listingTheBlog = () => {

  // Send a GET request to the bloglists endpoint
  return fetch(`${API}/bloglists`, { method: "GET" })

    // Convert the response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((err) => console.log(err));
};


// Function to delete a blog using its slug
// slug identifies the blog to delete
// token is required to authorize the admin
export const removingTheBlog = (slug, token) => {

  // Send a DELETE request to the backend
  return fetch(`${API}/blog/${slug}`, {
    method: "DELETE",

    // Pass the authentication token in the Authorization header
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

    // Convert the backend response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((error) => console.log(error));
};


// Function to update an existing blog
// blog contains the updated form data
// token is the admin's authentication token
// slug identifies the blog that needs to be updated
export const updatingTheBlog = (blog, token, slug) => {

  // Send a PUT request to update the specified blog
  return fetch(`${API}/blog/${slug}`, {
    method: "PUT",

    // Pass the authentication token to authorize the update
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },

    // Send the updated blog data
    // FormData is used when the request contains file uploads
    body: blog,
  })

    // Convert the backend response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((error) => console.log(error));
};


// Function to search for blog posts
// params contains the search criteria
export const listSearchBlogItems = (params) => {

  // Convert the search parameters object into a URL query string
  // Example: { search: "javascript" } becomes "search=javascript"
  let query = queryString.stringify(params);

  // Send a GET request with the search query in the URL
  return fetch(`${API}/bloglists/search?${query}`, {
    method: "GET",
  })

    // Convert the backend response into JSON
    .then((response) => response.json())

    // Handle network or request errors
    .catch((err) => console.log(err));
};