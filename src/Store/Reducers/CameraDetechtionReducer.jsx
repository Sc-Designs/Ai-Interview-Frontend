import { createSlice } from "@reduxjs/toolkit";
const initialState = 0;

export const CameraDetectSlice = createSlice({
    name: "UndetectNumber",
    initialState,
    reducers:{
        AddingNumber: (state, action)=>{
            return (state+action.payload);
        },
        resetNumber: ()=>{
            return initialState;
        }
    }
})

export const CameraDetectReducer = CameraDetectSlice.reducer;
export const { AddingNumber, resetNumber } = CameraDetectSlice.actions;