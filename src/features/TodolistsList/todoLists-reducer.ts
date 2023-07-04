import { todoListApi, TodoListType } from "api/todolist-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";

//Types
type ActionType =
  | AddTodoListType
  | ChangeTodoListTitleType
  | ChangeFilterType
  | RemoveTodoListType
  | SetTodoListACType
  | changeTodolistEntityStatusACType
  | clearTodosDataACType;
export type AddTodoListType = ReturnType<typeof addTodolistAC>;
export type ChangeTodoListTitleType = ReturnType<typeof changeTodoListTitleAC>;
export type ChangeFilterType = ReturnType<typeof changeFilterAC>;
export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>;
export type SetTodoListACType = ReturnType<typeof setTodoListAC>;
export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>;
export type clearTodosDataACType = ReturnType<typeof clearTodosDataAC>;

export type FilterValueType = "all" | "active" | "completed";

export type TodolistDomainType = TodoListType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
const initialState: TodolistDomainType[] = [];
type Error = {
  messages: string[];
  data: Date;
};
// Reducer
export const todoListsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.payload.todoLists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    }
    case "ADD-TODOLIST": {
      return [{ ...action.payload.todoList, filter: "all", entityStatus: "idle" }, ...state];
    }
    case "CHANGE-TODO-TITLE": {
      return state.map((tl) => (tl.id === action.payload.todoListId ? { ...tl, title: action.payload.title } : tl));
    }
    case "CHANGE-TODO-FILTER": {
      return state.map((tl) => (tl.id === action.payload.todoListId ? { ...tl, filter: action.payload.filter } : tl));
    }
    case "REMOVED-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.todoListId);
    }
    case "CHANGE-TODO-ENTITY-STATUS": {
      return state.map((tl) =>
        tl.id === action.payload.todoListId ? { ...tl, entityStatus: action.payload.status } : tl
      );
    }
    case "CLEAR-DATA": {
      return [];
    }
  }
  return state;
};
//Actions
export const setTodoListAC = (todoLists: TodoListType[]) => {
  return { type: "SET-TODOLISTS", payload: { todoLists } } as const;
};
export const addTodolistAC = (todoList: TodoListType) => {
  return { type: "ADD-TODOLIST", payload: { todoList } } as const;
};
export const changeTodoListTitleAC = (todoListId: string, title: string) => {
  return {
    type: "CHANGE-TODO-TITLE",
    payload: { todoListId, title },
  } as const;
};
export const changeFilterAC = (todoListId: string, filter: FilterValueType) => {
  return {
    type: "CHANGE-TODO-FILTER",
    payload: { todoListId, filter },
  } as const;
};
export const removeTodoListAC = (todoListId: string) => {
  return {
    type: "REMOVED-TODOLIST",
    payload: { todoListId },
  } as const;
};
export const changeTodolistEntityStatusAC = (todoListId: string, status: RequestStatusType) => {
  return { type: "CHANGE-TODO-ENTITY-STATUS", payload: { todoListId, status } } as const;
};
export const clearTodosDataAC = () => {
  return { type: "CLEAR-DATA" } as const;
};
// Thunks
export const getTodoListTC = (): AppThunk => async (dispatch) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    let response = await todoListApi.getTodoLists();
    dispatch(setTodoListAC(response.data));
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
    dispatch(changeTodolistEntityStatusAC(todoListId, "loading"));
    try {
      let response = await todoListApi.deleteTodolist(todoListId);
      if (response.data.resultCode === 0) {
        dispatch(removeTodoListAC(todoListId));
        dispatch(appActions.setAppStatus({ status: "loading" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
      dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"));
    } catch (error: any) {
      console.error(error);
      await handleServerNetworkError(error, dispatch);
      dispatch(changeTodolistEntityStatusAC(todoListId, "failed"));
    }
  };
export const addTodoListTC =
  (title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.createTodoList(title);
      if (response.data.resultCode === 0) {
        dispatch(addTodolistAC(response.data.data.item));
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
        dispatch(changeTodoListTitleAC(todoListId, title));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (error: any) {
      console.error(error);
      handleServerNetworkError(error, dispatch);
    }
  };
