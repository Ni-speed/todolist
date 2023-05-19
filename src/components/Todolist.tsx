import React, {ChangeEvent, useState} from 'react';
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
}
export const Todolist: React.FC<TodolistType> = (props) => {
    const [title, setTitle] = useState('')

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
        props.addTask(title)
        setTitle('')
    }
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input placeholder={'Enter new task'}
                       value={title}
                       onChange={onChangeHandler}
                />
                <button onClick={addTask}>+</button>
            </div>
            <ul>
                {props.task.map(ts => {
                    return (
                        <li key={ts.id}>
                            <input type={'checkbox'} checked={ts.isDone}/>
                            <span>{ts.title}</span>
                            <button onClick={() => onClickHandler(ts.id)}>Удалить</button>
                        </li>
                    )
                })
                }
            </ul>
            <div>
                <button onClick={() => changeFilter('all')}>All</button>
                <button onClick={() => changeFilter('active')}>Active</button>
                <button onClick={() => changeFilter('completed')}>Completed</button>
            </div>
        </div>
    );
};

