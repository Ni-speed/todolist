import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'bd2bd403-d434-43b5-b436-baba75b1cb77'
    }
})

export const todoListApi = {
    getTodoLists() {
        return instance.get(`/todo-lists`)
    },
    createTodoList(title: string) {
        return instance.post(`/todo-lists`, {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete(`/todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put(`/todo-lists/${todolistId}`, {title})
    }
}