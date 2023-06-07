import {AnyAction, combineReducers, createStore} from "redux";
import { todoListsReducer } from "./todoLists-reducer";
import { tasksReducer } from "./tasks-reducer";
import {useDispatch} from "react-redux";
import {ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
});
export const store = createStore(rootReducer);
export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()

// @ts-ignore
window.store = store;
