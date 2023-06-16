import {Dispatch} from 'redux'
import {setAppErrorACType, setAppStatusAC, setAppStatusACType} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authApi, LoginType} from "../../api/todolist-api";

const initialState = {
    isLoggedIn: false
}
// Types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | setAppStatusACType | setAppErrorACType
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
}


