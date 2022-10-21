import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import instance from "../lib/AxiosInstance";
import { ApiUrls } from "../constants";

export const getUser = createAsyncThunk(
  "users/fetchUser",
  async function () {
    return await instance.get(ApiUrls.profile.info);
  }
);

export const userData = createSlice({
  name: "user",
  initialState: {
    _id: "",
    name: "",
    email: ""
  },
  reducers: {
    setToken: (state, action) => {
      instance.defaults.headers.common["Authorization"] = action.payload;
      localStorage.token = action.payload;
    },

    removeToken: (state) => {
      delete instance.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      state._id = "";
      state.name = "";
      state.email = "";
    },
  },
  extraReducers: {
    [getUser.pending]: (state) => {
      state.error = null;
    },
    [getUser.fulfilled]: (state, action) => {
      state.name = action.payload.data.user.name;
      state.email = action.payload.data.user.email;
      state._id = action.payload.data.user._id;
    },
  },
})

export const { setToken, removeToken } = userData.actions;

export default userData.reducer