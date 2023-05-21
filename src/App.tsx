import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {TaskType} from "./store/tasks-reducer";

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    id: string
    title: string
    filter: FilterValueType
}
export type TaskStateType = {
    [key: string]: TaskType[]
}
function App() {
    // let [todoLists, setTodoLists] = useState<TodoListsType[]>(
    //     [
    //         {id: v1(), title: 'What to learn', filter: 'all'},
    //         {id: v1(), title: 'What to buy', filter: 'all'}
    //     ]
    // )
    // const [tasks, setTasks] = useState([
    //     {id: v1(), title: 'HTML&CSS', isDone: false},
    //     {id: v1(), title: 'JS', isDone: true},
    //     {id: v1(), title: 'API', isDone: false},
    //     {id: v1(), title: 'REACT', isDone: true}
    // ])
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todoLists, setTodoLists] = useState<TodoListsType[]>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })



    const addTask = (todoListId: string, title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}

        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]] })
    }
    const removeTask = (todoListId: string, taskId: string) => {
        let filteredTasks = {...tasks, [todoListId]: tasks[todoListId]
                .filter(ts => ts.id !== taskId)
        }
        setTasks(filteredTasks)
    }
    const changeFilter = (todoListId: string, value: FilterValueType) => {
        let newFilteredTodoList = todoLists.map(tl => tl.id === todoListId
            ? {...tl, filter: value}
            : tl)
        setTodoLists(newFilteredTodoList)
    }
    const changeTaskStatus = (todoListId: string, taskId: string, isDone: boolean) => {
        setTasks({...tasks,
            [todoListId]: tasks[todoListId].map(ts => ts.id === taskId
            ? {...ts, isDone: isDone}
            : ts)
        })
    }
    const removeTodoList = (todoListId: string)=> {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListId))
        delete tasks[todoListId]
    }


    return (
        <div className="App">
            {todoLists.map(tl => {

                    let taskForTodolist = tasks[tl.id]
                    if (tl.filter === 'active') {
                        taskForTodolist = tasks[tl.id].filter(ts => !ts.isDone)
                    }
                    if (tl.filter === 'completed') {
                        taskForTodolist = tasks[tl.id].filter(ts => ts.isDone)
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
                        removeTodoList={removeTodoList}
                    />
                }
            )}


        </div>
    );
}

export default App;
