import React from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import {FilterValueType} from "../store/todoLists-reducer";
import {Task} from "./Task";

type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};
type TodolistType = {
    title: string;
    todoListId: string;
    tasks: TaskType[];
    removeTask: (todoListId: string, id: string) => void;
    changeFilter: (todoListId: string, value: FilterValueType) => void;
    addTask: (todoListId: string, title: string) => void;
    changeTaskStatus: ( todoListId: string, taskId: string, isDone: boolean) => void;
    filter: string;
    removeTodoList: (todoListId: string) => void;
    changeTaskTitle: (todoListId: string, taskId: string, title: string) => void;
    changeTodoListTitle: (todoListId: string, title: string) => void;
};
export const Todolist: React.FC<TodolistType> = (props) => {
    // const onClickHandler = (id: string) => {
    //     props.removeTask(props.todoListId, id);
    // };
    const addItem = (title: string) => {props.addTask(props.todoListId, title)};

    const onAllClickHandler = () => props.changeFilter(props.todoListId, "all");
    const onActiveClickHandler = () => props.changeFilter(props.todoListId, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.todoListId, "completed");

    const removeTodoListHandler = () => {
        props.removeTodoList(props.todoListId);
    };
    // const changeTaskTitleHandler = (taskId: string, newTitle: string) => {
    //     debugger
    //     props.changeTaskTitle(props.todoListId, taskId, newTitle);
    // };
    const changeTodoTitleHandler = (title: string) => {
        props.changeTodoListTitle(props.todoListId, title)
    };

    let taskForTodolist = props.tasks
    if (props.filter === "active") {
        taskForTodolist = props.tasks.filter((ts) => !ts.isDone);
    }
    if (props.filter === "completed") {
        taskForTodolist = props.tasks.filter((ts) => ts.isDone);
    }
    return (
        <div>
            <h3>
                <EditableSpan
                    value={props.title}
                    onChange={changeTodoTitleHandler}
                />
                <IconButton aria-label="delete" onClick={removeTodoListHandler}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemForm addCallback={addItem}/>
            <div>
                {
                    taskForTodolist.map(t => <Task key={t.id}
                                                   task={t}
                                                   todoListId={props.todoListId}
                                                   changeTaskStatus={props.changeTaskStatus}
                                                   changeTaskTitle={props.changeTaskTitle}
                                                   removeTask={props.removeTask}
                    />)
                }
            </div>
            <div>
                <Button
                    color="secondary"
                    variant={props.filter === "all" ? "outlined" : "text"}
                    onClick={onAllClickHandler}
                >
                    All
                </Button>
                <Button
                    variant={props.filter === "active" ? "outlined" : "text"}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    color="success"
                    variant={props.filter === "completed" ? "outlined" : "text"}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
};
