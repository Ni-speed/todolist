import { AppRootStateType } from "app/store";

export const selectorStatus = (state: AppRootStateType) => state.app.status;
export const selectorIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
