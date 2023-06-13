import React, {ChangeEvent, useEffect, useState} from 'react'
import {todoListApi} from "../api/todolist-api";

export default {
    title: 'API'
}
export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListApi.getTodoLists()
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodoList = () => {
    const [state, setState] = useState<any>(null)
    const [titleTodo, setTitleTodo] = useState<string>('')

    const titleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleTodo(e.currentTarget.value)
    }
    const addHandler = () => {
        todoListApi.createTodoList(titleTodo)
            .then(res => {
                setState(res)
            })
    }

    return <div>
        {JSON.stringify(state)}
        <input placeholder={'Title'} value={titleTodo} onChange={titleHandler}/>
        <button onClick={addHandler}>Add New TODO</button>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todoListId, setTodoListId] = useState<string>('')
    useEffect(() => {
    }, [])
    const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTodoListId(e.currentTarget.value)
    }
    const deleteHandler = () => {
        todoListApi.deleteTodolist(todoListId)
            .then(res => {
                setState(res.data)
            })
    }
    return <div>
        {JSON.stringify(state)}
        <input placeholder={'TodoListId'} value={todoListId} onChange={todoListIdHandler}/>
        <button onClick={deleteHandler}>Delete TODO</button>

    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todoListId, setTodoListId] = useState<string>('')
    const [newTitle, setNewTitle] = useState<string>('')

    const newTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTodoListId(e.currentTarget.value)
    }
    const changeTitleHandler = () => {
        todoListApi.updateTodolistTitle(todoListId, newTitle)
            .then(res=>{
                setState(res.data)
            })
    }
    return <div>
        {JSON.stringify(state)}
        <input placeholder={'Enter new title'} value={newTitle} onChange={newTitleHandler}/>
        <input placeholder={'todoListId'} value={todoListId} onChange={todoListIdHandler}/>
        <button onClick={changeTitleHandler}>Change Title</button>
    </div>
}

