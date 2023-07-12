import React, { useCallback, useEffect } from "react";
import { Grid } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import {
  addTodoListTC,
  changeTodoListTitleTC,
  FilterValueType,
  getTodoListTC,
  removeTodoListTC,
  TodolistDomainType,
  todoListsActions,
} from "./todoLists-reducer";
import { useAppSelector } from "app/store";
import { removeTaskTC, TasksStateType, tasksThunks } from "./tasks-reducer";
import { Navigate } from "react-router-dom";
import { selectorTasks, selectorTodoLists } from "features/TodolistsList/todolist-list-selectors";
import { selectorIsInitialized } from "app/app-selectors";
import { useAppDispatch } from "common/hooks";
import { TaskStatuses } from "common/enums";
import { AddItemForm } from "common/components";

export const TodoListsList = () => {
  const todoLists = useAppSelector<TodolistDomainType[]>(selectorTodoLists);
  const tasks = useAppSelector<TasksStateType>(selectorTasks);
  const isLoggedIn = useAppSelector(selectorIsInitialized);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getTodoListTC());
    }
  }, []);
  //Tasks
  const addTask = useCallback((todoListId: string, title: string) => {
    dispatch(tasksThunks.addTask({ todoListId, title }));
  }, []);

  const removeTask = useCallback((todoListId: string, taskId: string) => {
    dispatch(removeTaskTC(todoListId, taskId));
  }, []);

  const changeTaskStatus = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
    dispatch(tasksThunks.updateTask({ taskId, todoListId, model: { status: status } }));
  }, []);

  const changeTaskTitle = useCallback((todoListId: string, taskId: string, title: string) => {
    dispatch(tasksThunks.updateTask({ taskId, todoListId, model: { title } }));
  }, []);

  //Todolist
  const removeTodoList = useCallback((todoListId: string) => {
    dispatch(removeTodoListTC(todoListId));
  }, []);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodoListTC(title));
  }, []);

  const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
    dispatch(changeTodoListTitleTC(todoListId, title));
  }, []);

  const changeFilter = useCallback((todoListId: string, filter: FilterValueType) => {
    dispatch(todoListsActions.changeFilter({ todoListId: todoListId, filter: filter }));
  }, []);
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <Grid container style={{ padding: "10px" }}>
        <AddItemForm addCallback={addTodoList} />
      </Grid>
      <Grid container spacing={3}>
        {todoLists.map((tl) => {
          let allTodoListsTasks = tasks[tl.id];
          return (
            <Todolist
              key={tl.id}
              todoListId={tl.id}
              title={tl.title}
              tasks={allTodoListsTasks}
              entityStatus={tl.entityStatus}
              removeTask={removeTask}
              changeFilter={changeFilter}
              addTask={addTask}
              changeTaskStatus={changeTaskStatus}
              filter={tl.filter}
              removeTodoList={removeTodoList}
              changeTaskTitle={changeTaskTitle}
              changeTodoListTitle={changeTodoListTitle}
            />
          );
        })}
      </Grid>
    </div>
  );
};
