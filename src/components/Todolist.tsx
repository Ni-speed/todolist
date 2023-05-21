import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValueType, TodoListsType} from "../App";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistType = {
    title: string
    todoListId: string
    task: TaskType[]
    removeTask: (id: string) => void
    changeFilter: (todoListId: string, value: FilterValueType) => void
    addTask: (title: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    filter: string
}
export const Todolist: React.FC<TodolistType> = (props) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onClickHandler = (id: string) => {
        props.removeTask(id)
    }

    const onAllClickHandler = () => props.changeFilter(props.todoListId, 'all')
    const onActiveClickHandler = () => props.changeFilter(props.todoListId, 'active')
    const onCompletedClickHandler = () => props.changeFilter(props.todoListId, 'completed')

    const addTask = () => {
        if (title.trim() !== '') {
            props.addTask(title.trim())
            setTitle('')
        } else {
            setError('Title is required')
        }
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addTask()
        }
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input className={error ? 'error' : ''}
                       placeholder={'Enter new task'}
                       value={title}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyPressHandler}
                />
                <button onClick={addTask}>+</button>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
            <ul>
                {props.task.map(ts => {
                    const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(ts.id, e.currentTarget.checked)
                    }
                    return (
                        <li key={ts.id} className={ts.isDone ? 'is-done': ''}>
                            <input type={'checkbox'}
                                   checked={ts.isDone}
                                   onChange={onChangeStatus}
                            />
                            <span>{ts.title}</span>
                            <button onClick={() => onClickHandler(ts.id)}>Удалить</button>
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

