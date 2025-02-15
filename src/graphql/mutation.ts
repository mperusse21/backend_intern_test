import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql";

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
      throw new GraphQLError("Cannot create todo with an empty title");
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
};
