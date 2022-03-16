import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { Button, Nav, Navbar, Container } from "react-bootstrap";
import { isLogin, logout } from "../utils";

const PrivateRoute = ({ component: Component, history, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? (
          <div>
            <Navbar fixed="top">
              <Container>
                <Navbar.Brand>
                  <Link className="nav-link" to={"/stations"}>
                    PIAR
                  </Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                  <Link className="nav-link" to={"/stations"}>
                    Stations
                  </Link>
                  <Link className="nav-link" to={"/users"}>
                    Users
                  </Link>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                  <Button
                    variant="link"
                    onClick={() => {
                      logout();
                      props.history.push("/sign-in");
                    }}
                  >
                    Logout
                  </Button>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div className="container" style={{ marginTop: "100px" }}>
              <Component {...props} />
            </div>
          </div>
        ) : (
          <Redirect to="/sign-in" />
        )
      }
    />
  );
};

export default PrivateRoute;
