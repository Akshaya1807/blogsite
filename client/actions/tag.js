import fetch from "isomorphic-fetch";
import { API } from "../config.js";
import cookie from "js-cookie";

// ✅ Create Tag
export const create = (tag, token) => {
    return fetch(`${API}/tag`, {  // fixed (removed extra /api)
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tag)
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// ✅ Get all tags
export const getTagLists = () => {
    return fetch(`${API}/taglists`, {  // fixed (removed extra /api)
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// ✅ Get single tag
export const getSingleTag = (slug) => {
    return fetch(`${API}/tag/${slug}`, {  // fixed
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// ✅ Remove tag
export const removeTag = (slug, token) => {
    return fetch(`${API}/tag/${slug}`, {  // fixed
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
