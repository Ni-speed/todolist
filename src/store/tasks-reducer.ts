const initialState: TasksStateType = {
count: []
}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
            [action.payload.todoListId]: state[action.payload.todoListId]
                .filter(el => el.id !== action.payload.taskId)
            }
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todoListId: string) => {
    return { type: 'REMOVE-TASK', payload: { taskId, todoListId }
    } as const
}



type ActionType = RemoveTaskACType
export type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export type TasksStateType = {
    [key: string]: TaskType[]
}
export type TaskType = {
    id: string, title: string, isDone: boolean
}