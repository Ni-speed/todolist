import React, { useCallback, useEffect } from "react";
import { Grid } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { FilterValueType, TodolistDomainType, todoListsActions, todoListThunks } from "./todoLists-reducer";
import { useAppSelector } from "app/store";
import { TasksStateType, tasksThunks } from "./tasks-reducer";
import { Navigate } from "react-router-dom";
import { selectorTasks, selectorTodoLists } from "features/TodolistsList/todolist-list-selectors";
import { useActions, useAppDispatch } from "common/hooks";
import { TaskStatuses } from "common/enums";
import { AddItemForm } from "common/components";
import { selectorIsLoggedIn } from "features/auth/auth-selectors";

export const TodoListsList = () => {
  const todoLists = useAppSelector<TodolistDomainType[]>(selectorTodoLists);
  const tasks = useAppSelector<TasksStateType>(selectorTasks);
  const isLoggedIn = useAppSelector(selectorIsLoggedIn);

  const dispatch = useAppDispatch();
  const {
    getTodoLists,
    removeTodoList: removeTodoListThunk,
    addTodoList: addTodoListThunk,
    changeTodoListTitle: changeTodoListTitleThunk,
  } = useActions(todoListThunks);
  const { removeTask: removeTaskThunk, updateTask, addTask: addTaskThunk } = useActions(tasksThunks);
  const { changeFilter: changeFilterThunk } = useActions(todoListsActions);

  useEffect(() => {
    if (isLoggedIn) {
      getTodoLists();
    }
  }, []);
  //Tasks
  const addTask = useCallback((todoListId: string, title: string) => {
    addTaskThunk({ todoListId, title });
  }, []);

  const removeTask = useCallback((todoListId: string, taskId: string) => {
    removeTaskThunk({ todoListId, taskId });
  }, []);

  const changeTaskStatus = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
    updateTask({ taskId, todoListId, model: { status: status } });
  }, []);

  const changeTaskTitle = useCallback((todoListId: string, taskId: string, title: string) => {
    dispatch(tasksThunks.updateTask({ taskId, todoListId, model: { title } }));
  }, []);

  //Todolist
  const removeTodoList = useCallback((todoListId: string) => {
    removeTodoListThunk(todoListId);
  }, []);

  const addTodoList = useCallback((title: string) => {
    addTodoListThunk(title);
  }, []);

  const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
    changeTodoListTitleThunk({ todoListId, title });
  }, []);

  const changeFilter = useCallback((todoListId: string, filter: FilterValueType) => {
    changeFilterThunk({ todoListId: todoListId, filter: filter });
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
