import React from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

function App() {

    const task1 = [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'REACT', isDone: true}
    ]
    const task2 = [
        {id: v1(), title: 'Hello world', isDone: true},
        {id: v1(), title: 'I am Developer', isDone: false},
        {id: v1(), title: 'Learn React', isDone: false},

    ]
  return (
    <div className="App">
      <Todolist title={'What to learn'} task={task1}/>
      <Todolist title={'Song'} task={task2}/>
    </div>
  );
}

export default App;
