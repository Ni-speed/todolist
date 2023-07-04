import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  withCredentials: true,
  headers: {
    "API-KEY": "bd2bd403-d434-43b5-b436-baba75b1cb77",
  },
});

export const authApi = {
  // login(data: LoginType) {
  //     return instance.post<ResponseType<{userId: number}>,AxiosResponse<ResponseType<{ userId: number  }>>, LoginType>(`/auth/login`, data)
  // },
  login(data: LoginType) {
    return instance.post<ResponseType<{ userId: number }>>(`/auth/login`, data);
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>(`/auth/me`);
  },

  logout() {
    return instance.delete<ResponseType<{ userId: number }>>(`/auth/login`);
  },
};

export const todoListApi = {
  getTodoLists() {
    return instance.get<TodoListType[]>(`/todo-lists`);
  },
  // createTodoList(title: string) {
  //     return instance.post<ResponseType<{ item: TodoListType }>, AxiosResponse<ResponseType<{ item: TodoListType }>>, { title: string }>(`/todo-lists`, {title})
  // },
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
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },

  // f1492d45-643b-447b-9744-cadf9351104f
  //ff15b33a-e186-48a0-9861-bf322b9ebedc
};

// Types
export type LoginType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
export type TodoListType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
export type ResponseType<T = {}> = {
  resultCode: number;
  messages: string[];
  fieldsErrors: string[];
  data: T;
};

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

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
