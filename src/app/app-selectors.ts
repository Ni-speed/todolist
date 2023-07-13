import { AppRootStateType } from "app/store";
import { createSelector } from "reselect";

export const selectorIsInitialized = createSelector(
  (state: AppRootStateType) => state.app.isInitialized,
  (isInitialized) => isInitialized,
);
export const selectorError = createSelector(
  (state: AppRootStateType) => state.app.error,
  (error) => error,
);
export const selectorStatus = createSelector(
  (state: AppRootStateType) => state.app.status,
  (status) => status,
);
