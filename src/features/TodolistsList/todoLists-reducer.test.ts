import { v1 } from "uuid";
import {
  FilterValueType,
  TodolistDomainType,
  todoListsActions,
  todoListsReducer,
  todoListThunks,
} from "features/TodolistsList/todoLists-reducer";

let todolistID1: string;
let todolistID2: string;
let startState: TodolistDomainType[];
beforeEach(() => {
  todolistID1 = v1();
  todolistID2 = v1();
  startState = [
    { id: todolistID1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
    { id: todolistID2, title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
  ];
});
test(`correct todolist should be added`, () => {
  const NewTODO = {
    id: "1",
    addedDate: "",
    order: 0,
    title: "New TodoList Title",
  };
  const endState = todoListsReducer(
    startState,
    todoListThunks.addTodoList.fulfilled({ todoList: NewTODO }, "requestId", NewTODO.title),
  );
  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(NewTODO.title);
});
test(`correct todolist should change its name`, () => {
  let newTodolistTitle = "New Title";
  const args = { todoListId: todolistID1, title: newTodolistTitle };
  const endState = todoListsReducer(startState, todoListThunks.changeTodoListTitle.fulfilled(args, "requestId", args));

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe(newTodolistTitle);
  expect(endState[1].title).toBe("What to buy");
});
test(`correct filter of todolist should be changed`, () => {
  let newFilter: FilterValueType = "completed";

  const endState = todoListsReducer(
    startState,
    todoListsActions.changeFilter({ todoListId: todolistID1, filter: newFilter }),
  );
  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe(newFilter);
  expect(endState[1].filter).toBe("all");
});
