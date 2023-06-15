import {TasksStateType, updateTaskAC} from "../tasks-reducer";
import {addTaskAC, removeTaskAC, tasksReducer} from "../tasks-reducer";
import {addTodolistAC, removeTodoListAC} from "../todoLists-reducer";
import {TaskPriorities, TaskStatuses} from "../../../api/todolist-api";

let startState: TasksStateType
beforeEach(() => {
    startState = {
        'todolistID1': [
            {
                id: '1', title: "HTML&CSS",
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: "JS",
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: "ReactJS",
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
        ],
        'todolistID2': [
            {
                id: '1', title: "Rest API", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: "GraphQL", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
        ],
    }
})

test(`correct task should be deleted from correct array`, () => {

    const endState = tasksReducer(startState, removeTaskAC('todolistID1', '2'))

    expect(endState).toEqual({
        'todolistID1': [
            {
                id: '1', title: "HTML&CSS", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: '3', title: "ReactJS", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
        ],
        'todolistID2': [
            {
                id: '1', title: "Rest API", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: '2', title: "GraphQL", status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
        ]
    })
})

test(`correct task should be added to correct array`, () => {

    const endState = tasksReducer(startState, addTaskAC(/*'todolistID1',*/ {
        id: '1', title: "New Task title", status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: '',
        deadline: '',
        description: '',
        todoListId: '',
        order: 0,
        addedDate: ''
    }))

    expect(endState['todolistID1'].length).toBe(4)
    expect(endState['todolistID2'].length).toBe(2)
    expect(endState['todolistID1'][0].id).toBeDefined()
    expect(endState['todolistID1'][0].title).toBe('New Task title')
    expect(endState['todolistID1'][0].status).toBe(TaskStatuses.Completed)
})

test(`status of specified task should be changed`, () => {

    const endState = tasksReducer(startState, updateTaskAC('todolistID1', '2', {status: TaskStatuses.New}))
    expect(endState['todolistID1'][1].status).toBe(false)
    expect(endState['todolistID2'][1].status).toBe(true)
})

test(`title if specified task should be changed`, () => {

    const endState = tasksReducer(startState, updateTaskAC('todolistID1', '2', {title: 'Update Task Title'}))
    expect(endState['todolistID1'][1].title).toBe('Update Task Title')
    expect(endState['todolistID2'][1].title).toBe('GraphQL')
})

test('new array should be added when new todolist is added', () => {

    const endState = tasksReducer(startState, addTodolistAC({
        id: '1',
        addedDate: '',
        order: 0,
        title: ' '
    }))

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todoListId1' && k != 'todoListId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test(`property with todolistId should be deleted`, () => {

    const endState = tasksReducer(startState, removeTodoListAC('todolistID1'))
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistID1']).not.toBeDefined()
})