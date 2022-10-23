import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, getUser } from "../store/userData";

import "../styles/modal.scss";
import AuthService from "../lib/AuthService";

function LoginModal(props) {
  const dispatch = useDispatch()

  const [modalTitle, setModalTitle] = useState("SignIn");
  const [modalLogin, setModalLogin] = useState({ email: "", password: "" });
  const [modalReg, setModalReg] = useState({ name: "", email: "", password: "", password2: "" });

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setModalLogin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeReg = (e) => {
    const { name, value } = e.target;
    setModalReg(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const signIn = useCallback(async (event) => {
    event.preventDefault();
    const { data } = await AuthService.signIn(modalLogin);

    dispatch(setToken(data.token));
    dispatch(getUser());
    setModalTitle("SignIn");
    props.onHide();
  }, [modalLogin, dispatch, setModalTitle, props]);

  const signUp = useCallback(async (event) => {
    event.preventDefault();
    const { data } = await AuthService.signUp(modalReg);

    dispatch(setToken(data.token));
    dispatch(getUser());
    setModalTitle("SignIn");
    props.onHide();
  }, [modalReg, dispatch, setModalTitle, props]);

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Tabs
        defaultActiveKey="SignIn"
        id="uncontrolled-tab-example"
        onSelect={(val) => setModalTitle(val)}
        className="mb-3"
      >
        <Tab eventKey="SignIn" title="SignIn">
          <Form onSubmit={modalTitle === "SignIn" ? signIn : signUp}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" onInput={handleChangeLogin} name="email" placeholder="Enter email" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onInput={handleChangeLogin} name="password" placeholder="Password" required />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={props.onHide}>Close</Button>
              <Button type="submit">Submit</Button>
            </Modal.Footer>
          </Form>
        </Tab>
        <Tab eventKey="SignUp" title="SignUp">
          <Form onSubmit={modalTitle === "SignIn" ? signIn : signUp}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" onInput={handleChangeReg} name="name" placeholder="Enter your username" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" onInput={handleChangeReg} name="email" placeholder="Enter email" required />
                <Form.Text className="text-muted">
                  We"ll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onInput={handleChangeReg} name="password" placeholder="Password" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onInput={handleChangeReg} name="password2" placeholder="Repeat your password" required />
              </Form.Group>

              <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Close</Button>
                <Button type="submit">Submit</Button>
              </Modal.Footer>
            </Modal.Body>
          </Form>
        </Tab>
      </Tabs>


    </Modal>
  );
}

export default LoginModal;