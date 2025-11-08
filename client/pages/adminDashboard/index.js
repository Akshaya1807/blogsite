import Layout from "../../components/Layout";
import Admin from "../../components/authentication/Admin";
import Link from "next/link";
import LabelIcon from "@material-ui/icons/Label";
import CategoryIcon from "@material-ui/icons/Category";
import BookIcon from "@material-ui/icons/Book";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center pt-4 display-4">Admin Dashboard</h2>
            </div>

            <div className="row text-center d-flex justify-content-center">

              {/* ✅ Create Category */}
              <div className="pt-4 pb-4 pl-5 pr-5">
                <Link href="/adminDashboard/update/category-tag">
                  <button className="btn btn-success p-4">
                    <div className="h4">
                      Create new category <CategoryIcon />
                    </div>
                  </button>
                </Link>
              </div>

              {/* ✅ Create Tag */}
              <div className="pt-4 pb-4 pl-5 pr-5">
                <Link href="/adminDashboard/update/category-tag">
                  <button className="btn btn-info p-4">
                    <div className="h4">
                      Create new tag <LabelIcon />
                    </div>
                  </button>
                </Link>
              </div>

              {/* ✅ Create Blog */}
              <div className="pt-4 pb-4 pl-5 pr-5">
                <Link href="/adminDashboard/update/create-blog">
                  <button className="btn btn-warning p-4">
                    <div className="h4">
                      Create new blog <BookIcon />
                    </div>
                  </button>
                </Link>
              </div>

              {/* ✅ Edit Blog */}
              <div className="pt-4 pb-4 pl-5 pr-5">
                <Link href="/adminDashboard/update/editblog">
                  <button className="btn btn-primary p-4">
                    <div className="h4">
                      Update blogs <BookIcon />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
