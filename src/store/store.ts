import {combineReducers, createStore} from "redux";
import {todoListsReducer} from "./todoLists-reducer";
import {tasksReducer} from "./tasks-reducer";


const rootReducer = combineReducers({
    task: tasksReducer,
    todoLists: todoListsReducer
})
const store = createStore(rootReducer)
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
