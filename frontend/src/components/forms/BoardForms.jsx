import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "../../styles/modal-form.scss";
import ModalForm from "../ModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import UsersService from "../../lib/UsersService";
import BoardsService from "../../lib/BoardsService";
import ActivityService from "../../lib/ActivityService";
import Avatar from "../Avatar";

export const ChangeMembers = ({ board, onClose, changeMembers }) => {
  const userData = useSelector((state) => state.user);
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const timeout = useRef(null);

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
    await BoardsService.changeMembers({ id, users: selectedUsers });
    await ActivityService.create({ action: `${userData.user.name} changed members`, author: userData.user._id, board: id });
    changeMembers(selectedUsers.map(item => item._id));
    onClose();
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

export const EditBoard = (props) => {
  const [title, setTitle] = useState(props.board.title);

  const submit = async () => {
    await BoardsService.edit({ id: props.board._id, title });
    props.edit(props.board._id, title);
    props.onClose();
  }

  return (
    <ModalForm
      show={true}
      onHide={() => props.onClose()}
      title="Edit Board">

      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Check.Label className="me-3">Board Title:</Form.Check.Label>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Search..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mb-4"
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => props.onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Submit</Button>
      </Modal.Footer>

    </ModalForm>
  )
}

export const DeleteBoard = (props) => {
  const navigate = useNavigate();

  const submit = async () => {
    await BoardsService.delete(props.board._id);
    props.onClose();
    if (props.deleteBoard) props.deleteBoard(props.board);
    navigate("/boards");
  }

  return (
    <ModalForm
      show={true}
      onHide={() => props.onClose()}>

      <Modal.Body>
        <div className="delete-content">
          <i className="far fa-exclamation-circle delete-icon"></i>
          <div>Do you really want to delete board: {props.board.title}</div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => props.onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Delete</Button>
      </Modal.Footer>

    </ModalForm>
  )
}