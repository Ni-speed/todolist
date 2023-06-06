import {TaskStateType} from "../App";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, tasksReducer} from "./tasks-reducer";

test(`correct task should be deleted from correct array`, () => {
    const startState: TaskStateType = {
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
    const startState: TaskStateType = {
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
    const startState: TaskStateType = {
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