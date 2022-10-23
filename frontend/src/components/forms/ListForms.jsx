import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/modal-form.scss";

import ModalForm from "../ModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ActivityService from "../../lib/ActivityService";
import { editList, deleteList } from "../../store/boardData";

export const EditList = ({ onClose, listId }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const lists = useSelector((state) => state.board.lists);
  const list = lists.find((item) => item._id === listId);

  const [changedTitle, setChangedTitle] = useState(list.title);

  const submit = useCallback(async () => {
    dispatch(editList({ id: list._id, title: changedTitle }));
    await ActivityService.create({ action: `${userData.name} edited list ${list.title}`, author: userData._id, board: list.board });
    onClose();
  }, [dispatch, userData.name, userData._id, list._id, list.board, list.title, changedTitle, onClose]);

  return (
    <ModalForm
      show={true}
      onHide={() => onClose()}
      title="Edit List">

      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Check.Label className="me-3">List Title: {list.title}</Form.Check.Label>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Search..."
            value={changedTitle}
            onChange={(event) => setChangedTitle(event.target.value)}
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

export const DeleteList = ({ onClose, listId }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const lists = useSelector((state) => state.board.lists);
  const list = lists.find((item) => item._id === listId);

  const submit = useCallback(async () => {
    onClose();
    dispatch(deleteList(list._id));
    await ActivityService.create({ action: `${userData.name} deleted list ${list.title}`, author: userData._id, board: list.board });
  }, [onClose, dispatch, userData.name, list.title, list._id, userData._id, list.board]);

  return (
    <ModalForm
      show={true}
      onHide={() => onClose()}>

      <Modal.Body>
        <div className="delete-content">
          <i className="far fa-exclamation-circle delete-icon"></i>
          <div>Do you really want to delete list: {list.title}</div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Delete</Button>
      </Modal.Footer>

    </ModalForm>
  )
}