import { instance, ResponseType } from "common/api/common-api";
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";
import { TaskPriorities, TaskStatuses } from "common/enums";

export const todoListApi = {
  getTodoLists() {
    return instance.get<TodoListType[]>(`/todo-lists`);
  },
  createTodoList(title: string) {
    return instance.post<ResponseType<{ item: TodoListType }>>(`/todo-lists`, { title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },
  updateTodolistTitle(todolistId: string, title: string) {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title });
  },
  getTask(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${arg.todoListId}/tasks`, { title: arg.title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type TodoListType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
export type TaskType = {
  id: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  description: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
export type AddTaskArgType = { todoListId: string; title: string };
export type UpdateTaskArgType = { todoListId: string; taskId: string; model: UpdateDomainTaskModelType };
