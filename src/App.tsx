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

    let taskForTodolist = tasks
    if (filter === 'active') {
        taskForTodolist = tasks.filter(ts => !ts.isDone)
    }
    if (filter === 'completed') {
        taskForTodolist = tasks.filter(ts => ts.isDone)
    }
    const addTask = (title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}
        let newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }
    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter(ts => ts.id !== id)
        setTasks(filteredTasks)
    }
    const changeFilter = (value: FilterValueType) => {
        setFilter(value)
    }
    const changeTaskStatus = (id: string, isDone: boolean)=> {
        let task = tasks.map(ts => ts.id === id ? {...ts, isDone: isDone} : ts)
        setTasks(task)
    }


    return (
        <div className="App">
            <Todolist title={'What to learn'}
                      task={taskForTodolist}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeTaskStatus}
                      filter={filter}
            />

        </div>
    );
}

export default App;
