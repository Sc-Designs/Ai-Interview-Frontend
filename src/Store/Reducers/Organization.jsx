import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const OrganizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers:{
        FillDataFromLoginOrRegister: (state,action)=>{
            return action.payload;
        },
        logOut: ()=>{
            return null;
        }
    }
})

export const OrganizationReducer = OrganizationSlice.reducer;

export const { FillDataFromLoginOrRegister , logOut} = OrganizationSlice.actions;