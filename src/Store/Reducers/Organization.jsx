import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const OrganizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    FillDataFromLoginOrRegister: (state, action) => {
      return action.payload;
    },
    logOutOrg: () => {
      return null;
    },
    updateProfile: (state, action) => {
      if (!state) return action.payload;
      return { ...state, ...action.payload };
    },
    removeQuestionSet: (state, action) => {
      if (!state?.questionSets) return state;
      return {
        ...state,
        questionSets: state.questionSets.filter(
          (setId) => setId !== action.payload
        ),
      };
    },
    addQuestionId: (state, action) => {
       return {
         ...state,
         questionSets: [...state.questionSets, action.payload],
       };
    }
  },
});

export const OrganizationReducer = OrganizationSlice.reducer;

export const { FillDataFromLoginOrRegister, removeQuestionSet, logOutOrg, addQuestionId, updateProfile } =
  OrganizationSlice.actions;