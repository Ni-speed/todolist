import {v1} from "uuid";
import {todoListApi, TodoListType} from "../api/todolist-api";
import {Dispatch} from "redux";

//Types
type ActionType = AddTodoListType
    | ChangeTodoListTitleType
    | ChangeFilterType
    | RemoveTodoListType
    | SetTodoListACType
export type AddTodoListType = ReturnType<typeof addTodolistAC>
export type ChangeTodoListTitleType = ReturnType<typeof changeTodoListTitleAC>
export type ChangeFilterType = ReturnType<typeof changeFilterAC>
export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
export type SetTodoListACType = ReturnType<typeof setTodoListAC>

export type FilterValueType = "all" | "active" | "completed";
// export type TodoListsType = {
//     id: string;
//     title: string;
//     filter: FilterValueType;
// };
export type TodolistDomainType = TodoListType & {
    filter: FilterValueType
}
const initialState: TodolistDomainType[] = []
// Reducer
export const todoListsReducer = (state: TodolistDomainType[] = initialState, action: ActionType): TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all'})) }
        case "ADD-TODOLIST": {
            let newTodoList: TodolistDomainType = {
                id: action.payload.todoListId,
                title: action.payload.title,
                filter: "all",
                addedDate: '',
                order: 0
            };
            return [newTodoList, ...state]
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
    }
    return state
};
//Actions
export const setTodoListAC = (todoLists: TodoListType[]) => {
    return {type: 'SET-TODOLISTS', payload: {todoLists}} as const
}
export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {title, todoListId: v1()}
    } as const
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
// Thunks
export const getTodoListTC = () => async (dispatch: Dispatch) => {
    let response = await todoListApi.getTodoLists()
    dispatch(setTodoListAC(response.data))
}