import {TaskStateType} from "../App";
import {RemoveTask, tasksReducer} from "./tasks-reducer";

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
    const endState = tasksReducer(startState, RemoveTask('todolistID1', '2'))

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