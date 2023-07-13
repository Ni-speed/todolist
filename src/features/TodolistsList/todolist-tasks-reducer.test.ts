import { tasksReducer, TasksStateType } from "features/TodolistsList/tasks-reducer";
import { TodolistDomainType, todoListsReducer, todoListThunks } from "features/TodolistsList/todoLists-reducer";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodoListsState: TodolistDomainType[] = [];

  const todoList = { id: "1", addedDate: "", order: 0, title: "New TodoList" };

  const action = todoListThunks.addTodoList.fulfilled({ todoList }, "requestId", todoList.title);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodoListsState = todoListsReducer(startTodoListsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.todoList.id);
  expect(idFromTodoLists).toBe(action.payload.todoList.id);
});
