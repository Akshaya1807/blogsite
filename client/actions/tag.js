// Import fetch to make HTTP requests from the frontend to the backend
import fetch from "isomorphic-fetch";

// Import the base URL of the backend API
import { API } from "../config.js";

// Import js-cookie to manage browser cookies
import cookie from "js-cookie";


// Function to create a new tag
// tag contains the tag details
// token is the authentication token of the logged-in admin
export const create = (tag, token) => {

    // Send a POST request to the backend tag endpoint
    return fetch(`${API}/tag`, {
        method: 'POST',

        // Specify the expected response format and request data format
        // Pass the authentication token to authorize the request
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        // Convert the tag object into a JSON string before sending it
        body: JSON.stringify(tag)
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};


// Function to retrieve all tags
export const getTagLists = () => {

    // Send a GET request to fetch all tags from the backend
    return fetch(`${API}/taglists`, {
        method: 'GET',
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};


// Function to retrieve a single tag using its slug
// slug uniquely identifies the tag in the URL
export const getSingleTag = (slug) => {

    // Send a GET request to retrieve the specified tag
    return fetch(`${API}/tag/${slug}`, {
        method: 'GET',
    })

    // Convert the backend response into JSON
    .then(response => response.json())

    // Handle network or request errors
    .catch(error => console.log(error));
};


// Function to delete a tag using its slug
// token is required to authorize the admin
export const removeTag = (slug, token) => {

    // Send a DELETE request to the backend to remove the specified tag
    return fetch(`${API}/tag/${slug}`, {
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