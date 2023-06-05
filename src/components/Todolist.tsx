import React, {ChangeEvent} from 'react';
import {FilterValueType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistType = {
    title: string
    todoListId: string
    task: TaskType[]
    removeTask: (todoListId: string, id: string) => void
    changeFilter: (todoListId: string, value: FilterValueType) => void
    addTask: (todoListId: string,title: string) => void
    changeTaskStatus: (todoListId: string,id: string, isDone: boolean) => void
    filter: string
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (todoListId: string, taskId: string,title: string)=> void
    changeTodoListTitle: (todoListId: string, title: string)=> void
}
export const Todolist: React.FC<TodolistType> = (props) => {

    const onClickHandler = (id: string) => {
        props.removeTask(props.todoListId,id)
    }
    const addItem = (title: string)=> {
        props.addTask(props.todoListId, title)
    }

    const onAllClickHandler = () => props.changeFilter(props.todoListId, 'all')
    const onActiveClickHandler = () => props.changeFilter(props.todoListId, 'active')
    const onCompletedClickHandler = () => props.changeFilter(props.todoListId, 'completed')

    const removeTodoListHandler = ()=> {
        props.removeTodoList(props.todoListId)
    }
    const changeTaskTitleHandler = (taskId: string, newTitle: string) => {
        props.changeTaskTitle(props.todoListId, taskId, newTitle)
    }
    const changeTodoTitleHandler = (title: string)=> {

    }

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} onChange={(newTitle:string)=>changeTodoTitleHandler(newTitle)}/>
                <IconButton aria-label="delete">
                    <DeleteIcon onClick={removeTodoListHandler} />
                </IconButton>
            </h3>
            <AddItemForm addCallback={addItem}/>
            <ul>
                {props.task.map(ts => {
                    const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todoListId,ts.id, e.currentTarget.checked)
                    }
                    return (
                        <li key={ts.id} className={ts.isDone ? 'is-done': ''}>
                            <input type={'checkbox'}
                                   checked={ts.isDone}
                                   onChange={onChangeStatus}
                            />
                            <EditableSpan value={ts.title} onChange={(newTitle:string)=>changeTaskTitleHandler(props.todoListId,newTitle)}/>
                            <IconButton aria-label="delete">
                                <DeleteIcon onClick={() => onClickHandler(ts.id)} />
                            </IconButton>
                        </li>
                    )
                })
                }
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''} onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    );
};

