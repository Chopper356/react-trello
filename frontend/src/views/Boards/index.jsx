import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import classNames from "classnames";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import styles from "./index.module.scss";
import CreateBoard from "../../components/CreateBoard";
import Menu from "../../components/DropdownMenu";
import { setNotification } from "../../store/notificationData";
import { EditBoard, DeleteBoard } from "../../components/forms/BoardsForms";
import { getBoards, createBoard, selectBoard } from "../../store/boardsData";

function Boards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const boards = useSelector((state) => state.boards.items);
  const [modalShow, setModalShow] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    dispatch(getBoards());
  }, [dispatch]);

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  const checkAccess = useCallback((board) => {
    return (board.author !== user._id && !board.members.some((member) => member === user._id));
  }, [user._id]);

  const checkLink = useCallback((event, board) => {
    event.preventDefault();

    if (board.author !== user._id) {
      if (board.members.some((member) => member === user._id)) {
        navigate(`/boards/${board._id}`);
      } else {
        notification({ title: "Access Denied!", text: "Request access from creator", type: "error" });
      }
    } else {
      navigate(`/boards/${board._id}`);
    }
  }, [notification, user._id, navigate]);

  const renderBoards = useCallback((board) => (
    <div className='col-sm-4 mb-4' key={board._id}>
      <div className={classNames(styles.board)}>
        {board.image && <img src={board.image} alt="bg" />}
        <Link onClick={(event) => checkLink(event, board)} className={classNames(styles.title)}>
          {checkAccess(board) && <i className="fas fa-lock me-2"></i>}
          {board.title}
        </Link>

        <div className='menu'>
          {
            user._id === board.author ?
              <Menu icon={true}>
                <span className="dropdown-menu-item" onClick={() => { dispatch(selectBoard(board)); setModal("edit") }}>Edit Board</span>
                <span className="dropdown-menu-item" onClick={() => { dispatch(selectBoard(board)); setModal("delete") }}>Delete Board</span>
              </Menu> : null
          }
        </div>
      </div>
    </div>
  ), [user._id, checkLink, checkAccess, dispatch]);

  return (
    <div className={classNames(styles.boards_tab, "mt-5")}>
      {modal === "edit" && <EditBoard onClose={() => setModal(null)} />}
      {modal === "delete" && <DeleteBoard onClose={() => setModal(null)} />}

      <CreateBoard
        show={modalShow}
        onHide={() => setModalShow(false)}
        createBoard={(board) => dispatch(createBoard(board))}
      />

      <Tabs
        defaultActiveKey="all"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="all" title="All Boards">
          <div className={classNames(styles.boards)}>
            <div className={classNames(styles.row, "row justify-content-start")}>
              {boards.map(renderBoards)}
              <div className='col-sm-4 mb-2' onClick={() => setModalShow(true)}>
                <div className={classNames(styles.board, styles.create_board)}>
                  <div>Create new board...</div>
                </div>
              </div>
            </div>

          </div>
        </Tab>
        <Tab eventKey="profile" title="My Boards">
          <div className={classNames(styles.boards)}>
            <div className={classNames(styles.row, "row justify-content-start")}>
              {boards.filter((item) => item.author === user._id).map(renderBoards)}
              <div className='col-sm-4 mb-2' onClick={() => setModalShow(true)}>
                <div className={classNames(styles.board, styles.create_board)}>
                  <div>Create new board...</div>
                </div>
              </div>
            </div>

          </div>
        </Tab>
      </Tabs>
    </div >
  );
}

export default Boards;
