import "../styles/notification.scss";
import classNames from "classnames";
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
    <div className={classNames("notification-component", { "show": notificationData.show })}>
      <div className="content">
        <i className={classNames("far", {
          "fa-exclamation-circle error": notificationData.type === "error",
          "fa-engine-warning warning": notificationData.type === "warning",
          "fa-check-circle successfull": notificationData.type === "successfull"
        })}></i>

        <div className={classNames("notification-text", notificationData.type)}>
          <div className="title">{notificationData.title}</div>
          <div className="text">{notificationData.text}</div>
        </div>

        <i className={classNames("far fa-times", notificationData.type)} onClick={hideNotification}></i>
      </div>
    </div>
  );
}

export default PopupError;