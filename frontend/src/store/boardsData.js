import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import instance from "../lib/AxiosInstance";
import { ApiUrls } from "../constants";

export const getBoards = createAsyncThunk(
  "boards/getBoards",
  async function () {
    return await instance.get(ApiUrls.board.all);
  }
);

export const editBoard = createAsyncThunk(
  "boards/editBoard",
  async function ({ id, title }) {
    return await instance.post(ApiUrls.board.edit + id, { title });
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async function (id) {
    return await instance.delete(ApiUrls.board.delete + id);
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async function (data) {
    return await instance.post(ApiUrls.board.create, data);
  }
);

export const boards = createSlice({
  name: "boards",
  initialState: {
    selected: "",
    items: []
  },
  reducers: {
    removeBoards: (state) => state.items = [],
    selectBoard: (state, action) => {
      state.selected = action.payload;
    }
  },
  extraReducers: {
    [getBoards.fulfilled]: (state, action) => {
      state.items = action.payload.data;
    },

    [editBoard.fulfilled]: (state, action) => {
      const idx = state.items.findIndex((item) => item._id === action.meta.arg.id);
      state.items[idx].title = action.meta.arg.title;
    },

    [deleteBoard.fulfilled]: (state, action) => {
      const idx = state.items.findIndex((item) => item._id === action.meta.arg.id);
      state.items.splice(idx, 1);
    },

    [createBoard.fulfilled]: (state, action) => {
      state.items.push(action.payload.data);
    },
  },
})

export const { removeBoards, selectBoard } = boards.actions;

export default boards.reducer