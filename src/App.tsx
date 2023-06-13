import React, {useCallback, useEffect} from "react";
import "./App.css";
import {Todolist} from "./components/Todolist";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TasksStateType} from "./store/tasks-reducer";
import {AddItemForm} from "./components/AddItemForm";
import {Header} from './components/header/Header';
import {Container, Grid} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./store/store";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodoListTitleAC,
    FilterValueType,
    removeTodoListAC, setTodoListAC, TodolistDomainType,

} from "./store/todoLists-reducer";
import {todoListApi, } from "./api/todolist-api";


function App() {
    useEffect(() => {
        todoListApi.getTodoLists()
            .then(res => {
                dispatch(setTodoListAC(res.data))
            })
    }, [])
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()
    //Tasks
    const addTask = useCallback((todoListId: string, title: string) => {
        dispatch(addTaskAC(todoListId, title))
    }, [])
    const removeTask = useCallback((todoListId: string, taskId: string) => {
        dispatch(removeTaskAC(todoListId, taskId))
    }, [])
    const changeTaskStatus = useCallback((todoListId: string, taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(todoListId, taskId, isDone))
    }, [])
    const changeTaskTitle = useCallback((todoListId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC(todoListId, taskId, title))
    }, [])
    //Todolist
    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListAC(todoListId))
    }, [])
    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
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
