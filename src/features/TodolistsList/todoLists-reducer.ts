import { todoListApi, TodoListType } from "api/todolist-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FilterValueType = "all" | "active" | "completed";

export type TodolistDomainType = TodoListType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};

const slice = createSlice({
  name: "todoList",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodoList: (state, action: PayloadAction<{ todoListId: string }>) => {
      // recommended 2307 2263 1732
      const index = state.findIndex((todo) => todo.id === action.payload.todoListId);
      if (index !== -1) state.splice(index, 1);
      // 2 variant
      // return state.filter((tl) => tl.id !== action.payload.todoListId);
    },
    addTodolist: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
      const newTodoList: TodolistDomainType = { ...action.payload.todoList, filter: "all", entityStatus: "idle" };
      state.unshift(newTodoList);
    },
    changeTodoListTitle: (state, action: PayloadAction<{ todoListId: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.title);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeFilter: (state, action: PayloadAction<{ todoListId: string; filter: FilterValueType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.filter);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.status);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
    setTodoList: (state, action: PayloadAction<{ todoLists: TodoListType[] }>) => {
      return action.payload.todoLists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    },
    clearTodosData: (state, action) => {
      debugger;
      return [];
    },
  },
});

export const todoListsReducer = slice.reducer;
export const todoListsActions = slice.actions;

// Thunks
export const getTodoListTC = (): AppThunk => async (dispatch) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    let response = await todoListApi.getTodoLists();
    dispatch(todoListsActions.setTodoList({ todoLists: response.data }));
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
  } catch (error: any) {
    console.error(error);
    handleServerNetworkError(error, dispatch);
  }
};
export const removeTodoListTC =
  (todoListId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: todoListId, status: "loading" }));
    try {
      let response = await todoListApi.deleteTodolist(todoListId);
      if (response.data.resultCode === 0) {
        dispatch(todoListsActions.removeTodoList({ todoListId: todoListId }));
        dispatch(appActions.setAppStatus({ status: "loading" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: todoListId, status: "succeeded" }));
    } catch (error: any) {
      console.error(error);
      await handleServerNetworkError(error, dispatch);
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: todoListId, status: "failed" }));
    }
  };
export const addTodoListTC =
  (title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.createTodoList(title);
      if (response.data.resultCode === 0) {
        dispatch(todoListsActions.addTodolist({ todoList: response.data.data.item }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (error: any) {
      console.error(error);
      handleServerNetworkError(error, dispatch);
    }
  };
export const changeTodoListTitleTC =
  (todoListId: string, title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.updateTodolistTitle(todoListId, title);
      if (response.data.resultCode === 0) {
        dispatch(todoListsActions.changeTodoListTitle({ todoListId: todoListId, title: title }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (error: any) {
      console.error(error);
      handleServerNetworkError(error, dispatch);
    }
  };
