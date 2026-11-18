// Import fetch to make HTTP requests from the frontend to the backend
import fetch from "isomorphic-fetch";

// Import the base URL of the backend API
import { API } from "../config.js";

// Import js-cookie to manage browser cookies
import cookie from "js-cookie";


// Function to create a new category
// category contains the category details
// token is the authentication token of the logged-in admin
export const create = (category, token) => {

    // Send a POST request to the backend category endpoint
    return fetch(`${API}/category`, {
        method: 'POST',

        // Specify the expected response format and request data format
        // Pass the authentication token to authorize the request
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        // Convert the category object into a JSON string before sending it
        body: JSON.stringify(category)
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};


// Function to retrieve all categories
export const getCategories = () => {

    // Send a GET request to fetch all categories from the backend
    return fetch(`${API}/categories`, {
        method: 'GET',
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle errors if the categories cannot be fetched
    .catch(error => {
        console.error("❌ getCategories fetch failed:", error);

        // Return an error object if the request fails
        return { error: "Failed to fetch categories" };
    });
};


// Function to retrieve a single category using its slug
// slug uniquely identifies the category in the URL
export const getSingleCategory = (slug) => {

    // Send a GET request to retrieve the category and its associated blogs
    return fetch(`${API}/category/${slug}`, {
        method: 'GET',
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};


// Function to delete a category using its slug
// token is required to authorize the admin
export const removeCategory = (slug, token) => {

    // Send a DELETE request to the backend to remove the specified category
    return fetch(`${API}/category/${slug}`, {
        method: 'DELETE',

        // Pass the authentication token in the Authorization header
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};