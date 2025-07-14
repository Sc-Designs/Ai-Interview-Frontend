import { createSlice } from "@reduxjs/toolkit";
const initialState = [
  {
    id: 1,
    role: "Frontend Developer",
    level: "Junior",
    questions: 10,
    duration: "15 mins",
  },
  {
    id: 2,
    role: "Backend Developer",
    level: "Mid-Level",
    questions: 12,
    duration: "20 mins",
  },
  {
    id: 3,
    role: "UI/UX Designer",
    level: "Beginner",
    questions: 8,
    duration: "10 mins",
  },
  {
    id: 4,
    role: "Data Analyst",
    level: "Senior",
    questions: 15,
    duration: "25 mins",
  },
];

export const TestCardSlice = createSlice({
  name: "TestCard",
  initialState,
  reducers: {
    // Reducers
  },
});

export const TestCardReducer = TestCardSlice.reducer;
export const {} = TestCardSlice.actions;
