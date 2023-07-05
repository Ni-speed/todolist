import { TaskPriorities, TaskStatuses, TaskType, todoListApi, UpdateTaskModelType } from "api/todolist-api";
import { AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
//Types
type ActionType = removeTaskACType | addTaskACType | updateTaskACType | setTasksACType;

export type removeTaskACType = ReturnType<typeof removeTaskAC>;
export type addTaskACType = ReturnType<typeof addTaskAC>;
export type updateTaskACType = ReturnType<typeof updateTaskAC>;
export type setTasksACType = ReturnType<typeof setTasksAC>;
export type TasksStateType = {
  [key: string]: TaskType[];
};
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {},
  },
});
//Reducer
export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
  switch (action.type) {
    case "SET-TASKS": {
      return {
        ...state,
        [action.payload.todoListId]: action.payload.tasks,
      };
    }
    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.payload.todoLists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].filter((ts) => ts.id !== action.payload.taskId),
      };
    }
    case "ADD-TASK": {
      return {
        ...state,
        [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
      };
    }
    case "UPDATE-TASK": {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.model } : t
        ),
      };
    }
    case "ADD-TODOLIST": {
      return { ...state, [action.payload.todoList.id]: [] };
    }
    case "REMOVED-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.payload.todoListId];
      return copyState;
    }
    case "CLEAR-DATA": {
      return {};
    }
    default:
      return state;
  }
};

//Actions
export const setTasksAC = (todoListId: string, tasks: TaskType[]) => {
  return {
    type: "SET-TASKS",
    payload: { todoListId, tasks },
  } as const;
};
export const removeTaskAC = (todoListId: string, taskId: string) => {
  return {
    type: "REMOVE-TASK",
    payload: { todoListId, taskId },
  } as const;
};
export const addTaskAC = (task: TaskType) => {
  return {
    type: "ADD-TASK",
    payload: { task },
  } as const;
};
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskModelType) => {
  return {
    type: "UPDATE-TASK",
    payload: { taskId, model, todoListId },
  } as const;
};

//Thunkslll
export const getTasksTC =
  (todoListId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.getTask(todoListId);
      dispatch(setTasksAC(todoListId, response.data.items));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } catch (error: any) {
      console.error(error);
    }
  };
export const removeTaskTC =
  (todoListId: string, taskId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatusAC(todoListId, "loading"));
    try {
      let response = await todoListApi.deleteTask(todoListId, taskId);
      if (response.data.resultCode === 0) {
        dispatch(removeTaskAC(todoListId, taskId));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (error: any) {
      console.error(error);
      await handleServerNetworkError(error, dispatch);
      dispatch(changeTodolistEntityStatusAC(todoListId, "failed"));
    }
  };
export const addTaskTC =
  (todoListId: string, title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(changeTodolistEntityStatusAC(todoListId, "loading"));
      let response = await todoListApi.createTask(todoListId, title);
      if (response.data.resultCode === 0) {
        dispatch(addTaskAC(response.data.data.item));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
      dispatch(changeTodolistEntityStatusAC(todoListId, "succeeded"));
    } catch (error: any) {
      console.error(error);
      handleServerNetworkError(error, dispatch);
    }
  };
export const updateTaskTC =
  (todoListId: string, taskId: string, model: UpdateDomainTaskModelType): AppThunk =>
  async (dispatch, getState) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const task = getState().tasks[todoListId].find((t) => t.id === taskId);
    if (task) {
      try {
        const apiModel: UpdateTaskModelType = {
          title: task.title,
          startDate: task.startDate,
          priority: task.priority,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          ...model,
        };

        let response = await todoListApi.updateTask(todoListId, taskId, apiModel);

        if (response.data.resultCode === 0) {
          dispatch(updateTaskAC(todoListId, taskId, model));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(response.data, dispatch);
        }
      } catch (error: any) {
        console.error(error);
        handleServerNetworkError(error, dispatch);
      }
    }
  };
