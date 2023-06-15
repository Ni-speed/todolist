export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType
}
type ActionsType = setAppStatusACType
export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        default:
            return state
    }
}

//Actions
export const setAppStatusAC = (status:RequestStatusType) => {
    return { type: 'APP/SET-STATUS', payload:{status} } as const
}

