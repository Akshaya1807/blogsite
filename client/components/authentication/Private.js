import React, { useEffect, useState } from "react";
import Router from "next/router";
import { isAuthenticated } from "../../actions/authentication";

const Private = ({ children }) => {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const user = isAuthenticated();
    if (!user) {
      Router.push("/login");
    } else {
      setUserReady(true);
    }
  }, []);

  return userReady ? <React.Fragment>{children}</React.Fragment> : null;
};

export default Private;
