import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import classNames from "classnames";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import styles from "./index.module.scss";
import BoardsService from "../../lib/BoardsService";
import CreateBoard from "../../components/CreateBoard";
import Menu from "../../components/DropdownMenu";
import { setNotification } from "../../store/notificationData";
import { EditBoard, DeleteBoard } from "../../components/forms/BoardForms";

function Boards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [myBoards, setMyBoards] = useState([]);
  const [boards, setBoards] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const getBoards = useCallback(async () => {
    const { data } = await BoardsService.getAll();
    const filterd_boards = data.filter((board) => board.author === userData.user._id);
    setBoards(data);
    setMyBoards(filterd_boards);
  }, [userData]);

  useEffect(() => {
    getBoards();
  }, [userData, getBoards]);

  const createBoard = (board) => {
    setBoards([...boards, board]);
    setMyBoards([...myBoards, board]);
  }

  const editBoard = (id, title) => {
    console.log(id, title)
    const new_boards = boards.map((item) => {
      if (item._id === id) item.title = title;
      return item;
    })

    setBoards(new_boards);
  }

  const deleteBoard = (board) => {
    let new_boards = boards;
    let board_idx = new_boards.findIndex((item) => item._id === board._id);
    new_boards.splice(board_idx, 1);

    setBoards(new_boards);
  }

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  const checkAccess = useCallback((board) => {
    return (board.author !== userData.user._id && !board.members.some((member) => member === userData.user._id));
  }, [userData.user._id]);

  const checkLink = useCallback((event, board) => {
    event.preventDefault();

    if (board.author !== userData.user._id) {
      if (board.members.some((member) => member === userData.user._id)) {
        navigate(`/boards/${board._id}`);
      } else {
        notification({ title: "Access Denied!", text: "Login denied, request access from creator", type: "error" });
      }
    } else {
      navigate(`/boards/${board._id}`);
    }
  }, [notification, userData.user._id, navigate])

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
            userData.user._id === board.author ?
              <Menu icon={true}>
                <span className="dropdown-menu-item" onClick={() => { setSelectedBoard(board); setModal("edit") }}>Edit Board</span>
                <span className="dropdown-menu-item" onClick={() => { setSelectedBoard(board); setModal("delete") }}>Delete Board</span>
              </Menu> : null
          }
        </div>
      </div>
    </div>
  ), [userData.user._id, checkLink, checkAccess]);

  return (
    <div className={classNames(styles.boards_tab, "mt-5")}>
      {modal === "edit" && <EditBoard onClose={() => setModal(null)} edit={(id, title) => editBoard(id, title)} board={selectedBoard} />}
      {modal === "delete" && <DeleteBoard onClose={() => setModal(null)} board={selectedBoard} deleteBoard={(board) => deleteBoard(board)} />}

      <CreateBoard
        show={modalShow}
        onHide={() => setModalShow(false)}
        createBoard={createBoard}
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
              {myBoards.map(renderBoards)}
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
