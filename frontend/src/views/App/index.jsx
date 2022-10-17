import classNames from "classnames";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./index.module.scss";
import Header from "../../components/Header";
import Boards from "../Boards";
import Board from "../Board";
import { setToken, getUser } from "../../store/userData";
import PopupNotification from "../../components/PopupNotification";


function App() {
  const dispatch = useDispatch();

  if (localStorage.token) {
    dispatch(setToken(localStorage.token));
    dispatch(getUser());
  }

  return (
    <div className={classNames(styles.App)}>
      <PopupNotification />
      <BrowserRouter>
        <Header></Header>

        <Routes>
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:id" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
