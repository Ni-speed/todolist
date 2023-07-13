import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearTaskTodoList } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authApi, LoginType } from "features/auth/auth-api";
import { ResultCode } from "common/enums";

type authInitialStateType = {
  isLoggedIn: boolean;
};
const initialState: authInitialStateType = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// Thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>(`auth/login`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let response = await authApi.login(arg);
    if (response.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInitialize({ isInitialized: true }));
  }
});

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`auth/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let response = await authApi.logout();
    if (response.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(clearTaskTodoList());
      return { isLoggedIn: false };
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`app/initializeApp`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let response = await authApi.me();
    if (response.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppInitialize({ isInitialized: true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(response.data, dispatch);
      dispatch(appActions.setAppInitialize({ isInitialized: true }));
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
