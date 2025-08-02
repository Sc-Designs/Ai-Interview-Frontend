import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "./Reducers/UserReducer";
import { CameraDetectReducer } from "./Reducers/CameraDetechtionReducer";
import { AdminReducer } from "./Reducers/AdminReducer";
import { OrganizationReducer } from './Reducers/Organization';

export const store = configureStore({
  reducer: {
    UersReducer: UserReducer,
    CameraDetectReducer: CameraDetectReducer,
    AdminReducer: AdminReducer,
    OrganizationReducer: OrganizationReducer,
  },
});