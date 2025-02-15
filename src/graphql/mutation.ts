import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql/error/GraphQLError";

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
  // Mutation which adds a todo with a given title. Everything else auto generated.
  createTodo: async (_, { input }, { prisma }) => {
    // Throw an error if the string is empty
    if (input.title.length == 0) {
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
    console.log(input);
    if (input.title === undefined && input.completed === undefined) {
      throw new GraphQLError(
        "Please provide a title and/or completion status to update"
      );
    }

    // Throw an error if the title string is empty
    if (input.title != null && input.title.length == 0) {
      throw new GraphQLError("Cannot update Todo with an empty title");
    }

    const todo = await prisma.todo.update({
      where: {
        id: input.id,
      },
      data: {
        // If either of these are null, converts them to undefined.
        // Needed because title and completed aren't nullable in the Todo table.
        title: input.title ?? undefined,
        completed: input.completed ?? undefined,
        updatedAt: new Date(),
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
};
