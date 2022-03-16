import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../utils";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? (
          <Redirect to="/stations" />
        ) : (
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Component {...props} />
            </div>
          </div>
        )
      }
    />
  );
};

export default PublicRoute;
