import { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/modal-form.scss";

import ModalForm from "../ModalForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListsService from "../../lib/ListsService";
import ActivityService from "../../lib/ActivityService";

export const EditList = (props) => {
  const userData = useSelector((state) => state.user);
  const [title, setTitle] = useState(props.list.title);

  const submit = async () => {
    const list = await ListsService.edit(props.list._id, title);
    setTitle(list.title);
    props.edit({ _id: props.list._id, title });
    await ActivityService.create({ action: `${userData.user.name} edited list ${props.list.title}`, author: userData.user._id, board: props.list.board });
    props.onClose();
  }

  return (
    <ModalForm
      show={true}
      onHide={() => props.onClose()}
      title="Edit List">

      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Check.Label className="me-3">List Title: {props.list.title}</Form.Check.Label>
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

export const DeleteList = (props) => {
  const userData = useSelector((state) => state.user);

  const submit = async () => {
    await ListsService.delete(props.list._id);
    await ActivityService.create({ action: `${userData.user.name} deleted list ${props.list.title}`, author: userData.user._id, board: props.list.board });
    props.delete(props.list);
    props.onClose();
  }

  return (
    <ModalForm
      show={true}
      onHide={() => props.onClose()}>

      <Modal.Body>
        <div className="delete-content">
          <i className="far fa-exclamation-circle delete-icon"></i>
          <div>Do you really want to delete list: {props.list.title}</div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => props.onClose()}>Close</Button>
        <Button type="submit" onClick={submit}>Delete</Button>
      </Modal.Footer>

    </ModalForm>
  )
}