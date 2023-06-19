import {
    AddTodoListType, changeTodolistEntityStatusAC,
    changeTodolistEntityStatusACType, clearTodosDataACType,
    RemoveTodoListType,
    SetTodoListACType
} from "./todoLists-reducer";
import {v1} from "uuid";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todoListApi, UpdateTaskModelType} from "../../api/todolist-api";
import {AppRootStateType} from "../../app/store";
import {setAppErrorAC, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
//Types
type ActionType =
    | removeTaskACType
    | addTaskACType
    | updateTaskACType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListACType
    | setTasksACType
    | setAppStatusACType
    | setAppErrorACType
    | changeTodolistEntityStatusACType
    | clearTodosDataACType

export type removeTaskACType = ReturnType<typeof removeTaskAC>;
export type addTaskACType = ReturnType<typeof addTaskAC>;
export type updateTaskACType = ReturnType<typeof updateTaskAC>;
export type setTasksACType = ReturnType<typeof setTasksAC>;
export type TasksStateType = {
    [key: string]: TaskType[];
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
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
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
            };
        }
        case 'UPDATE-TASK': {
            debugger
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId]
                    .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todoList.id]: []}
        }
        case 'REMOVED-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.payload.todoListId];
            return copyState;
        }
        case 'CLEAR-DATA': {
            return {}
        }
        default:
            return state;
    }
};
//Actions
export const setTasksAC = (todoListId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: {todoListId, tasks}
    } as const
};
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
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {taskId, model, todoListId}
    } as const;
};

//Thunks
export const getTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        let response = await todoListApi.getTask(todoListId)
        dispatch(setTasksAC(todoListId, response.data.items))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error: any) {
        console.error(error)
    }

}
export const removeTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
    try {
        let response = await todoListApi.deleteTask(todoListId, taskId)
        if (response.data.resultCode === 0) {
            dispatch(removeTaskAC(todoListId, taskId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error: any) {
        console.error(error)
        await handleServerNetworkError(error, dispatch)
        dispatch(changeTodolistEntityStatusAC(todoListId, 'failed'))
    }

}
export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
        let response = await todoListApi.createTask(todoListId, title)
        if (response.data.resultCode === 0) {
            dispatch(addTaskAC(response.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
        dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'))
    } catch (error: any) {
        console.error(error)
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTaskTC = (todoListId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        debugger
        dispatch(setAppStatusAC('loading'))
        const task = getState().tasks[todoListId].find(t => t.id === taskId)
        if (task) {
            try {
                const apiModel: UpdateTaskModelType = {
                    title: task.title,
                    startDate: task.startDate,
                    priority: task.priority,
                    description: task.description,
                    deadline: task.deadline,
                    status: task.status,
                    ...model
                }
                debugger
                let response = await todoListApi.updateTask(todoListId, taskId, apiModel)
                debugger
                if (response.data.resultCode === 0) {
                    debugger
                    dispatch(updateTaskAC(todoListId, taskId, model))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(response.data, dispatch)
                }

            } catch (error: any) {
                debugger
                console.error(error)
                handleServerNetworkError(error, dispatch)
            }

        }
    }