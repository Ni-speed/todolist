import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForn/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import {FilterValueType} from "../todoLists-reducer";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {getTasksTC} from "../tasks-reducer";
import {useAppDispatch} from "../../../app/store";
import {RequestStatusType} from "../../../app/app-reducer";


type TodolistType = {
    title: string;
    todoListId: string;
    tasks: TaskType[];
    entityStatus: RequestStatusType
    removeTask: (todoListId: string, id: string) => void;
    changeFilter: (todoListId: string, value: FilterValueType) => void;
    addTask: (todoListId: string, title: string) => void;
    changeTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void;
    filter: string;
    removeTodoList: (todoListId: string) => void;
    changeTaskTitle: (todoListId: string, taskId: string, title: string) => void;
    changeTodoListTitle: (todoListId: string, title: string) => void;
};
export const Todolist: React.FC<TodolistType> = React.memo((props) => {
    console.log("Todolist called")
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(getTasksTC(props.todoListId))
    }, [])
    const addTask = useCallback((title: string) => {
        props.addTask(props.todoListId, title)
    }, [props.addTask, props.todoListId])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todoListId, "all"), [props.changeFilter, props.todoListId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todoListId, "active"), [props.changeFilter, props.todoListId])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todoListId, "completed"), [props.changeFilter, props.todoListId])

    const removeTodoListHandler = () => {
        props.removeTodoList(props.todoListId);
    };
    const changeTodoTitleHandler = (title: string) => {
        props.changeTodoListTitle(props.todoListId, title)
    };

    let taskForTodolist = props.tasks
    if (props.filter === "active") {
        taskForTodolist = props.tasks.filter((ts) => ts.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        taskForTodolist = props.tasks.filter((ts) => ts.status === TaskStatuses.Completed);
    }
    return (
        <div>
            <h3>
                <EditableSpan
                    value={props.title}
                    onChange={changeTodoTitleHandler}
                />
                <IconButton aria-label="delete" onClick={removeTodoListHandler} disabled={props.entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addCallback={addTask}/>
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
})
