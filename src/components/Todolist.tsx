import React from 'react';

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistType = {
    title: string
    task: TaskType[]
    removeTask: (id: string)=>void
}
export const Todolist: React.FC<TodolistType> = (props) => {

    const onClickHandler = (id: string)=> {
        alert('привет')
        props.removeTask(id)
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
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
};

