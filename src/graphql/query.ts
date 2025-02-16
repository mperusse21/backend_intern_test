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
      dueDate: todo.dueDate?.toString()
    };
  },
  // Returns an array of all Todos. Has options to filter by completion status, 
  // sort by creation date, or skip/take a certain number of Todos (pagination).
  todos: async (_, { isCompleted, isOverdue, skip, take, sortByCreatedAt }, { prisma }) => {
    let overdueFilter;
    // Probably going to move this into utils
    if (isOverdue != null){
      if (isOverdue){
        overdueFilter = {
          lte: new Date()
        }
      } else {
        overdueFilter = {
          gt: new Date()
        }
      }
    }

    const todos = await prisma.todo.findMany({
      skip: skip ?? 0,
      take: take ?? undefined,
      where: {
        completed: isCompleted ?? undefined,
        dueDate: overdueFilter ?? undefined
      },
      orderBy: {
        createdAt: sortByCreatedAt  ?? undefined,
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
        dueDate: todo.dueDate?.toString()
      };
    });

    return convertedDates;
  },
};
