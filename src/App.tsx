import React from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

function App() {

    const task1 = [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'API', isDone: true},
        {id: v1(), title: 'REACT', isDone: true}
    ]


  return (
    <div className="App">
      <Todolist title={'What to learn'} task={task1}/>

    </div>
  );
}

export default App;
