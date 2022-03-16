import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

import { logout, isLogin } from "../utils";

const Home = (props) => {
  const [isLoggedIn] = useState(isLogin());

  return (
    <div>
      <h1>Home</h1>

      {isLoggedIn ? (
        <button
          onClick={() => {
            logout();
            props.history.push("/sign-in");
          }}
        >
          Click here to log out
        </button>
      ) : (
        <Link to="/sign-in">Go to sign in page</Link>
      )}
    </div>
  );
};

export default Home;
