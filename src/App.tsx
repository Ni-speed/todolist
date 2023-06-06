import React, {useState} from "react";
import "./App.css";
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {TaskType} from "./store/tasks-reducer";
import {AddItemForm} from "./components/AddItemForm";
import {Header} from './components/header/Header';
import {Container, Grid} from "@mui/material";


export type FilterValueType = "all" | "active" | "completed";
export type TodoListsType = {
    id: string;
    title: string;
    filter: FilterValueType;
};
export type TasksStateType = {
    [key: string]: TaskType[];
};

function App() {
    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todoLists, setTodoLists] = useState<TodoListsType[]>([
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]);

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "Rest API", isDone: true},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
    });

    //Tasks
    const addTask = (todoListId: string, title: string) => {
        let newTask = {id: v1(), title: title, isDone: false};

        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]});
    };
    const removeTask = (todoListId: string, taskId: string) => {
        let filteredTasks = {
            ...tasks,
            [todoListId]: tasks[todoListId].filter((ts) => ts.id !== taskId),
        };
        setTasks(filteredTasks);
    };
    const changeTaskStatus = (todoListId: string, taskId: string, isDone: boolean) => {
        setTasks({
            ...tasks, [todoListId]: tasks[todoListId].map((ts) =>
                ts.id === taskId ? {...ts, isDone: isDone} : ts
            ),
        });
    };
    const changeTaskTitle = (todoListId: string, taskId: string, title: string) => {
        setTasks({
            ...tasks,
            [todoListId]: tasks[todoListId].map((ts) =>
                ts.id === taskId ? {...ts, title: title} : ts
            ),
        });
    };
    //Todolist
    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter((tl) => tl.id !== todoListId));
        delete tasks[todoListId];
    };
    const addTodoList = (title: string) => {
        let newTodoListId = v1();
        let newTodoList: TodoListsType = {
            id: newTodoListId,
            title: title,
            filter: "all",
        };
        setTodoLists([newTodoList, ...todoLists]);
        setTasks({
            ...tasks,
            [newTodoListId]: [],
        });
    };
    const changeTodoListTitle = (todoListId: string, title: string) => {
        setTodoLists(
            todoLists.map((tl) =>
                tl.id === todoListId ? {...tl, title: title} : tl
            )
        );
    };
    const changeFilter = (todoListId: string, value: FilterValueType) => {
        let newFilteredTodoList = todoLists.map((tl) =>
            tl.id === todoListId ? {...tl, filter: value} : tl
        );
        setTodoLists(newFilteredTodoList);
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
                        let taskForTodolist = tasks[tl.id];
                        if (tl.filter === "active") {
                            taskForTodolist = tasks[tl.id].filter((ts) => !ts.isDone);
                        }
                        if (tl.filter === "completed") {
                            taskForTodolist = tasks[tl.id].filter((ts) => ts.isDone);
                        }
                        return (
                            <Todolist
                                key={tl.id}
                                todoListId={tl.id}
                                title={tl.title}
                                task={taskForTodolist}
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
