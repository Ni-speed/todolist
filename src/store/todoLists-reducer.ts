import {FilterValueType, TodoListsType} from "../App";
import {v1} from "uuid";


export const todoListsReducer = (state: TodoListsType[], action: ActionType): TodoListsType[] => {
    switch (action.type) {
        case "ADD-TODOLIST": {
            let newTodoListId = v1();
            let newTodoList: TodoListsType = {
                id: newTodoListId,
                title: action.payload.title,
                filter: "all",
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
    }
    return state
};
//Actions
export const AddTodoList = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {title}
    } as const
}
export const ChangeTodoListTitle = (todoListId: string, title: string) => {
    return {
        type: 'CHANGE-TODO-TITLE',
        payload: {todoListId, title}
    } as const
}
export const ChangeFilter = (todoListId: string, filter: FilterValueType) => {
    return {
        type: 'CHANGE-TODO-FILTER',
        payload: {todoListId, filter}
    } as const
}
//Types
type ActionType = AddTodoListType
    | ChangeTodoListTitleType
    | ChangeFilterType
export type AddTodoListType = ReturnType<typeof AddTodoList>
export type ChangeTodoListTitleType = ReturnType<typeof ChangeTodoListTitle>
export type ChangeFilterType = ReturnType<typeof ChangeFilter>