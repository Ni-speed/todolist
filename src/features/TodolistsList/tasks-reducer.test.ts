import { tasksReducer, TasksStateType, tasksThunks } from "features/TodolistsList/tasks-reducer";
import { todoListThunks } from "features/TodolistsList/todoLists-reducer";
import { TaskPriorities, TaskStatuses } from "common/enums";

let startState: TasksStateType;
beforeEach(() => {
  startState = {
    todolistID1: [
      {
        id: "1",
        title: "HTML&CSS",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "ReactJS",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
    todolistID2: [
      {
        id: "1",
        title: "Rest API",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "GraphQL",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Hi,
        startDate: "",
        deadline: "",
        description: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
  };
});

test(`correct task should be deleted from correct array`, () => {
  const args = { todoListId: "todolistID1", taskId: "2" };
  const endState = tasksReducer(startState, tasksThunks.removeTask.fulfilled(args, "requestId", args));
  console.log(endState);
  expect(endState["todolistID1"].length).toBe(2);
  expect(endState["todolistID2"].length).toBe(2);
  expect(endState["todolistID1"].every((t) => t.id !== "2")).toBeTruthy();
});

test(`correct task should be added to correct array`, () => {
  const newTask = {
    id: "2",
    title: "New Task title",
    status: TaskStatuses.Completed,
    priority: TaskPriorities.Hi,
    startDate: "",
    deadline: "",
    description: "",
    todoListId: "todolistID1",
    order: 0,
    addedDate: "",
  };
  const endState = tasksReducer(
    startState,
    tasksThunks.addTask.fulfilled({ task: newTask }, "requestId", {
      title: newTask.title,
      todoListId: newTask.todoListId,
    }),
  );

  expect(endState["todolistID1"].length).toBe(4);
  expect(endState["todolistID2"].length).toBe(2);
  expect(endState["todolistID1"][0].id).toBeDefined();
  expect(endState["todolistID1"][0].title).toBe("New Task title");
  expect(endState["todolistID1"][0].status).toBe(TaskStatuses.Completed);
});

test(`status of specified task should be changed`, () => {
  const args = { todoListId: "todolistID1", taskId: "2", model: { status: TaskStatuses.New } };
  const endState = tasksReducer(startState, tasksThunks.updateTask.fulfilled(args, "requestId", args));
  expect(endState["todolistID1"][1].status).toBe(TaskStatuses.New);
  expect(endState["todolistID2"][1].status).toBe(TaskStatuses.Completed);
});

test(`title if specified task should be changed`, () => {
  const args = { todoListId: "todolistID1", taskId: "2", model: { title: "Update Task Title" } };
  const endState = tasksReducer(startState, tasksThunks.updateTask.fulfilled(args, "requestId", args));
  expect(endState["todolistID1"][1].title).toBe("Update Task Title");
  expect(endState["todolistID2"][1].title).toBe("GraphQL");
});

test("new array should be added when new todolist is added", () => {
  const todoList = {
    id: "1",
    addedDate: "",
    order: 0,
    title: " ",
  };
  const endState = tasksReducer(
    startState,
    todoListThunks.addTodoList.fulfilled({ todoList }, "requestId", todoList.title),
  );

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todoListId1" && k != "todoListId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test(`property with todolistId should be deleted`, () => {
  const endState = tasksReducer(
    startState,
    todoListThunks.removeTodoList.fulfilled({ todoListId: "todolistID1" }, "requestId", "todolistID1"),
  );
  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID1"]).not.toBeDefined();
});

test(`tasks should be added for todolist`, () => {
  const action = tasksThunks.getTasks.fulfilled(
    { tasks: startState["todolistID1"], todoListId: "todolistID1" },
    "requestId",
    "todolistID1",
  );

  const endState = tasksReducer(
    {
      ...startState,
      todolistID1: [],
      todolistID2: [],
    },
    action,
  );
  expect(endState["todolistID1"].length).toBe(3);
  expect(endState["todolistID2"].length).toBe(0);
});
