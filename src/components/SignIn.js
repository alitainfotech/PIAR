import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { login } from "../utils";

const defSignInData = {
  login: "",
  password: "",
};

const SignIn = (props) => {
  const [user, setUser] = useState({ ...defSignInData });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const data = { ...user };

    axios
      .post(`users/auth`, data)
      .then(({ data }) => {
        const { user_jwt } = data;
        login(user_jwt);
        toast.success("Logged-in successfully!");
        props.history.push("/stations");
      })
      .catch((error) => {
        console.log(">Err: ", error);
        setUser(defSignInData);
        setValidated(false);
        toast.error("Invalid credentials!");
      });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="login"
          value={user.login}
          onChange={handleChange}
          placeholder="Enter username"
          required
        />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>

      <div>
        Don't have account?{" "}
        <Link className="navbar-brand" to={"/sign-up"}>
          Sign Up!
        </Link>
      </div>
    </Form>
  );
};

export default SignIn;
