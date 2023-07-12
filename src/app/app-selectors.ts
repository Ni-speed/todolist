import { AppRootStateType } from "app/store";
import { createSelector } from "reselect";

export const _selectorIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectorIsInitialized = createSelector(
  (state: AppRootStateType) => {
    return state.app.isInitialized;
  },
  (isInitialized) => isInitialized,
);
