import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

import { removeToken } from "../store/userData";
import '../styles/header.scss';
import Button from 'react-bootstrap/Button';
import LoginModal from "./LoginModal";
import DropdownMenu from "./DropdownMenu";

function Header() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [modalShow, setModalShow] = useState(false);

  const logout = () => {
    dispatch(removeToken());
  }

  const User = () => {
    return (userData.user.name) ?
      <div className="user">
        <span className="name">{userData.user.name}</span>
        <DropdownMenu menuContent={<span className="user-img fs-4">{userData.user.name[0]}</span>}>
          <span className="dropdown-menu-item" onClick={logout}>
            <i className="fas fa-sign-out me-2"></i>
            Logout
          </span>
        </DropdownMenu>
      </div>
      :
      <Button variant="success" onClick={() => setModalShow(true)}>SignIn</Button>
  }

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
          <User />
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
