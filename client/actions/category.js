import fetch from "isomorphic-fetch";
import { API } from "../config.js";
import cookie from "js-cookie";

// ✅ Create Category
export const create = (category, token) => {
    return fetch(`${API}/category`, {  // fixed (removed extra /api)
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// ✅ Get all categories
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => {
        console.error("❌ getCategories fetch failed:", error);
        return { error: "Failed to fetch categories" };
    });
};

// ✅ Get single category
export const getSingleCategory = (slug) => {
    return fetch(`${API}/category/${slug}`, {  // fixed
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// ✅ Remove category
export const removeCategory = (slug, token) => {
    return fetch(`${API}/category/${slug}`, {  // fixed
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};
