import { type QueryResolvers as IQuery } from "./generated/graphql";
import { Context } from "./context";
import { getOverdueFilter } from "../date-utils";

export const Query: IQuery<Context> = {
  hello: () => "world",
  // Gets a single Todo by ID (can be null)
  todo: async (_, { id }, { prisma }) => {
    const foundTodo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    // If no Todo is found, returns null
    if (!foundTodo) {
      return null;
    }

    return {
      id: foundTodo.id,
      title: foundTodo.title,
      completed: foundTodo.completed,
      createdAt: foundTodo.createdAt.toString(),
      updatedAt: foundTodo.updatedAt.toString(),
      dueDate: foundTodo.dueDate?.toString(),
    };
  },
  // Returns an array of all Todos. Has options to filter by completion status,
  // sort by creation date, or skip/take a certain number of Todos (pagination).
  todos: async (_, { isCompleted, isOverdue, skip, take, sortByCreatedAt }, { prisma }) => {
    // Converts the isOverdue boolean into a filter.
    const overdueFilter = getOverdueFilter(isOverdue ?? undefined);

    const foundTodos = await prisma.todo.findMany({
      skip: skip ?? 0,
      take: take ?? undefined,
      where: {
        completed: isCompleted ?? undefined,
        dueDate: overdueFilter,
      },
      orderBy: {
        createdAt: sortByCreatedAt ?? undefined,
      },
    });

    // Convert all the Todo dates into strings
    const convertedDates = foundTodos.map((todo) => {
      return {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt.toString(),
        updatedAt: todo.updatedAt.toString(),
        dueDate: todo.dueDate?.toString(),
      };
    });

    return convertedDates;
  },
};
