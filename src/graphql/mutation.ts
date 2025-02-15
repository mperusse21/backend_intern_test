import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql/error/GraphQLError";
import { Prisma } from "@prisma/client";

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
  // Adds a todo with a given title. Everything else auto generated.
  createTodo: async (_, { input }, { prisma }) => {
    // Throw an error if the string is empty
    if (input.title === "") {
      throw new GraphQLError("Cannot create Todo with an empty title");
    }

    const todo = await prisma.todo.create({
      data: {
        title: input.title,
      },
    });

    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toString(),
      updatedAt: todo.updatedAt.toString(),
    };
  },
  // Updates a todo with a provided title and/or completed status.
  updateTodo: async (_, { input }, { prisma }) => {
    // If no input is provided, throw an error.
    if (input.title === undefined && input.completed === undefined) {
      throw new GraphQLError("Please provide a title and/or completion status to update");
    }

    // Throw an error if the title string is empty
    if (input.title === "") {
      throw new GraphQLError("Cannot update Todo with an empty title");
    }

    const todo = await prisma.todo.update({
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
          throw new GraphQLError(`Unable to update. No Todo found with ID: ${input.id}`);
        }
      }
      throw error;
    });

    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toString(),
      updatedAt: todo.updatedAt.toString(),
    };
  },
};
