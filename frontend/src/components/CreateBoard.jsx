import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import "../styles/modal.scss";
import { createBoard } from "../store/boardsData";
import { setNotification } from "../store/notificationData"

function CreateBoard({ show, onHide }) {
  const [board, setBoard] = useState({ title: "", image: null });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const boardCreate = useCallback(async (event) => {
    event.preventDefault();

    onHide(false);
    dispatch(createBoard(board));
    dispatch(setNotification({ title: "Successfull!", text: "Board created successfully", type: "successfull" }));
  }, [onHide, dispatch, board]);

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
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Board
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={boardCreate}>
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
          <Button variant="danger" onClick={onHide}>Close</Button>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateBoard;