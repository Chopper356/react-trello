import { createSlice } from "@reduxjs/toolkit"

export const notificationData = createSlice({
  name: "error",
  initialState: {
    title: "",
    text: "",
    show: false,
    type: ""
  },
  reducers: {
    setNotification: (state, action) => {
      state.title = action.payload.title;
      state.text = action.payload.text;
      state.type = action.payload.type;
      state.show = true;
    },

    removeNotification: (state) => {
      state.show = false;
    },
  },
})

export const { setNotification, removeNotification } = notificationData.actions;

export default notificationData.reducer;
export const qwe = notificationData.caseReducers;