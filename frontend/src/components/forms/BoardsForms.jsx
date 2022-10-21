import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../../styles/modal-form.scss";
import ModalForm from "../ModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { editBoard, deleteBoard } from "../../store/boardsData";

export const EditBoard = ({ onClose }) => {
  const dispatch = useDispatch();
  const { items, selected } = useSelector((state) => state.boards);
  const board = items.find((item) => item._id === selected._id);
  const [editValues, setEditValues] = useState({ title: board.title });

  const submit = async () => {
    dispatch(editBoard({ id: board._id, title: editValues.title }))
    onClose();
  }

  return (
    <ModalForm
      show={true}
      onHide={() => onClose()}
      title="Edit Board">

      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Check.Label className="me-3">Board Title:</Form.Check.Label>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Search..."
            value={editValues.title}
            onChange={(event) => setEditValues({ ...editValues, title: event.target.value })}
            className="mb-4"
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Submit</Button>
      </Modal.Footer>

    </ModalForm>
  )
}

export const DeleteBoard = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, selected } = useSelector((state) => state.boards);
  const board = items.find((item) => item._id === selected._id);

  const submit = async () => {
    onClose();
    dispatch(deleteBoard(board._id));
    navigate("/boards");
  }

  return (
    <ModalForm
      show={true}
      onHide={() => onClose()}>
      {
        board &&
        <Modal.Body>
          <div className="delete-content">
            <i className="far fa-exclamation-circle delete-icon"></i>
            <div>Do you really want to delete board: {board.title}</div>
          </div>
        </Modal.Body>
      }

      <Modal.Footer>
        <Button variant="danger" onClick={() => onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Delete</Button>
      </Modal.Footer>

    </ModalForm>
  )
}