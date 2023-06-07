import React, {useState} from "react";
import "./App.css";
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TasksStateType,
    TaskType
} from "./store/tasks-reducer";
import {AddItemForm} from "./components/AddItemForm";
import {Header} from './components/header/Header';
import {Container, Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./store/store";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodoListTitleAC, FilterValueType,
    removeTodoListAC,
    TodoListsType
} from "./store/todoLists-reducer";


// export type FilterValueType = "all" | "active" | "completed";
// export type TodoListsType = {
//     id: string;
//     title: string;
//     filter: FilterValueType;
// };
// export type TasksStateType = {
//     [key: string]: TaskType[];
// };

function App() {
    // let todolistID1 = v1();
    // let todolistID2 = v1();
    //
    // let [todoLists, setTodoLists] = useState<TodoListsType[]>([
    //     {id: todolistID1, title: "What to learn", filter: "all"},
    //     {id: todolistID2, title: "What to buy", filter: "all"},
    // ]);
    //
    // let [tasks, setTasks] = useState<TasksStateType>({
    //     [todolistID1]: [
    //         {id: v1(), title: "HTML&CSS", isDone: true},
    //         {id: v1(), title: "JS", isDone: true},
    //         {id: v1(), title: "ReactJS", isDone: false},
    //     ],
    //     [todolistID2]: [
    //         {id: v1(), title: "Rest API", isDone: true},
    //         {id: v1(), title: "GraphQL", isDone: false},
    //     ],
    // });
    const todoLists = useSelector<AppRootStateType, TodoListsType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()
    //Tasks
    const addTask = (todoListId: string, title: string) => {
        // let newTask = {id: v1(), title: title, isDone: false};
        //
        // setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]});
        dispatch(addTaskAC(todoListId, title))
    };
    const removeTask = (todoListId: string, taskId: string) => {
        // let filteredTasks = {
        //     ...tasks,
        //     [todoListId]: tasks[todoListId].filter((ts) => ts.id !== taskId),
        // };
        // setTasks(filteredTasks);
        dispatch(removeTaskAC(todoListId, taskId))
    };
    const changeTaskStatus = (todoListId: string, taskId: string, isDone: boolean) => {
        // setTasks({
        //     ...tasks, [todoListId]: tasks[todoListId].map((ts) =>
        //         ts.id === taskId ? {...ts, isDone: isDone} : ts
        //     ),
        // });
        dispatch(changeTaskStatusAC(todoListId, taskId, isDone))
    };
    const changeTaskTitle = (todoListId: string, taskId: string, title: string) => {
        debugger
        // setTasks({
        //     ...tasks,
        //     [todoListId]: tasks[todoListId].map((ts) =>
        //         ts.id === taskId ? {...ts, title: title} : ts
        //     ),
        // });
        dispatch(changeTaskTitleAC(todoListId, taskId, title))
    };
    //Todolist
    const removeTodoList = (todoListId: string) => {
        dispatch(removeTodoListAC(todoListId))
        // setTodoLists(todoLists.filter((tl) => tl.id !== todoListId));
        // delete tasks[todoListId];
    };
    const addTodoList = (title: string) => {
    //     let newTodoListId = v1();
    //     let newTodoList: TodoListsType = {
    //         id: newTodoListId,
    //         title: title,
    //         filter: "all",
    //     };
    //     setTodoLists([newTodoList, ...todoLists]);
    //     setTasks({
    //         ...tasks,
    //         [newTodoListId]: [],
    //     });
        dispatch(addTodolistAC(title))
    };
    const changeTodoListTitle = (todoListId: string, title: string) => {
        // setTodoLists(
        //     todoLists.map((tl) =>
        //         tl.id === todoListId ? {...tl, title: title} : tl
        //     )
        // );
        dispatch(changeTodoListTitleAC(todoListId,title))
    };
    const changeFilter = (todoListId: string, filter: FilterValueType) => {
        // let newFilteredTodoList = todoLists.map((tl) =>
        //     tl.id === todoListId ? {...tl, filter: value} : tl
        // );
        // setTodoLists(newFilteredTodoList);
        dispatch(changeFilterAC(todoListId, filter))
    };

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
