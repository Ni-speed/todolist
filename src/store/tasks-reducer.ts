import {AddTodoListType, RemoveTodoListType, SetTodoListACType} from "./todoLists-reducer";
import {v1} from "uuid";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todoListApi, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "./store";
//Types
type ActionType =
    | removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListACType
    | setTasksACType

export type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;
export type removeTaskACType = ReturnType<typeof removeTaskAC>;
export type addTaskACType = ReturnType<typeof addTaskAC>;
export type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;
export type setTasksACType = ReturnType<typeof setTasksAC>;
export type TasksStateType = {
    [key: string]: TaskType[];
};
// export type TaskType = {
//     id: string;
//     title: string;
//     isDone: boolean;
// };

const initialState: TasksStateType = {};
//Reducer
export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            return {
                ...state,
                [action.payload.todoListId]: action.payload.tasks
            }
        }
        case 'SET-TODOLISTS': {
            action.payload.todoLists.map(tl => ({
                ...state[tl.id] = []
            }))
            return state
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId]
                    .filter(ts => ts.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {

            const newTask = {
                id: v1(),
                title: action.payload.task.title,
                status: TaskStatuses.Completed,
                priority: TaskPriorities.Hi,
                startDate: '',
                deadline: '',
                description: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            };
            return {
                ...state,
                [action.payload.task.todoListId]: [newTask, ...state[action.payload.task.todoListId]],
            };
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map((el) =>
                    el.id === action.taskId ? {...el, status: action.status} : el
                ),
            };
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId]
                    .map(ts => ts.id === action.payload.taskId
                        ? {...ts, title: action.payload.title}
                        : ts)
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todoListId]: []}
        }
        case 'REMOVED-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.payload.todoListId];
            return copyState;
        }
        default:
            return state;
    }
};
//Actions
export const removeTaskAC = (todoListId: string, taskId: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {todoListId, taskId},
    } as const;
};
export const addTaskAC = (task: TaskType) => {
    return {
        type: "ADD-TASK",
        payload: {task},
    } as const;
};
export const changeTaskStatusAC = (todoListId: string, taskId: string, status: TaskStatuses) => {
    return {type: "CHANGE-TASK-STATUS", taskId, status, todoListId} as const;
};
export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string,) => {
    return {
        type: "CHANGE-TASK-TITLE",
        payload: {taskId, title, todoListId}
    } as const;
};
export const setTasksAC = (todoListId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {todoListId, tasks}
    } as const
};
//Thunks
export const getTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
    let response = await todoListApi.getTask(todoListId)
    dispatch(setTasksAC(todoListId, response.data.items))
}
export const removeTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
    await todoListApi.deleteTask(todoListId, taskId)
    dispatch(removeTaskAC(todoListId, taskId))
}
export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    let response = await todoListApi.createTask(todoListId, title)
    dispatch(addTaskAC(response.data.data.item))
}
export const changeTaskStatusTC = (todoListId: string, taskId: string, status: TaskStatuses) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todoListId].find(t => t.id === taskId)
        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            }
            await todoListApi.updateTask(todoListId, taskId, model)
            dispatch(changeTaskStatusAC(todoListId, taskId, status))
        }

    }