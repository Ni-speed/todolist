import {AddTodoListType, RemoveTodoListType} from "./todoLists-reducer";
import {v1} from "uuid";

export type TasksStateType = {
    [key: string]: TaskType[];
};
export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

const initialState: TasksStateType = {};
export const tasksReducer = (state: TasksStateType = initialState, action: ActionType):TasksStateType => {
    switch (action.type) {
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
                title: action.payload.title,
                isDone: false,
            };
            return {
                ...state,
                [action.payload.todoListId]: [newTask, ...state[action.payload.todoListId],
                ],
            };
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map((el) =>
                    el.id === action.taskId ? {...el, isDone: action.isDone} : el
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

export const removeTaskAC = (todoListId: string, taskId: string,) => {
    return {
        type: "REMOVE-TASK",
        payload: {todoListId, taskId},
    } as const;
};
export const addTaskAC = (todoListId: string, title: string) => {
    return {
        type: "ADD-TASK",
        payload: {todoListId, title},
    } as const;
};
export const changeTaskStatusAC = (todoListId: string, taskId: string, isDone: boolean,) => {
    return {type: "CHANGE-TASK-STATUS", taskId, isDone, todoListId} as const;
};
export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string,) => {
    return {
        type: "CHANGE-TASK-TITLE",
        payload: {taskId, title, todoListId}
    } as const;
};

type ActionType =
    | removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodoListType
    | RemoveTodoListType

export type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>;
export type removeTaskACType = ReturnType<typeof removeTaskAC>;
export type addTaskACType = ReturnType<typeof addTaskAC>;
export type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>;

