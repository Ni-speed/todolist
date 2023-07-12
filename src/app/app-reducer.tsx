import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { authActions } from "features/auth/auth-reducer";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authApi } from "features/auth/auth-api";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: "ERROR" as string | null,
  isInitialized: false,
};
export type appInitialStateType = typeof initialState;

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      console.log(current(state)); // для получения state в  RTK
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialize: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
//Thunks

export const meTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let response = await authApi.me();
    if (response.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(appActions.setAppInitialize({ isInitialized: true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(response.data, dispatch);
      dispatch(appActions.setAppInitialize({ isInitialized: true }));
    }
  } catch (e) {
    const error = e as { message: string };
    handleServerNetworkError(error, dispatch);
  }
};
