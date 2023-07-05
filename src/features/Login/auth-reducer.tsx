import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { authApi, LoginType } from "api/todolist-api";
import { clearTodosDataAC } from "../TodolistsList/todoLists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";

// Types
// type ActionsType =
//   | setIsLoggedInACType
//   | setAppStatusACType
//   | setAppErrorACType
//   | setAppInitializeACType
//   | clearTodosDataACType;

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
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
      dispatch(clearTodosDataAC());
    } else {
      handleServerAppError(response.data, dispatch);
    }
  } catch (e: any) {
    console.error(e);
    handleServerNetworkError(e, dispatch);
  }
};
// export const TasksStateType = (): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     let response = await authApi.me();
//     if (response.data.resultCode === 0) {
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//       dispatch(appActions.setAppInitialize({ isInitialized: true }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     } else {
//       handleServerAppError(response.data, dispatch);
//       dispatch(appActions.setAppInitialize({ isInitialized: true }));
//     }
//   } catch (e) {
//     const error = e as { message: string };
//     handleServerNetworkError(error, dispatch);
//   }
// };
