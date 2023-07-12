import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/auth/auth-reducer";
import { configureStore, AnyAction, combineReducers } from "@reduxjs/toolkit";
import { todoListsReducer } from "features/TodolistsList/todoLists-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  auth: authReducer,
});
export const store = configureStore({
  reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// @ts-ignore
window.store = store;
