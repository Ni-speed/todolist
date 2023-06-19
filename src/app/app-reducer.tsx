import {Dispatch} from "redux";
import {setIsLoggedInAC, setIsLoggedInACType} from "../features/Login/auth-reducer";
import {authApi} from "../api/todolist-api";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: 'ERROR' as string | null,
    isInitialized: false
}
type ActionsType = setAppStatusACType
    | setAppErrorACType
     | setAppInitializeACType
export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type setAppInitializeACType = ReturnType<typeof setAppInitializeAC>
type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case 'APP/SET-ERROR': {
            return {...state, error: action.payload.error}
        }
        case 'APP/SET-IS-INITIALIZE': {

            return { ...state, isInitialized: action.payload.isInitialized}
        }

        default:
            return state
    }
}

//Actions
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', payload: {status}} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', payload: {error}} as const
}
export const setAppInitializeAC = (isInitialized: boolean) => {

    return { type: 'APP/SET-IS-INITIALIZE', payload: {isInitialized}} as const
}

//Thunks

