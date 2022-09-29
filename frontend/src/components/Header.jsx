import { useState } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/header.scss';
import userTestImg from "../imgs/test-user.gif"
import LoginModal from "./LoginModal";

function Header() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <header className="app-header">
      <div className='header-content'>
        <div className='links'>
          <Link to="/boards">
            <i className="fas fa-table"></i>
            <span>Boards</span>
          </Link>
        </div>

        <div className='page-name'>
          Dashboard
        </div>

        <div className='user-icon'>
          <img src={userTestImg} alt="user" />

          <Button variant="success" onClick={() => setModalShow(true)}>SignIn</Button>

        </div>
      </div>

      <LoginModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </header>
  );
}

export default Header;
