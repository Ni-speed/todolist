import {v1} from "uuid";
import {FilterValueType, TodoListsType} from "../App";
import {addTodolistAC, changeFilterAC, changeTodoListTitleAC, todoListsReducer} from "./todoLists-reducer";


test(`correct todolist should be added`, ()=> {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TodoListsType[] = [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]
    let newTodolistTitle = 'New Todolist'

    const endState = todoListsReducer(startState, addTodolistAC(newTodolistTitle))
    console.log(endState)
    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})
test(`correct todolist should change its name`, ()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()
    const startState: TodoListsType[] = [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]
    let newTodolistTitle = 'New Title'

    const endState = todoListsReducer(startState, changeTodoListTitleAC(todolistID1, newTodolistTitle))

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[1].title).toBe('What to buy')
})
test(`correct filter of todolist should be changed`, ()=>{
    let todolistID1 = v1()
    let todolistID2 = v1()
    const startState: TodoListsType[] = [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]

    let newFilter: FilterValueType = 'completed'

    const endState = todoListsReducer(startState, changeFilterAC(todolistID1, newFilter))
    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})