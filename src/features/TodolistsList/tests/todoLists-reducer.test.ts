import {v1} from "uuid";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodoListTitleAC, FilterValueType, TodolistDomainType,
    todoListsReducer,

} from "../todoLists-reducer";
import {RequestStatusType} from "../../../app/app-reducer";


let todolistID1: string
let todolistID2: string
let startState: TodolistDomainType[]
beforeEach(() => {
    todolistID1 = v1()
    todolistID2 = v1()
    startState= [
        {id: todolistID1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistID2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
    ]
})
test(`correct todolist should be added`, () => {

    const endState = todoListsReducer(startState, addTodolistAC({
        id: '1',
        addedDate: '',
        order: 0,
        title: 'New TodoList Title'
    }))
    console.log(endState)
    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe({
        id: '1',
        addedDate: '',
        order: 0,
        title: 'New TodoList Title'
    })
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