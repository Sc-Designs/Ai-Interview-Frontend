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
    },
    updateProfile: (state, action)=>{
      console.log("run this thing")
      if (!state) return action.payload;
      return { ...state, ...action.payload };
    }
  },
});

export const UserReducer = UserSlice.reducer;
export const { login, dataFetchFromAuth, logOut, updateProfile } = UserSlice.actions;