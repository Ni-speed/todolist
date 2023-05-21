import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    id: string
    title: string
    filter: string
}

function App() {
    let [todoLists, setTodoLists] = useState<TodoListsType[]>(
        [
            {id: v1(), title: 'What to learn', filter: 'all'},
            {id: v1(), title: 'What to buy', filter: 'all'}
        ]
    )
    const [tasks, setTasks] = useState([
        {id: v1(), title: 'HTML&CSS', isDone: false},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'API', isDone: false},
        {id: v1(), title: 'REACT', isDone: true}
    ])


    const addTask = (title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}
        let newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }
    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter(ts => ts.id !== id)
        setTasks(filteredTasks)
    }
    const changeFilter = (todoListId: string, value: FilterValueType) => {
        let newFilteredTodoList = todoLists.map(tl => tl.id === todoListId
            ? {...tl, filter: value}
            : tl)
        setTodoLists(newFilteredTodoList)
    }
    const changeTaskStatus = (id: string, isDone: boolean) => {
        let task = tasks.map(ts => ts.id === id ? {...ts, isDone: isDone} : ts)
        setTasks(task)
    }


    return (
        <div className="App">
            {todoLists.map(tl => {

                    let taskForTodolist = tasks
                    if (tl.filter === 'active') {
                        taskForTodolist = tasks.filter(ts => !ts.isDone)
                    }
                    if (tl.filter === 'completed') {
                        taskForTodolist = tasks.filter(ts => ts.isDone)
                    }
                    return <Todolist
                        key={tl.id}
                        todoListId={tl.id}
                        title={tl.title}
                        task={taskForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        filter={tl.filter}
                    />
                }
            )}


        </div>
    );
}

export default App;
