import "../styles/notification.scss";
import { useDispatch, useSelector } from "react-redux"
import { removeNotification } from "../store/notificationData";
import { useEffect, useCallback } from "react";

function PopupError() {
  const notificationData = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const hideNotification = useCallback(() => {
    dispatch(removeNotification());
  }, [dispatch]);

  useEffect(() => {
    if (notificationData.show) {
      setTimeout(() => {
        hideNotification();
      }, 3000);
    }
  }, [notificationData.show, hideNotification]);

  return (
    <div className={`notification-component ${notificationData.show ? 'show' : ''}`}>
      <div className="content">
        {
          notificationData.type === "error" ? <i className={`far fa-exclamation-circle ${notificationData.type}`}></i>
            : notificationData.type === "warning" ? <i className={`far fa-engine-warning ${notificationData.type}`}></i>
              : notificationData.type === "successfull" ? <i className={`far fa-check-circle ${notificationData.type}`}></i> : null
        }

        <div className={`notification-text ${notificationData.type}`}>
          <div className="title">{notificationData.title}</div>
          <div className="text">{notificationData.text}</div>
        </div>

        <i className={`far fa-times ${notificationData.type}`} onClick={hideNotification}></i>
      </div>
    </div>
  );
}

export default PopupError;