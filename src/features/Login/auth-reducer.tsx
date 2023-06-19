import {Dispatch} from 'redux'
import {
    setAppErrorACType,
    setAppInitializeAC,
    setAppInitializeACType,
    setAppStatusAC,
    setAppStatusACType
} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authApi, LoginType} from "../../api/todolist-api";

const initialState = {
    isLoggedIn: false
}
// Types
type ActionsType = setIsLoggedInACType
    | setAppStatusACType
    | setAppErrorACType
    | setAppInitializeACType
export type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// Actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// Thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        let response = await authApi.login(data)
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e: any) {
        console.error(e)
        handleServerNetworkError(e, dispatch)
    }
    finally {
        dispatch(setAppInitializeAC(true))
    }
}
export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        let response = await authApi.logout()
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e: any) {
        console.error(e)
        handleServerNetworkError(e, dispatch)
    }
}
export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {

    dispatch(setAppStatusAC('loading'))
    try {
        let response = await authApi.me()
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppInitializeAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
            dispatch(setAppInitializeAC(true))
        }
    } catch (e) {
        const error = (e as { message: string })
        handleServerNetworkError(error, dispatch)
    }
}



