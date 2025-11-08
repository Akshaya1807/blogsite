import React from "react";
import Layout from "../../components/Layout";
import Private from "../../components/authentication/Private";
import CreateBlog from "../../components/crud/CreateBlog";

const CreateBlogPage = () => {
  return (
    <Layout>
      <Private>
        <div className="container">
          <h2 className="text-center mt-4 mb-4">Write a new blog</h2>
          <CreateBlog />
        </div>
      </Private>
    </Layout>
  );
};

export default CreateBlogPage;
