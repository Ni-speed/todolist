import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTaskTodoList } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todoListApi, TodoListType, UpdateTodolistTitleArgType } from "features/TodolistsList/todolist-api";
import { ResultCode } from "common/enums";

export type FilterValueType = "all" | "active" | "completed";

export type TodolistDomainType = TodoListType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
const initialState: TodolistDomainType[] = [];
const slice = createSlice({
  name: "todoLists",
  initialState,
  reducers: {
    changeFilter: (state, action: PayloadAction<{ todoListId: string; filter: FilterValueType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{
        todoListId: string;
        status: RequestStatusType;
      }>,
    ) => {
      const index = state.findIndex((todo) => todo.id === action.payload.status);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodoLists.fulfilled, (state, action) => {
        return action.payload.todoLists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodoList.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodoList.fulfilled, (state, action) => {
        const newTodoList: TodolistDomainType = { ...action.payload.todoList, filter: "all", entityStatus: "idle" };
        state.unshift(newTodoList);
      })
      .addCase(changeTodoListTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
        if (index !== -1) state[index].title = action.payload.title;
      })
      .addCase(clearTaskTodoList, () => {
        return initialState;
      });
  },
});

// Thunks
const getTodoLists = createAppAsyncThunk<{ todoLists: TodoListType[] }, void>(
  `todoLists/getTodoLists`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      let response = await todoListApi.getTodoLists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todoLists: response.data };
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const removeTodoList = createAppAsyncThunk<{ todoListId: string }, string>(
  `todoLists/removeTodoList`,
  async (todoListId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId, status: "loading" }));
    try {
      let response = await todoListApi.deleteTodolist(todoListId);
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "loading" }));
        return { todoListId };
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      await handleServerNetworkError(error, dispatch);
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId, status: "failed" }));
      return rejectWithValue(null);
    } finally {
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId, status: "succeeded" }));
    }
  },
);

const addTodoList = createAppAsyncThunk<{ todoList: TodoListType }, string>(
  `todoLists/addTodoList`,
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      let response = await todoListApi.createTodoList(title);
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todoList: response.data.data.item };
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const changeTodoListTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  `todoLists/changeTodoListTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.updateTodolistTitle(arg);
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return arg;
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const todoListsReducer = slice.reducer;
export const todoListsActions = slice.actions;
export const todoListThunks = { getTodoLists, removeTodoList, addTodoList, changeTodoListTitle };
