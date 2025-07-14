import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "./Reducers/UserReducer";
import { TestCardReducer } from "./Reducers/TestCardReducer";
import { UserHistoryReducer } from "./Reducers/UserHistoryReducer";
import { CameraDetectReducer } from "./Reducers/CameraDetechtionReducer";

export const store = configureStore({
  reducer: {
    UersReducer: UserReducer,
    TestCardReducer: TestCardReducer,
    UserHistoryReducer: UserHistoryReducer,
    CameraDetectReducer: CameraDetectReducer,
  },
});