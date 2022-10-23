import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import instance from "../lib/AxiosInstance";
import { ApiUrls } from "../constants";

/// Board Services

export const getBoard = createAsyncThunk(
  "board/getBoard",
  async function (id) {
    return await instance.get(ApiUrls.board.data + id);
  }
);

export const editBoard = createAsyncThunk(
  "board/editBoard",
  async function ({ id, title }) {
    return await instance.post(ApiUrls.board.edit + id, { title });
  }
);

export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async function (id) {
    return await instance.delete(ApiUrls.board.delete + id);
  }
);

export const changeMembers = createAsyncThunk(
  "board/changeMembers",
  async function ({ id, users }) {
    return await instance.put(ApiUrls.board.changeMembers + id, users);
  }
);

/// Lists Services

export const editList = createAsyncThunk(
  "board/editList",
  async function ({ id, title }) {
    return await instance.post(ApiUrls.task.edit + id, { title });
  }
);

export const deleteList = createAsyncThunk(
  "board/deleteList",
  async function (id) {
    return await instance.delete(ApiUrls.task.delete + id);
  }
);

export const createList = createAsyncThunk(
  "board/createList",
  async function (data) {
    return await instance.post(ApiUrls.task.create, data);
  }
);

/// Cards Services

export const createCard = createAsyncThunk(
  "board/createCard",
  async function (data) {
    return await instance.post(ApiUrls.card.create, data);
  }
);

export const editCard = createAsyncThunk(
  "board/editCard",
  async function ({ id, data }) {
    return await instance.post(ApiUrls.card.edit + id, data);
  }
);

export const deleteCard = createAsyncThunk(
  "board/deleteCard",
  async function (data) {
    return await instance.delete(ApiUrls.card.delete + data._id);
  }
);

export const moveCard = createAsyncThunk(
  "board/moveCard",
  async function ({ listIdFrom, listIdTo, data }) {
    return await instance.post(`${ApiUrls.card.move + listIdFrom}/${listIdTo}`, data);
  }
);


export const board = createSlice({
  name: "board",
  initialState: {
    title: "",
    _id: "",
    author: "",
    image: "",
    lists: [],
    members: []
  },
  reducers: {
  },
  extraReducers: {
    /// Board extra reducers
    [getBoard.fulfilled]: (state, { payload }) => {
      state.title = payload.data.board.title;
      state._id = payload.data.board._id;
      state.author = payload.data.board.author;
      state.image = payload.data.board.image;
      state.members = payload.data.board.members;
      state.lists = payload.data.lists;
    },

    [changeMembers.fulfilled]: (state, action) => {
      state.members = action.payload.data.members;
    },

    [editBoard.fulfilled]: (state, action) => {
      state.title = action.meta.arg.title;
    },

    /// List extra reducers
    [editList.fulfilled]: (state, action) => {
      const idx = state.lists.findIndex((item) => item._id === action.payload.data._id);
      const cards = state.lists[idx].cards;

      state.lists[idx] = action.payload.data;
      state.lists[idx].cards = cards;
    },

    [deleteList.fulfilled]: (state, action) => {
      const idx = state.lists.findIndex((item) => item._id.toString() === action.payload.data.deleted_id);

      state.lists.splice(idx, 1);
    },

    [createList.fulfilled]: (state, action) => {
      state.lists.push(action.payload.data);
    },

    /// Card extra reducers
    [createCard.fulfilled]: (state, action) => {
      const idx = state.lists.findIndex((item) => item._id === action.payload.data.list);

      state.lists[idx].cards.push(action.payload.data);
    },

    [editCard.fulfilled]: (state, action) => {
      const listidx = state.lists.findIndex((item) => item._id === action.payload.data.list);
      const cardidx = state.lists[listidx].cards.findIndex((item) => item._id === action.payload.data._id);

      state.lists[listidx].cards[cardidx] = action.payload.data;
    },

    [deleteCard.fulfilled]: (state, action) => {
      const listidx = state.lists.findIndex((item) => item._id === action.meta.arg.list);
      const cardidx = state.lists[listidx].cards.findIndex((item) => item._id.toString() === action.payload.data.id);

      state.lists[listidx].cards.splice(cardidx, 1);
      state.lists[listidx].cards.forEach(card => card.index > action.meta.arg.index ? card.index -= 1 : null);
    },

    [moveCard.pending]: (state, action) => {
      const movedFromIdx = state.lists.findIndex((item) => item._id.toString() === action.meta.arg.listIdFrom);
      const movedToIdx = state.lists.findIndex((item) => item._id.toString() === action.meta.arg.listIdTo);

      const cardFromIdx = action.meta.arg.data.indexFrom;
      const cardToIdx = action.meta.arg.data.indexTo;

      const card = state.lists[movedFromIdx].cards[cardFromIdx];

      state.lists[movedFromIdx].cards.splice(cardFromIdx, 1);
      state.lists[movedToIdx].cards.splice(cardToIdx, 0, card);
    },
  },
})

export default board.reducer