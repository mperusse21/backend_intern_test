import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql/error/GraphQLError";
import { Prisma } from "@prisma/client";
import { convertStringToDate } from "../date-utils";

export const Mutation: IMutation<Context> = {
  createSomething: async (_, { input }, { prisma }) => {
    const something = await prisma.something.create({
      data: {
        name: input.name,
      },
    });

    return {
      id: something.id,
      name: something.name,
    };
  },
  createTodo: async (_, { input }, { prisma }) => {
    if (input.title === "") {
      throw new GraphQLError("Cannot create Todo with an empty title");
    }

    const convertedDueDate = convertStringToDate(input.dueDate ?? undefined);
    
    // Adds a todo with a given title and optional due date. Everything else auto generated.
    const newTodo = await prisma.todo.create({
      data: {
        title: input.title,
        dueDate: convertedDueDate 
      },
    });

    return {
      id: newTodo.id,
      title: newTodo.title,
      completed: newTodo.completed,
      createdAt: newTodo.createdAt.toString(),
      updatedAt: newTodo.updatedAt.toString(),
      dueDate: newTodo.dueDate?.toString()
    };
  },
  // Updates a todo with a provided title and/or completed status.
  updateTodo: async (_, { input }, { prisma }) => {
    if (input.title === undefined && input.completed === undefined) {
      throw new GraphQLError("Please provide a title and/or completion status to update");
    }

    if (input.title === "") {
      throw new GraphQLError("Cannot update Todo with an empty title");
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title ?? undefined,
        completed: input.completed ?? undefined,
        updatedAt: new Date(),
      },
    }).catch((error) => {
      // Modified from: https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // If the error is a "not found" error, show a better error message.
        if (error.code === "P2025") {
          throw new GraphQLError(`Unable to update Todo. No Todo found with ID: ${input.id}`);
        }
      }
      throw error;
    });

    return {
      id: updatedTodo.id,
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      createdAt: updatedTodo.createdAt.toString(),
      updatedAt: updatedTodo.updatedAt.toString(),
      dueDate: updatedTodo.dueDate?.toString()
    };
  },
  // Deletes a todo with the given ID. Returns the todo if successful.
  deleteTodo: async (_, { input }, { prisma }) => { 
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: input.id,
      }
    }).catch((error) => {
      // Modified from: https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // If the error is a "not found" error, show a better error message.
        if (error.code === "P2025") {
          throw new GraphQLError(`Unable to delete Todo. No Todo found with ID: ${input.id}`);
        }
      }
      throw error;
    });
  
    return {
      id: deletedTodo.id,
      title: deletedTodo.title,
      completed: deletedTodo.completed,
      createdAt: deletedTodo.createdAt.toString(),
      updatedAt: deletedTodo.updatedAt.toString(),
      dueDate: deletedTodo.dueDate?.toString()
    };
  }
};
