import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearTaskTodoList } from "common/actions";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { authApi, LoginType } from "features/auth/auth-api";

type authInitialStateType = {
  isLoggedIn: boolean;
};
const initialState: authInitialStateType = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
// Thunks
export const loginTC =
  (data: LoginType): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await authApi.login(data);
      if (response.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (e: any) {
      console.error(e);
      handleServerNetworkError(e, dispatch);
    } finally {
      dispatch(appActions.setAppInitialize({ isInitialized: true }));
    }
  };
export const logoutTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let response = await authApi.logout();
    if (response.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(clearTaskTodoList());
    } else {
      handleServerAppError(response.data, dispatch);
    }
  } catch (e: any) {
    console.error(e);
    handleServerNetworkError(e, dispatch);
  }
};
