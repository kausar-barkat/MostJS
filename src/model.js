// @flow

import { filter } from "@most/core/dist";

export type Id = number;

export type Todo = {
  description: string,
  completed: boolean,
  id: Id,
};

export type Filter = "/" | "/active" | "/completed";

export type App = {
  todos: Todo[],
  filter: Filter,
  nextId: Id,
};

export const newTodo = (description: string, id: number): Todo => ({
  description,
  completed: false,
  id,
});

export const emptyApp: App = { todos: [], filter: "/", nextId: 0 };

const countIfCompleted = (count, { completed }) => count + (completed ? 1 : 0);

export const completedCount = ({ todos }: App): number =>
  todos.reduce(countIfCompleted, 0);

export const filteredTodo = (
  description: string,
  id: number,
  app: App
): any => {
  const convertedDescription = description.toLocaleLowerCase();
  console.log("convertedDescription", convertedDescription);
  const value = app.todos.some((el) => el.description === convertedDescription);
  console.log("value", value);
  return value
    ? ""
    : { description: convertedDescription, completed: false, id };
};

const getTodos = (app: App, description: string, id: number) => {
  const newTodoValue = filteredTodo(description, id, app);
  console.log("newTodoValue", newTodoValue);
  return newTodoValue === "" ? app.todos : app.todos.concat(newTodoValue);
};

export const addTodo =
  (description: string) =>
  (app: App): App => ({
    ...app,
    nextId: app.nextId + 1,
    todos: getTodos(app, description, app.nextId),
  });

export const removeTodo =
  (id: Id) =>
  (app: App): App => ({
    ...app,
    todos: app.todos.filter((todo) => todo.id !== id),
  });

export const updateCompleted =
  (completed: boolean, id: Id) =>
  (app: App): App => ({
    ...app,
    todos: app.todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    ),
  });

export const updateAllCompleted =
  (completed: boolean) =>
  (app: App): App => ({
    ...app,
    todos: app.todos.map((todo) => ({ ...todo, completed })),
  });

export const removeAllCompleted = (app: App): App => ({
  ...app,
  todos: app.todos.filter((todo) => !todo.completed),
});

export const setFilter =
  (filter: Filter) =>
  (app: App): App => ({
    ...app,
    filter,
  });
