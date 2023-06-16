// generic function
import {ResponseType} from "../api/todolist-api";
import {setAppErrorAC, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../app/app-reducer";
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<setAppStatusACType | setAppErrorACType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Network error'))
    dispatch(setAppStatusAC('failed'))

    debugger
}

type ErrorUtilsDispatchType = Dispatch<setAppErrorACType | setAppStatusACType>
