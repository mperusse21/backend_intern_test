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

    // If no Todo is found, returns null
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
  // Returns an array of all Todos. Has options to filter by completion status 
  // or skip/take a certain number of Todos (pagination).
  todos: async (_, { completed, skip, take }, { prisma }) => {
    const todos = await prisma.todo.findMany({
      skip: skip ?? 0,
      take: take ?? undefined,
      where: {
        completed: completed ?? undefined,
      },
      // Default order is most recent first
      orderBy: {
        createdAt: 'desc',
      }
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
