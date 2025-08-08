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
    loadUserandOrgCount: (state, action) => {
      if (state) {
        state.count = action.payload;
      }
    },
  },
});

export const AdminReducer = AdminSlice.reducer;

export const { 
  loginReducer,
  dataFetchFromAuth,
  loadUserandOrgCount,
  logOut } = AdminSlice.actions;
