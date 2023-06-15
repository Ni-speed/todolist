import React, {useCallback, useEffect} from "react";
import "./App.css";
import {Todolist} from "./components/Todolist";
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "./store/tasks-reducer";
import {AddItemForm} from "./components/AddItemForm";
import {Header} from './components/header/Header';
import {Container, Grid} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./store/store";
import {
    addTodoListTC,
    changeFilterAC,
    changeTodoListTitleAC,
    FilterValueType,
    getTodoListTC,
    removeTodoListTC,
    TodolistDomainType,
} from "./store/todoLists-reducer";
import {TaskStatuses} from "./api/todolist-api";


function App() {
    useEffect(() => {
        dispatch(getTodoListTC())
    }, [])

    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todoLists)

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useAppDispatch()

    //Tasks
    const addTask = useCallback((todoListId: string, title: string) => {
        dispatch(addTaskTC(todoListId, title))
    }, [])

    const removeTask = useCallback((todoListId: string, taskId: string) => {
        dispatch(removeTaskTC(todoListId, taskId))
    }, [])

    const changeTaskStatus = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todoListId, taskId, {status: status}))
    }, [])

    const changeTaskTitle = useCallback((todoListId: string, taskId: string, title: string) => {
        dispatch(updateTaskTC(todoListId, taskId, {title: title}))
    }, [])

    //Todolist
    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId))
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [])

    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(changeTodoListTitleAC(todoListId, title))
    }, [])

    const changeFilter = useCallback((todoListId: string, filter: FilterValueType) => {
        dispatch(changeFilterAC(todoListId, filter))
    }, [])

    return (
        <div className="App">
            <Header/>
            <Container fixed>
                <Grid container style={{padding: '10px'}}>
                    <AddItemForm addCallback={addTodoList}/>
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
            </Container>
        </div>
    );
}

export default App;
