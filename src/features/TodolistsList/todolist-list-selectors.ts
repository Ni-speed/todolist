import { AppRootStateType } from "app/store";

export const selectorTodoLists = (state: AppRootStateType) => state.todoLists;
export const selectorTasks = (state: AppRootStateType) => state.tasks;
