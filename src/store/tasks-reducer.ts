import { v1 } from "uuid";

const initialState: TasksStateType = {
  count: [],
};
export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].filter(
          (el) => el.id !== action.payload.taskId
        ),
      };
    }
    case "ADD-TASK": {
      const newTask = {
        id: action.payload.todoListId,
        title: action.payload.title,
        isDone: false,
      };
      return {
        ...state,
        [action.payload.todoListId]: [
          newTask,
          ...state[action.payload.todoListId],
        ],
      };
    }
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.todoListId]: state[action.todoListId].map((el) =>
          el.id === action.taskId ? { ...el, isDone: action.isDone } : el
        ),
      };
    }
    case "CHANGE-TASK-TITLE": {
      return {
        ...state,
        [action.todoListId]: state[action.todoListId].map((el) =>
          el.id === action.taskId ? { ...el, title: action.title } : el
        ),
      };
    }
    default:
      return state;
  }
};

export const removeTaskAC = (taskId: string, todoListId: string) => {
  return {
    type: "REMOVE-TASK",
    payload: { taskId, todoListId },
  } as const;
};
export const addTaskAC = (title: string, todoListId: string) => {
  return {
    type: "ADD-TASK",
    payload: { todoListId, title },
  } as const;
};
export const changeTaskStatusAC = (
  taskId: string,
  isDone: boolean,
  todoListId: string
) => {
  return { type: "CHANGE-TASK-STATUS", taskId, isDone, todoListId } as const;
};
export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todoListId: string
) => {
  return { type: "CHANGE-TASK-TITLE", taskId, title, todoListId } as const;
};

type ActionType =
  | RemoveTaskACType
  | addTaskACType
  | changeTaskStatusACType
  | changeTaskTitleACType;

export type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;
export type RemoveTaskACType = ReturnType<typeof removeTaskAC>;
export type addTaskACType = ReturnType<typeof addTaskAC>;
export type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;

export type TasksStateType = {
  [key: string]: TaskType[];
};
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
