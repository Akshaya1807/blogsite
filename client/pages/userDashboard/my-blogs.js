import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Private from "../../components/authentication/Private";
import { getCookie, isAuthenticated } from "../../actions/authentication";
import { listUserBlogs, removeBlog } from "../../actions/blog";
import Link from "next/link";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  const loadBlogs = () => {
    listUserBlogs(isAuthenticated().user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  return (
    <Layout>
      <Private>
        <div className="container">
          <h2 className="text-center mt-4 mb-4">My Blogs</h2>

          {message && <div className="alert alert-warning">{message}</div>}

          {blogs.map((blog, i) => (
            <div key={i} className="pb-3">
              <h4>{blog.title}</h4>
              <p className="mark">
                Written by {blog.postedBy.name} | Published on{" "}
                {new Date(blog.updatedAt).toDateString()}
              </p>

              <Link href={`/blogs/${blog.slug}`} className="btn btn-primary btn-sm mr-2">
                Read
              </Link>

              <Link href={`/userDashboard/update/${blog.slug}`} className="btn btn-warning btn-sm mr-2">
                Update
              </Link>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteConfirm(blog.slug)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </Private>
    </Layout>
  );
};

export default UserBlogs;
