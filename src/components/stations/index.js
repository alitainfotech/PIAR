import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { filteredData, getToken } from "../../utils";

const defStationData = {
  name: "",
  comment: "",
};

const Stations = () => {
  const [token] = useState(getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [stationList, setStationList] = useState([]);

  const [validated, setValidated] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [station, setStation] = useState(defStationData);

  const headers = {
    headers: {
      "user-jwt": token,
    },
  };

  const loadData = () => {
    setIsLoading(true);

    axios
      .get(`stations`, headers)
      .then(({ data }) => {
        setStationList(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(">Err: ", error);
        setIsLoading(false);
        toast.error("Error fetching stations!");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setStation({ ...station, [e.target.name]: e.target.value });
  };

  const deleteStation = (stationId) => {
    if (!window.confirm("Sure to delete?")) return;

    axios
      .delete(`stations/${stationId}`, headers)
      .then(({ data }) => {
        loadData();
        toast.success("Station deleted successfully!");
      })
      .catch((error) => {
        console.log(">Err: ", error);
        toast.error("Error, deleting station!");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const data = { ...station };

    if (data.id) {
      const finalData = filteredData(data, Object.keys(defStationData));

      axios
        .patch(`stations/${data.id}`, finalData, headers)
        .then(({ data }) => {
          loadData();
          toast.success("Station updated successfully!");
        })
        .catch((error) => {
          console.log(">Err: ", error);

          const { data } = (error && error.response) || {};
          const errMsg = (data && data.error) || "Error, updating station!";
          toast.error(errMsg);
        })
        .finally(() => closeModal());
    } else {
      axios
        .post(`stations`, data, headers)
        .then(({ data }) => {
          loadData();
          toast.success("Station created successfully!");
        })
        .catch((error) => {
          console.log(">Err: ", error);

          const { data } = (error && error.response) || {};
          const errMsg = (data && data.error) || "Error, creating station!";
          toast.error(errMsg);
        })
        .finally(() => closeModal());
    }
  };

  const updateStation = (stationId) => {
    const stObj = stationList.find((v) => v.id === stationId);
    setStation({ ...stObj });
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setValidated(false);
  };

  return (
    <div>
      <h1>Stations</h1>

      <Button
        type="button"
        className="mb-2"
        onClick={() => {
          setStation(defStationData);
          setAddModal(true);
        }}
      >
        Add Station
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
                <th>Station Name</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {stationList.length ? (
                stationList.map((data, index) => (
                  <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.comment}</td>
                    <td>
                      <Button
                        variant="primary"
                        type="button"
                        size="sm"
                        onClick={() => updateStation(data.id)}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        variant="danger"
                        type="button"
                        size="sm"
                        onClick={() => deleteStation(data.id)}
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
              <Form.Label>Station Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={station.name}
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
                value={station.comment}
                onChange={handleChange}
                placeholder="Enter comment"
                required
              />
              <Form.Control.Feedback type="invalid">
                Required
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              {station.id ? "Update" : "Add"}
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

export default Stations;
