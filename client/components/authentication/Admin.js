import React, { useEffect, useState } from "react";
import Router from "next/router";
import { isAuthenticated } from "../../actions/authentication";

const Admin = ({ children }) => {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();

    if (!auth) {
      Router.push("/login");
    } else if (auth.user && auth.user.role !== 1) {
      Router.push("/");
    } else {
      setUserReady(true);
    }
  }, []);

  if (!userReady) return null;
  return <>{children}</>;
};

export default Admin;
