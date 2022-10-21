import { configureStore } from "@reduxjs/toolkit";
import notificationData from "./notificationData";
import boards from "./boardsData";
import board from "./boardData";
import userData from "./userData";

export default configureStore({
  reducer: {
    user: userData,
    notification: notificationData,
    boards: boards,
    board: board
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})