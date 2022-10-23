import classNames from "classnames";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styles from "../views/Board/index.module.scss";
import ActivityService from "../lib/ActivityService"
import { createCard } from "../store/boardData";

function CardCreator({ list, addCard }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const { id } = useParams();

  const handleChangeTaskInput = (e) => {
    const { value } = e.target;
    setCardTitle(value);
  };

  const createBoardCard = useCallback(async (e) => {
    e.preventDefault();
    dispatch(createCard({ title: cardTitle, list: list._id, board: id, author: userData._id }));
    await ActivityService.create({ action: `Create card ${cardTitle} in list ${list.title}`, author: userData._id, board: id });
    setCardTitle("");
  }, [dispatch, setCardTitle, cardTitle, list._id, id, userData._id, list.title]);

  return (
    <div className={classNames(styles.task_footer)}>
      {
        !showForm ?
          <div className={classNames(styles.show_actions, "mt-3")} onClick={() => setShowForm(true)}>Add a card...</div>
          :
          <form onSubmit={createBoardCard}>
            <textarea onInput={handleChangeTaskInput} value={cardTitle} name="content" type="text" className="w-100"></textarea>
            <div className={classNames(styles.card_add_actions, "d-flex justify-content-between")}>
              <span>
                <button type="submit">Add</button>
                <i className="fal fa-times ms-2" onClick={() => setShowForm(false)}></i>
              </span>
            </div>
          </form>
      }
    </div>
  );
}

export default CardCreator;