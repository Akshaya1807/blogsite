import fetch from "isomorphic-fetch";
import { API } from "../config.js";
import queryString from "query-string";

export const createBlog = (blog, token) => {
  return fetch(`${API}/blog`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const listBlogsWithCategoriesAndTaglists = (skip, limit) => {
  const data = { limit, skip };
  return fetch(`${API}/bloglists-categories-taglists`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const singleBlog = async (slug) => {
  try {
    const response = await fetch(`${API}/blog/${slug}`, { method: "GET" });

    if (!response.ok) {
      console.error("❌ Failed to fetch blog:", response.status);
      return { error: `Failed to fetch blog. Status: ${response.status}` };
    }

    const data = await response.json();
    if (!data) {
      return { error: "No blog data found" };
    }

    return data;
  } catch (err) {
    console.error("❌ Error fetching single blog:", err);
    return { error: "Something went wrong while fetching blog" };
  }
};


export const blogListRelated = (blog) => {
  return fetch(`${API}/bloglists/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const listingTheBlog = () => {
  return fetch(`${API}/bloglists`, { method: "GET" })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const removingTheBlog = (slug, token) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const updatingTheBlog = (blog, token, slug) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const listSearchBlogItems = (params) => {
  let query = queryString.stringify(params);
  return fetch(`${API}/bloglists/search?${query}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
