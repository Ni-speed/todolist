import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValueType} from "../App";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistType = {
    title: string
    task: TaskType[]
    removeTask: (id: string) => void
    changeFilter: (value: FilterValueType) => void
    addTask: (title: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    filter: FilterValueType
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
    const changeFilter = (value: FilterValueType) => {
        props.changeFilter(value)
    }
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
                        <li key={ts.id}>
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
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={() => changeFilter('all')}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''}onClick={() => changeFilter('active')}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}onClick={() => changeFilter('completed')}>Completed</button>
            </div>
        </div>
    );
};

