import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskStatuses, TaskType} from "../api/todolist-api";


type TaskPropsType = {
    task: TaskType
    todoListId: string
    changeTaskStatus: (todoListId: string, id: string, status: TaskStatuses) => void
    changeTaskTitle: (todoListId: string, taskId: string, newTitle: string,) => void
    removeTask: (todoListId: string, taskId: string) => void
}
export const Task = (props: TaskPropsType) => {
    const onChangeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.todoListId,
            props.task.id,
            newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New)
    }, [props.changeTaskStatus, props.todoListId, props.task.id])
    const changeTaskTitleHandler = useCallback((newTitle: string) => {
        props.changeTaskTitle(props.todoListId, props.task.id, newTitle);
    }, [props.changeTaskTitle, props.task.id, props.todoListId])
    const onClickHandler = useCallback(() => {
        props.removeTask(props.todoListId, props.task.id)
    }, [props.todoListId])
    return (
        <div>
            <Checkbox color={'primary'}
                      checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeStatus}/>
            <EditableSpan
                value={props.task.title}
                onChange={changeTaskTitleHandler}
            />
            <IconButton aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
};

