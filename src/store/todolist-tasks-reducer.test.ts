import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {addTodolistAC, TodolistDomainType, todoListsReducer,} from "./todoLists-reducer";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodoListsState: TodolistDomainType[] = []

    const action = addTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodoLists = endTodoListsState[0].id

    expect(idFromTasks).toBe(action.payload.todoListId)
    expect(idFromTodoLists).toBe(action.payload.todoListId)
})