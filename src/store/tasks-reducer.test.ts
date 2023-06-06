import {TasksStateType} from "../App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {addTodolistAC} from "./todoLists-reducer";

test(`correct task should be deleted from correct array`, () => {
    const startState: TasksStateType = {
        'todolistID1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false},
        ],
        'todolistID2': [
            {id: '1', title: "Rest API", isDone: true},
            {id: '2', title: "GraphQL", isDone: false},
        ],
    }
    const endState = tasksReducer(startState, removeTaskAC('todolistID1', '2'))

    expect(endState).toEqual({
        'todolistID1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false},
        ],
        'todolistID2': [
            {id: '1', title: "Rest API", isDone: true},
            {id: '2', title: "GraphQL", isDone: false},
        ]
    })
})
test(`correct task should be added to correct array`, ()=>{
    const startState: TasksStateType = {
        'todolistID1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false},
        ],
        'todolistID2': [
            {id: '1', title: "Rest API", isDone: true},
            {id: '2', title: "GraphQL", isDone: false},
        ],
    }
    const endState = tasksReducer(startState, addTaskAC('todolistID1', 'New Task title'))

    expect(endState['todolistID1'].length).toBe(4)
    expect(endState['todolistID2'].length).toBe(2)
    expect(endState['todolistID1'][0].id).toBeDefined()
    expect(endState['todolistID1'][0].title).toBe('New Task title')
    expect(endState['todolistID1'][0].isDone).toBe(false)
})
test(`status of specified task should be changed`, ()=>{
    const startState: TasksStateType = {
        'todolistID1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false},
        ],
        'todolistID2': [
            {id: '1', title: "Rest API", isDone: true},
            {id: '2', title: "GraphQL", isDone: true},
        ],
    }
    const endState = tasksReducer(startState, changeTaskStatusAC('todolistID1', '2', false))
    expect(endState['todolistID1'][1].isDone).toBe(false)
    expect(endState['todolistID2'][1].isDone).toBe(true)
})
test(`title if specified task should be changed`, ()=>{
       
    const startState: TasksStateType = {
        'todolistID1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false},
        ],
        'todolistID2': [
            {id: '1', title: "Rest API", isDone: true},
            {id: '2', title: "GraphQL", isDone: true},
        ],
    }
    const endState = tasksReducer(startState, changeTaskTitleAC('todolistID1', '2', 'Update Task Title'))
    expect(endState['todolistID1'][1].title).toBe('Update Task Title')
    expect(endState['todolistID2'][1].title).toBe('GraphQL')
})
test('new array should be added when new todolist is added', () => {
    const startState: TasksStateType = {
        'todoListId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todoListId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }

    const endState = tasksReducer(startState, addTodolistAC(' '))


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todoListId1' && k != 'todoListId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
