import {v1} from "uuid";
import {FilterValueType, TodoListsType} from "../App";
import {addTodolistAC, changeFilterAC, changeTodoListTitleAC, todoListsReducer} from "./todoLists-reducer";

let todolistID1: string
let todolistID2: string
let startState: TodoListsType[]
beforeEach(() => {
    todolistID1 = v1()
    todolistID2 = v1()
    startState= [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to buy", filter: "all"},
    ]
})
test(`correct todolist should be added`, () => {
    let newTodolistTitle = 'New Todolist'

    const endState = todoListsReducer(startState, addTodolistAC(newTodolistTitle))
    console.log(endState)
    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})
test(`correct todolist should change its name`, () => {

    let newTodolistTitle = 'New Title'

    const endState = todoListsReducer(startState, changeTodoListTitleAC(todolistID1, newTodolistTitle))

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[1].title).toBe('What to buy')
})
test(`correct filter of todolist should be changed`, () => {

    let newFilter: FilterValueType = 'completed'

    const endState = todoListsReducer(startState, changeFilterAC(todolistID1, newFilter))
    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})