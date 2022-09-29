import { configureStore } from "@reduxjs/toolkit";
import counterComp from "./counter";

export default configureStore({
  reducer: {
    counter: counterComp
  },
})