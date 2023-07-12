import React, { ChangeEvent, useEffect, useState } from "react";
import { TaskPriorities, TaskStatuses, todoListApi, UpdateTaskModelType } from "../api/todolist-api";

export default {
  title: "API",
};
export const GetTodoLists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todoListApi.getTodoLists().then((res) => {
      setState(res.data);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};
export const CreateTodoList = () => {
  const [state, setState] = useState<any>(null);
  const [titleTodo, setTitleTodo] = useState<string>("");

  const titleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(e.currentTarget.value);
  };
  const addHandler = async () => {
    let response = await todoListApi.createTodoList(titleTodo);
    setState(response.data);
  };

  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"Title"} value={titleTodo} onChange={titleHandler} />
      <button onClick={addHandler}>Add New TODO</button>
    </div>
  );
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");
  useEffect(() => {}, []);
  const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const deleteHandler = () => {
    todoListApi.deleteTodolist(todoListId).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"TodoListId"} value={todoListId} onChange={todoListIdHandler} />
      <button onClick={deleteHandler}>Delete TODO</button>
    </div>
  );
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");

  const newTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };
  const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const changeTitleHandler = () => {
    todoListApi.updateTodolistTitle(todoListId, newTitle).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"Enter new title"} value={newTitle} onChange={newTitleHandler} />
      <input placeholder={"todoListId"} value={todoListId} onChange={todoListIdHandler} />
      <button onClick={changeTitleHandler}>Change Title</button>
    </div>
  );
};
export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");

  const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const addHandler = () => {
    todoListApi.getTask(todoListId).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"TodoListId"} value={todoListId} onChange={todoListIdHandler} />
      <button onClick={addHandler}>Add Tasks</button>
    </div>
  );
};
export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const idHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const titleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const addHandler = async () => {
    let response = await todoListApi.createTask({ todoListId, title });
    setState(response.data);
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"TodoListId"} value={todoListId} onChange={idHandler} />
      <input placeholder={"New Title"} value={title} onChange={titleHandler} />
      <button onClick={addHandler}>Add New Task</button>
    </div>
  );
};
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const taskIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.currentTarget.value);
  };
  const deleteTask = async () => {
    const response = await todoListApi.deleteTask(todoListId, taskId);
    setState(response.data);
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"TodoListId"} value={todoListId} onChange={todoListIdHandler} />
      <input placeholder={"TaskId"} value={taskId} onChange={taskIdHandler} />
      <button onClick={deleteTask}>Delete Task</button>
    </div>
  );
};
export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todoListId, setTodoListId] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");

  const newTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };
  const todoListIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoListId(e.currentTarget.value);
  };
  const taskIdIdHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.currentTarget.value);
  };
  const changeTitleHandler = () => {
    const model: UpdateTaskModelType = {
      title: newTitle,
      description: "",
      status: 0,
      priority: 0,
      startDate: "",
      deadline: "",
    };
    todoListApi.updateTask(todoListId, taskId, model).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {JSON.stringify(state)}
      <input placeholder={"Enter new title"} value={newTitle} onChange={newTitleHandler} />
      <input placeholder={"todoListId"} value={todoListId} onChange={todoListIdHandler} />
      <input placeholder={"taskId"} value={taskId} onChange={taskIdIdHandler} />
      <button onClick={changeTitleHandler}>Change Title</button>
    </div>
  );
};
