import React, {ChangeEvent} from 'react';
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "../store/tasks-reducer";

type TaskPropsType = {
    task: TaskType
    todoListId: string
    changeTaskStatus: (todoListId: string, id: string, isDone: boolean) => void
    changeTaskTitle: ( todoListId: string, taskId: string, newTitle: string,) => void
    removeTask: ( todoListId: string, taskId: string) => void
}
export const Task = (props: TaskPropsType) => {
    const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todoListId, props.task.id, e.currentTarget.checked)
    };
    const changeTaskTitleHandler = (taskId: string, newTitle: string) => {
        debugger
        props.changeTaskTitle(props.todoListId, taskId, newTitle);
    };
    const onClickHandler = (id: string) => {
        props.removeTask(props.todoListId, id);
    };
    return (
        <div>
            <Checkbox color={'primary'}
                      checked={props.task.isDone}
                      onChange={onChangeStatus}/>
            <EditableSpan
                value={props.task.title}
                onChange={(newTitle: string) =>
                    changeTaskTitleHandler(props.todoListId, newTitle)
                }
            />
            <IconButton aria-label="delete" onClick={() => onClickHandler(props.task.id)}>
                <DeleteIcon onClick={() => onClickHandler(props.task.id)}/>
            </IconButton>
        </div>
    );
};

