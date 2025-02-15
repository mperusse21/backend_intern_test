import { type QueryResolvers as IQuery } from "./generated/graphql";
import { Context } from "./context";

export const Query: IQuery<Context> = {
  hello: () => "world",
  // Gets a single Todo by ID (can be null)
  todo: async (_, { id }, { prisma }) => {
    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    // If no todo is found, returns null
    if (!todo) {
      return null;
    }

    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toString(),
      updatedAt: todo.updatedAt.toString(),
    };
  },
  // Returns an array of all Todos. Can be filtered by completion status.
  todos: async (_, { completed }, { prisma }) => {
    const todos = await prisma.todo.findMany({
      where: {
        completed: completed ?? undefined,
      },
    });

    // Convert all the Todo dates into strings
    const convertedDates = todos.map((todo) => {
      return {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt.toString(),
        updatedAt: todo.updatedAt.toString(),
      };
    });

    return convertedDates;
  },
};
