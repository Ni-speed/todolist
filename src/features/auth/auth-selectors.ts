import { AppRootStateType } from "app/store";
import { createSelector } from "reselect";

export const selectorIsLoggedIn = createSelector(
  (state: AppRootStateType) => state.auth.isLoggedIn,
  (isLoggedIn) => isLoggedIn,
);
