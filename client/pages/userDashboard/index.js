import Layout from "../../components/Layout";
import Private from "../../components/authentication/Private";
import Link from "next/link";
import BookIcon from "@material-ui/icons/Book";

const UserDashboard = () => {
  return (
    <Layout>
      <Private>
        <div className="container text-center">
          <h2 className="pt-4 pb-4">User Dashboard</h2>
          <Link href="/userDashboard/create-blog">
            <button className="btn btn-primary">
              Write a New Blog <BookIcon />
            </button>
          </Link>
          <Link href="/userDashboard/my-blogs">
            <button className="btn btn-success mt-3">
              My Blogs
            </button>
          </Link>
        </div>
      </Private>
    </Layout>
  );
};

export default UserDashboard;
