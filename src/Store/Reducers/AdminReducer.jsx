import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginReducer: (state, action) => {
      return action.payload;
    },
    dataFetchFromAuth: (state, action) => {
      return action.payload;
    },
    logOut: () => {
      return null;
    },
  },
});

export const AdminReducer = AdminSlice.reducer;

export const { loginReducer, dataFetchFromAuth, logOut } = AdminSlice.actions;
