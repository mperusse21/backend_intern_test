import { type QueryResolvers as IQuery } from "./generated/graphql";
import { Context } from "./context";
import { getOverdueFilter } from "../date-utils";
import { GraphQLError } from "graphql/error/GraphQLError";

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
  // Returns an array of all Todos. Has options to filter by completion/overdue status,
  // sort by creation/due date, or skip/take a certain number of Todos (pagination).
  todos: async (_, { filterBy, sortBy, skip, take }, { prisma }) => {
    if (sortBy?.sortByCreatedAt && sortBy.sortByDueDate) {
      throw new GraphQLError("Unable to order by multiple criteria. Please select only one.");
    }

    if (skip != null && skip < 0){
      throw new GraphQLError("Skip cannot be negative. Please provide an integer of zero or higher");
    }

    // Converts the isOverdue boolean into a filter.
    const overdueFilter = getOverdueFilter(filterBy?.isOverdue ?? undefined);

    const foundTodos = await prisma.todo.findMany({
      skip: skip ?? 0,
      take: take ?? undefined,
      where: {
        completed: filterBy?.isCompleted ?? undefined,
        dueDate: overdueFilter,
      },
      orderBy: {
        createdAt: sortBy?.sortByCreatedAt ?? undefined,
        dueDate: sortBy?.sortByDueDate ?? undefined,
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
