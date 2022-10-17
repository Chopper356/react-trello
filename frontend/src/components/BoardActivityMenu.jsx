import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "../styles/board-activity-menu.scss";

import ActivityService from "../lib/ActivityService";

function BoardActivityMenu(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    setShowMenu(true);
    const BoardActivity = async () => {
      setActivity(await ActivityService.boardActivity(props.board._id))
    }
    BoardActivity();
  }, [props.board])

  const activityRender = useCallback(({ author, action, date, _id }) => (
    <div className="item" key={_id}>
      <div className="top">
        <span>{author.name}</span>
        <span className="date ms-2">{dayjs(date).format("YYYY-MM-DD H:mm:ss")}</span>
      </div>
      <div className="action">{action}</div>
    </div>
  ), []);

  return (
    <div className={`board-activity-menu ${showMenu ? 'show' : ''}`}>
      <div className="menu-header d-flex justify-content-between align-items-center">
        <div className="title">
          <i className="far fa-align-center fix-width fs-4"></i>
          <span className="fs-5 ms-3">Activity</span>
        </div>

        <i className="fal fa-times fs-4" onClick={() => { setShowMenu(false); props.onClose() }}></i>
      </div>

      <div className="content">
        {
          activity.length ? activity.map(activityRender) : null
        }
      </div>
    </div>
  );
}

export default BoardActivityMenu;