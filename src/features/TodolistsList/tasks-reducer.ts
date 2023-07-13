import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todoListsActions, todoListThunks } from "features/TodolistsList/todoLists-reducer";
import { createAppAsyncThunk } from "common/utils/create-app=async-thunk";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import {
  AddTaskArgType,
  RemoveTaskArgType,
  TaskType,
  todoListApi,
  UpdateTaskArgType,
  UpdateTaskModelType,
} from "features/TodolistsList/todolist-api";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";
import { clearTaskTodoList } from "common/actions";
import { thunkTryCatch } from "common/utils/thunk-type-catch";

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.task.todoListId] as TaskType[];
        tasksForCurrentTodoList.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId];
        const index = tasks.findIndex((todo) => todo.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.todoListId];
        const index = tasksForCurrentTodoList.findIndex((todo) => todo.id === action.payload.taskId);
        if (index !== -1) tasksForCurrentTodoList.splice(index, 1);
      })
      .addCase(todoListThunks.addTodoList.fulfilled, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(todoListThunks.removeTodoList.fulfilled, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todoListThunks.getTodoLists.fulfilled, (state, action) => {
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
  return thunkTryCatch(thunkAPI, async () => {
    let response = await todoListApi.createTask(arg);
    if (response.data.resultCode === ResultCode.success) {
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
      return { task: response.data.data.item };
    } else {
      dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  `tasks/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const task = getState().tasks[arg.todoListId].find((t) => t.id === arg.taskId);
      if (!task) {
        dispatch(appActions.setAppError({ error: "task not found in the state" }));
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...arg.model,
      };

      let response = await todoListApi.updateTask(arg.todoListId, arg.taskId, apiModel);
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return arg;
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  `tasks/removeTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "loading" }));
    try {
      let response = await todoListApi.deleteTask(arg.todoListId, arg.taskId);
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        dispatch(todoListsActions.changeTodolistEntityStatus({ todoListId: arg.todoListId, status: "succeeded" }));
        return { todoListId: arg.todoListId, taskId: arg.taskId };
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const tasksReducer = slice.reducer;
export const tasksThunks = { getTasks, addTask, updateTask, removeTask };
