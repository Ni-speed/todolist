import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

export type FilterValueType = 'all' | 'active' | 'completed'

function App() {
    const [tasks, setTasks] = useState([
        {id: v1(), title: 'HTML&CSS', isDone: false},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'API', isDone: false},
        {id: v1(), title: 'REACT', isDone: true}
    ])
    const [filter, setFilter] = useState<FilterValueType>('active')
    // let task1 = [
    //     {id: v1(), title: 'HTML&CSS', isDone: true},
    //     {id: v1(), title: 'JS', isDone: true},
    //     {id: v1(), title: 'API', isDone: true},
    //     {id: v1(), title: 'REACT', isDone: true}
    // ]
    let taskForTodolist = tasks
    if (filter === 'active') {
        taskForTodolist = tasks.filter(ts => !ts.isDone)
    }
    if (filter === 'completed') {
        taskForTodolist = tasks.filter(ts => ts.isDone)
    }

    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter(ts => ts.id !== id)
        setTasks(filteredTasks)
    }
    const changeFilter = (value: FilterValueType)=> {
        setFilter(value)
    }


    return (
        <div className="App">
            <Todolist title={'What to learn'}
                      task={taskForTodolist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}/>

        </div>
    );
}

export default App;
