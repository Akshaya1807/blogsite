import React from "react";
import Layout from "../../../components/Layout";
import Admin from "../../../components/authentication/Admin";
import NewBlog from "../../../components/update/NewBlog";

const CreateBlog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid pt-3 pb-3">
          <h2 className="text-center pb-3">✍️ Create a New Blog</h2>
          <NewBlog />
        </div>
      </Admin>
    </Layout>
  );
};

export default CreateBlog;
