import classNames from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styles from "../views/Board/index.module.scss";
import CardsService from "../lib/CardsService";
import ActivityService from "../lib/ActivityService"

function CardCreator({ list, addCard }) {
  const userData = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const { id } = useParams();

  const handleChangeTaskInput = (e) => {
    const { value } = e.target;
    setCardTitle(value);
  };

  const createCard = async (e) => {
    e.preventDefault();
    const card = await CardsService.create({ title: cardTitle, list: list._id, board: id, author: userData.user._id });
    await ActivityService.create({ action: `Create card ${card.title} in list ${list.title}`, author: userData.user._id, board: id });
    addCard(card);
    // setShowForm(false);
    setCardTitle("");
  }

  return (
    <div className={classNames(styles.task_footer)}>
      {
        !showForm ?
          <div className={classNames(styles.show_actions, "mt-3")} onClick={() => setShowForm(true)}>Add a card...</div>
          :
          <form onSubmit={createCard}>
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