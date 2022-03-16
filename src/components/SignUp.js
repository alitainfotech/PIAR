import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import axios from "axios";

const defSignUpData = {
  name: "",
  comment: "",
  login: "",
  password: "",
};

const SignUp = (props) => {
  const [user, setUser] = useState({ ...defSignUpData });
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
      .post(`${process.env.REACT_APP_PIAR_API_URL}users`, data)
      .then(({ data }) => {
        props.history.push("/sign-in");
        toast.success("Account created successfully!");
      })
      .catch((error) => {
        console.log(">Err: ", error);
        const { data } = error.response;
        setUser({
          ...user,
          login: "",
          password: "",
        });
        setValidated(false);

        const errMsg = (data && data.error) || "Error, account creation!";
        toast.error(errMsg);
      });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
        />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicComment">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          name="comment"
          value={user.comment}
          onChange={handleChange}
          placeholder="Enter comment"
          required
        />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

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
        Already have account,{" "}
        <Link className="navbar-brand" to={"/sign-in"}>
          Sign In!
        </Link>
      </div>
    </Form>
  );
};

export default SignUp;
