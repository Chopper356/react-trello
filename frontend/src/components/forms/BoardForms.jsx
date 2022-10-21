import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../../styles/modal-form.scss";
import ModalForm from "../ModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import UsersService from "../../lib/UsersService";
import ActivityService from "../../lib/ActivityService";
import Avatar from "../Avatar";
import { editBoard, deleteBoard, changeMembers } from "../../store/boardData";
import { setNotification } from "../../store/notificationData";

export const ChangeMembers = ({ onClose }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const board = useSelector((state) => state.board);
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const timeout = useRef(null);

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  const searchUsers = (value) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    timeout.current = setTimeout(async () => {
      const { data } = await UsersService.search(value);
      data.forEach((user) => user.selected = board.members.some(member => user._id === member));
      setUsers(data);
    }, 200);
  }

  const selectUser = (event, userId) => {
    const new_users = [...users];
    const idx = new_users.findIndex((item) => item._id === userId);
    new_users[idx].selected = event.target.checked;
    setUsers(new_users);
  }

  const submit = async () => {
    const selectedUsers = users.filter((item) => item.selected);
    dispatch(changeMembers({ id, users: selectedUsers }));
    await ActivityService.create({ action: `${userData.name} changed members`, author: userData._id, board: id });
    onClose();
    notification({ title: "Change board members!", text: "You have successfully changed board members", type: "successfull" });
  }

  return (
    <ModalForm
      show={true}
      onHide={() => onClose()}
      title="Change Members">

      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Search..."
            className="mb-4"
            onChange={(event) => searchUsers(event.target.value)}
          />

          {
            users.map((user) => {
              return (
                user._id !== board.author ? <Form.Check className="members-checkbox d-flex align-items-center" key={user._id}>
                  <Form.Check.Input
                    type="checkbox" className="me-3 ms-0"
                    checked={user.selected}
                    onChange={(event) => selectUser(event, user._id)}
                  />

                  <Avatar name={user.name} bgcolor="#0078BD" color="white" />
                  <Form.Check.Label className="me-3 ms-2">{user.name}</Form.Check.Label>
                </Form.Check> : null
              )
            })
          }

        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Submit</Button>
      </Modal.Footer>

    </ModalForm>
  )
}

export const EditBoard = ({ onClose }) => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board);

  const [changedTitle, setChangedTitle] = useState(board.title);

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  const submit = async () => {
    dispatch(editBoard({ id: board._id, title: changedTitle }));
    onClose();
    notification({ title: "Edit board!", text: "You have successfully edited this board", type: "successfull" });
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

export const DeleteBoard = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state) => state.board);

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  const submit = async () => {
    dispatch(deleteBoard(board._id));
    onClose();
    navigate("/boards");
    notification({ title: "Board deleted!", text: "You have successfully deleted board", type: "successfull" });
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