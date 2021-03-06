import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  Table,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { filteredData, getToken } from "../../utils";

const defUserData = {
  name: "",
  comment: "",
  login: "",
  password: "",
};

const Users = () => {
  const [token] = useState(getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState(defUserData);
  const [addModal, setAddModal] = useState(false);

  const headers = {
    headers: {
      "user-jwt": token,
    },
  };

  const loadData = () => {
    setIsLoading(true);

    axios
      .all([axios.get(`users/me`, headers), axios.get(`users`, headers)])
      .then(
        axios.spread((...responses) => {
          setIsLoading(false);

          const { data } = responses[0];
          setCurrUser(data);

          const usersList = responses[1].data;
          const userIndex = usersList.findIndex((v) => v.id === data.id);
          usersList.splice(userIndex, 1);
          setUserList(usersList);
        })
      )
      .catch((error) => {
        console.log(">Err: ", error);
        setIsLoading(false);
        toast.error("Error loading users list!");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const deleteUser = (userId) => {
    if (!window.confirm("Sure to delete?")) return;

    axios
      .delete(`users/${userId}`, headers)
      .then(({ data }) => {
        loadData();
        toast.success("User deleted successfully!");
      })
      .catch((error) => {
        console.log(">Err: ", error);
        toast.error("Error deleting user!");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const data = { ...user };

    if (data.id) {
      const finalData = filteredData(data, Object.keys(defUserData));

      axios
        .patch(
          `${process.env.REACT_APP_PIAR_API_URL}users/${data.id}`,
          finalData,
          headers
        )
        .then(({ data }) => {
          loadData();
          toast.success("User updated successfully!");
        })
        .catch((error) => {
          console.log(">Err: ", error);

          const { data } = (error && error.response) || {};
          const errMsg = (data && data.error) || "Error, updating user!";
          toast.error(errMsg);
        })
        .finally(() => closeModal());
    } else {
      axios
        .post(`users`, data, headers)
        .then(({ data }) => {
          loadData();
          toast.success("User created successfully!");
        })
        .catch((error) => {
          console.log(">Err: ", error);

          const { data } = (error && error.response) || {};
          const errMsg = (data && data.error) || "Error, creating user!";
          toast.error(errMsg);
        })
        .finally(() => closeModal());
    }
  };

  const updateUser = (userId) => {
    const stObj = userList.find((v) => v.id === userId);
    setUser({ ...stObj, password: "" });
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setValidated(false);
  };

  return (
    <div>
      <h1>Users</h1>

      <Button
        type="button"
        className="mb-2"
        onClick={() => {
          setUser(defUserData);
          setAddModal(true);
        }}
      >
        Add User
      </Button>

      <div className="pb-2">
        {isLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {userList.length ? (
                userList.map((data, index) => (
                  <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.comment}</td>
                    <td>
                      <Button
                        variant="primary"
                        type="button"
                        size="sm"
                        onClick={() => updateUser(data.id)}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        variant="danger"
                        type="button"
                        size="sm"
                        onClick={() => deleteUser(data.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan={4}>
                    No Records Found!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      <Modal show={addModal} onHide={closeModal}>
        <ModalBody>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                name="comment"
                value={user.comment}
                onChange={handleChange}
                placeholder="Enter comment"
                required
              />
              <Form.Control.Feedback type="invalid">
                Required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                Username{" "}
                {user.id && (
                  <Form.Text className="text-muted">
                    (Leave blank, for no change.)
                  </Form.Text>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={user.login}
                onChange={handleChange}
                placeholder="Enter username"
                required={!user.id}
              />
              <Form.Control.Feedback type="invalid">
                Required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>
                Password{" "}
                {user.id && (
                  <Form.Text className="text-muted">
                    (Leave blank, for no change.)
                  </Form.Text>
                )}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter password"
                required={!user.id}
              />
              <Form.Control.Feedback type="invalid">
                Required
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              {user.id ? "Update" : "Add"}
            </Button>{" "}
            <Button variant="secondary" type="button" onClick={closeModal}>
              Close
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Users;
