export const typeDefs = /* GraphQL */ `
  input CreateSomethingInput {
    name: String!
  }

  input CreateTodoInput {
    title: String!
    dueDate: String
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    completed: Boolean
  }

  input DeleteTodoInput {
    id: ID!
  }

  enum SortOrder {
    asc
    desc
  }

  type Something {
    id: ID!
    name: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    dueDate: String
  }

  type Mutation {
    createSomething(input: CreateSomethingInput!): Something!
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo!
    deleteTodo(input: DeleteTodoInput!): Todo!
  }

  type Query {
    hello: String
    todo(id: ID!): Todo
    todos(
      isCompleted: Boolean
      isOverdue: Boolean
      skip: Int
      take: Int
      sortByCreatedAt: SortOrder
    ): [Todo]!
  }
`;
