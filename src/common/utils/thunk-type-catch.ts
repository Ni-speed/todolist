import { AppDispatchType, AppRootStateType } from "app/store";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ResponseType } from "common/types";
import { appActions } from "app/app-reducer";
import { todoListsActions } from "features/TodolistsList/todoLists-reducer";

export const thunkTryCatch = async (
  thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatchType, null | ResponseType>,
  logic: Function,
) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    // в handleServerNetworkError можно удалить убирание крутилки
    dispatch(appActions.setAppStatus({ status: "idle" }));
    // dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
  }
};
