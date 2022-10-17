import { configureStore } from "@reduxjs/toolkit";
import notificationData from "./notificationData";
import userData from "./userData";

export default configureStore({
  reducer: {
    user: userData,
    notification: notificationData
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})