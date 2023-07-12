import { AppRootStateType } from "app/store";

export const selectorError = (state: AppRootStateType) => state.app.error;
