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
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

// Thunks

const login = createAppAsyncThunk<{ isLoggedIn: true }, LoginType>(`auth/login`, async (arg, thunkAPI) => {
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

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login };
