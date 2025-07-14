import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  name: "Suvam Chakraborti",
  email: "suvam@example.com",
  role: "Frontend Developer",
  joined: "March 2025",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Suvam",
  stats: {
    totalTests: 100,
    avgScore: 96,
    bestScore: 98,
  },
  history: [
    {
      id: 1,
      title: "Frontend - Junior",
      date: "May 21, 2025",
      score: 88,
    },
    {
      id: 2,
      title: "Backend - Mid Level",
      date: "June 02, 2025",
      score: 76,
    },
    {
      id: 3,
      title: "UI/UX - Beginner",
      date: "June 20, 2025",
      score: 92,
    },
  ],
};

export const UserHistorySlice = createSlice({
  name: "UserHistory",
  initialState,
  reducers: {
    // Reducers
  },
});

export const UserHistoryReducer = UserHistorySlice.reducer;
export const {} = UserHistorySlice.actions;
