// Import fetch to make HTTP requests to the backend API
import fetch from "isomorphic-fetch";

// Import the base URL of the backend API
import {API} from "../config.js";

// Import js-cookie library to manage browser cookies
import cookie from "js-cookie";


// Function to register a new user
export const signup = (user) => {

    // Send a POST request to the signup endpoint with the user's details
    return fetch(`${API}/signup`, {
        method: 'POST',

        // Specify that the client accepts JSON and is sending JSON data
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        // Convert the JavaScript user object into a JSON string before sending it
        body: JSON.stringify(user)
    })

        // Convert the backend response into JSON
        .then(response => {
            return response.json();
        })

        // Handle network or request errors
        .catch(error => console.log(error));
};


// Function to log in an existing user
export const login = (user) => {

    // Send a POST request to the login endpoint with the user's credentials
    return fetch(`${API}/login`, {
        method: 'POST',

        // Specify the request and response data format as JSON
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },

        // Convert the user object into a JSON string
        body: JSON.stringify(user)
    })

        // Convert the backend response into JSON
        .then(response => {
            return response.json();
        })

        // Handle network or request errors
        .catch(error => console.log(error));
};


// Function to log out the user
// next is a callback function that executes after clearing local authentication data
export const logout = (next) => {

    // Remove the authentication token from browser cookies
    removeCookie('token');

    // Remove the logged-in user's information from localStorage
    removeLocalStorage('user');

    // Execute the callback function, usually to redirect the user
    next();

    // Send a GET request to the backend logout endpoint
    return fetch(`${API}/logout`, {
        method: "GET"
    })

        // Log a message after receiving the response
        .then(response => {
            console.log("Successfully Logged Out");
        })

        // Handle request errors
        .catch(err => console.log(err));
};


// Function to store a value in browser cookies
export const setCookie = (key, value) => {

    // Check whether the code is running in the browser
    if (process.browser) {

        // Store the cookie with the given key and value
        // Set its expiry time to 365 days
        cookie.set(key, value, {
            expires: 365
        });
    }
};


// Function to remove a cookie from the browser
export const removeCookie = (key) => {

    // Execute only in the browser environment
    if (process.browser) {

        // Remove the cookie associated with the given key
        cookie.remove(key, {
            expires: 365
        });
    }
};


// Function to retrieve a cookie value using its key
export const getCookie = (key) => {

    // Execute only in the browser environment
    if (process.browser) {

        // Return the value of the requested cookie
        return cookie.get(key);
    }
};


// Function to store user information in localStorage
export const setLocalStorage = (key, value) => {

    // Check whether the code is running in the browser
    if (process.browser) {

        // Convert the JavaScript value into a JSON string and store it
        localStorage.setItem(key, JSON.stringify(value));
    }
};


// Function to remove an item from localStorage
export const removeLocalStorage = (key) => {

    // Execute only in the browser environment
    if (process.browser) {

        // Remove the item associated with the given key
        localStorage.removeItem(key);
    }
};


// Function to authenticate a user after successful login or signup
// data contains the token and user information received from the backend
// next is a callback function that executes after storing authentication data
export const authenticate = (data, next) => {

    // Store the authentication token in a browser cookie
    setCookie('token', data.token);

    // Store the user's information in localStorage
    setLocalStorage('user', data.user);

    // Execute the callback function, usually to redirect the user
    next();
};


// Function to check whether a user is authenticated
export const isAuthenticated = () => {

    // Check whether the code is running in the browser
    if (process.browser) {

        // Retrieve the authentication token from cookies
        const checkingCookie = getCookie('token');

        // Check whether an authentication token exists
        if (checkingCookie) {

            // Check whether user information exists in localStorage
            if (localStorage.getItem('user')) {

                // Convert the stored JSON string back into a JavaScript object
                // Return the logged-in user's information
                return JSON.parse(localStorage.getItem('user'));

            } else {

                // Return false if user information is missing
                return false;
            }
        }
    }
};