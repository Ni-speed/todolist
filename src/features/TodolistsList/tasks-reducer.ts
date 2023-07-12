import {
  AddTaskArgType,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todoListApi,
  UpdateTaskModelType,
} from "api/todolist-api";
import { AppDispatchType, AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todoListsActions } from "features/TodolistsList/todoLists-reducer";
import { clearTaskTodoList } from "common/actions/common-actions";
import { Dispatch } from "redux";
import { createAppAsyncThunk } from "utils/create-app=async-thunk";
//Types
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

//Slice
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todoListId: string; taskId: string }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId];
      const index = tasksForCurrentTodoList.findIndex((todo) => todo.id === action.payload.taskId);
      if (index !== -1) tasksForCurrentTodoList.splice(index, 1);
    },
    updateTask: (
      state,
      action: PayloadAction<{ todoListId: string; taskId: string; model: UpdateDomainTaskModelType }>,
    ) => {
      const tasks = state[action.payload.todoListId];
      const index = tasks.findIndex((todo) => todo.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.task.todoListId] as TaskType[];
        tasksForCurrentTodoList.unshift(action.payload.task);
      })
      .addCase(todoListsActions.addTodolist, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(todoListsActions.removeTodoList, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todoListsActions.setTodoList, (state, action) => {
        action.payload.todoLists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTaskTodoList, () => {
        return initialState;
      });
  },
});

//Thunks
const getTasks = createAppAsyncThunk<{ tasks: TaskType[]; todoListId: string }, string>(
  `tasks/getTasks`,
  async (todoListId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let response = await todoListApi.getTask(todoListId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks: response.data.items, todoListId: todoListId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(`tasks/addTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "loading" }));
    let response = await todoListApi.createTask(arg);
    if (response.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
      return { task: response.data.data.item };
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
  }
});

export const removeTaskTC =
  (todoListId: string, taskId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: todoListId, status: "loading" }));
    try {
      let response = await todoListApi.deleteTask(todoListId, taskId);
      if (response.data.resultCode === 0) {
        dispatch(tasksActions.removeTask({ todoListId, taskId }));

        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId, status: "succeeded" }));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    } catch (error: any) {
      console.error(error);
      await handleServerNetworkError(error, dispatch);
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId, status: "failed" }));
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
          dispatch(tasksActions.updateTask({ todoListId, taskId, model }));
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

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { getTasks, addTask };
