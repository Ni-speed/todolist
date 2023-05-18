import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

function App() {
    const [tasks, setTasks] = useState([
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'API', isDone: true},
        {id: v1(), title: 'REACT', isDone: true}
    ])
    // let task1 = [
    //     {id: v1(), title: 'HTML&CSS', isDone: true},
    //     {id: v1(), title: 'JS', isDone: true},
    //     {id: v1(), title: 'API', isDone: true},
    //     {id: v1(), title: 'REACT', isDone: true}
    // ]

    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter(ts => ts.id !== id)
        setTasks(filteredTasks)
    }
    return (
        <div className="App">
            <Todolist title={'What to learn'} task={tasks} removeTask={removeTask}/>

        </div>
    );
}

export default App;
