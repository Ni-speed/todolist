import React from 'react';
import {FilterValueType} from "../App";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistType = {
    title: string
    task: TaskType[]
    removeTask: (id: string)=>void
    changeFilter: (value: FilterValueType)=>void
}
export const Todolist: React.FC<TodolistType> = (props) => {

    const onClickHandler = (id: string)=> {
        alert('привет')
        props.removeTask(id)
    }
    const changeFilter = (value: FilterValueType)=> {
        props.changeFilter(value)
    }
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input placeholder={'Enter new task'}/>
                <button>+</button>
            </div>
            <ul>
                { props.task.map(ts => {
                    return (
                        <li key={ts.id}>
                            <input type={'checkbox'} checked={ts.isDone}/>
                            <span>{ts.title}</span>
                            <button onClick={()=>onClickHandler(ts.id)}>Удалить</button>
                        </li>
                    )
                })
                }
            </ul>
            <div>
                <button onClick={()=>changeFilter('all')}>All</button>
                <button onClick={()=>changeFilter('active')} >Active</button>
                <button onClick={()=>changeFilter('completed')} >Completed</button>
            </div>
        </div>
    );
};

