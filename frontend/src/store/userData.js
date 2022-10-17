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
    user: {},

  },
  reducers: {
    setToken: (state, action) => {
      instance.defaults.headers.common["auth_token"] = action.payload;
      localStorage.token = action.payload;
    },

    removeToken: (state) => {
      delete instance.defaults.headers.common["auth_token"];
      localStorage.removeItem("token");
      state.user = {};
    },
  },
  extraReducers: {
    [getUser.pending]: (state) => {
      state.error = null;
    },
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
    },
  },
})

export const { setToken, removeToken } = userData.actions;

export default userData.reducer