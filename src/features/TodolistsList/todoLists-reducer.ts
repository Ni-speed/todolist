import {todoListApi, TodoListType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppErrorAC,
    setAppErrorACType,
    setAppStatusAC,
    setAppStatusACType
} from "../../app/app-reducer";

//Types
type ActionType = AddTodoListType
    | ChangeTodoListTitleType
    | ChangeFilterType
    | RemoveTodoListType
    | SetTodoListACType
    | setAppStatusACType
    | setAppErrorACType
    | changeTodolistEntityStatusACType
export type AddTodoListType = ReturnType<typeof addTodolistAC>
export type ChangeTodoListTitleType = ReturnType<typeof changeTodoListTitleAC>
export type ChangeFilterType = ReturnType<typeof changeFilterAC>
export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
export type SetTodoListACType = ReturnType<typeof setTodoListAC>
export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterValueType = "all" | "active" | "completed";

export type TodolistDomainType = TodoListType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
const initialState: TodolistDomainType[] = []
// Reducer
export const todoListsReducer = (state: TodolistDomainType[] = initialState, action: ActionType): TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
        case "ADD-TODOLIST": {
            return [{...action.payload.todoList, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODO-TITLE': {
            return state.map(tl => tl.id === action.payload.todoListId
                ? {...tl, title: action.payload.title}
                : tl)
        }
        case 'CHANGE-TODO-FILTER': {
            return state.map(tl => tl.id === action.payload.todoListId
                ? {...tl, filter: action.payload.filter}
                : tl)
        }
        case 'REMOVED-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.todoListId)
        }
        case 'CHANGE-TODO-ENTITY-STATUS': {
            return state.map(tl => tl.id === action.payload.todoListId
            ? {...tl, entityStatus: action.payload.status}
            : tl)
        }
    }
    return state
};
//Actions
export const setTodoListAC = (todoLists: TodoListType[]) => {
    return {type: 'SET-TODOLISTS', payload: {todoLists}} as const
}
export const addTodolistAC = (todoList: TodoListType) => {
    return {type: 'ADD-TODOLIST', payload: {todoList}} as const
}
export const changeTodoListTitleAC = (todoListId: string, title: string) => {
    return {
        type: 'CHANGE-TODO-TITLE',
        payload: {todoListId, title}
    } as const
}
export const changeFilterAC = (todoListId: string, filter: FilterValueType) => {
    return {
        type: 'CHANGE-TODO-FILTER',
        payload: {todoListId, filter}
    } as const
}
export const removeTodoListAC = (todoListId: string) => {
    return {
        type: 'REMOVED-TODOLIST',
        payload: {todoListId}
    } as const
}
export const changeTodolistEntityStatusAC = (todoListId: string, status: RequestStatusType) => {
    return {type: 'CHANGE-TODO-ENTITY-STATUS', payload: {todoListId, status} }as const
}
// Thunks
export const getTodoListTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    let response = await todoListApi.getTodoLists()
    dispatch(setTodoListAC(response.data))
    dispatch(setAppStatusAC('succeeded'))
}
export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todoListId,'loading'))
    await todoListApi.deleteTodolist(todoListId)
    dispatch(removeTodoListAC(todoListId))
    dispatch(setAppStatusAC('succeeded'))
}
export const addTodoListTC = (title: string) => async (dispatch: Dispatch<ActionType>) => {
    try {
        dispatch(setAppStatusAC('loading'));
        let response = await todoListApi.createTodoList(title);
        if (response.data.resultCode === 0) {
            dispatch(addTodolistAC(response.data.data.item));
            dispatch(setAppStatusAC('succeeded'));
        } else {
            if (response.data.messages.length) {
                dispatch(setAppErrorAC(response.data.messages[0]));
            } else {
                dispatch(setAppErrorAC('Some error occurred'));
            }
            dispatch(setAppStatusAC('failed'));
        }
    } catch (error) {
        console.error(error)
        dispatch(setAppErrorAC('Network error'))
    }
}
export const changeTodoListTitleTC = (todoListId: string, title: string) => async (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    await todoListApi.updateTodolistTitle(todoListId, title)
    dispatch(changeTodoListTitleAC(todoListId, title))
    dispatch(setAppStatusAC('succeeded'))
}