import {AnyAction, applyMiddleware, combineReducers, createStore} from "redux";
import { todoListsReducer } from "../features/TodolistsList/todoLists-reducer";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import {useDispatch} from "react-redux";
import thunk, {ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
});
export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()

// @ts-ignore
window.store = store;
