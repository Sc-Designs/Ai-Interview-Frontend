import { createSlice } from "@reduxjs/toolkit";
const initialState = null;

export const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    dataFetchFromAuth: (state,action) => {
        return action.payload;
    },
    logOut: ()=>{
      return null;
    }
  },
});

export const UserReducer = UserSlice.reducer;
export const { login, dataFetchFromAuth, logOut } = UserSlice.actions;