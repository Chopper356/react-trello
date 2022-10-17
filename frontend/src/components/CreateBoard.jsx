import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../styles/modal.scss";
import ActivityService from "../lib/ActivityService"
import BoardsService from "../lib/BoardsService";
import { setNotification } from "../store/notificationData"

function CreateBoard(props) {
  const userData = useSelector((state) => state.user);
  const [board, setBoard] = useState({ title: "", image: null });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const createBoard = async (event) => {
    event.preventDefault();
    const { data, status } = await BoardsService.create(board);

    if (status === 200) {
      props.onHide(false);
      props.createBoard(data);
      dispatch(setNotification({ title: "Succesfull!", text: "Board created successfully", type: "succesfull" }));
      await ActivityService.create({ action: `${userData.user.name} created board ${data.title}`, author: userData.user._id, board: data._id });
    } else {
      console.log(data)
    }
  }

  const checkImageSize = (event) => {
    const file = event.target.files[0];
    const sizeErr = file.size > 5242880;

    if (sizeErr) return setError("Image size is too large");

    const reader = new FileReader();
    reader.onload = (e) => {
      setBoard({ ...board, image: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Board
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={createBoard}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" onChange={(event) => setBoard({ ...board, title: event.target.value })} name="title" placeholder="Enter board title" required />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select Board image</Form.Label>
            <Form.Control type="file" accept=".png, .jpg, .jpeg, .gif" onChange={checkImageSize} />
          </Form.Group>

          <Form.Label>{error}</Form.Label>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>Close</Button>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateBoard;