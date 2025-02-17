export const typeDefs = /* GraphQL */ `
  enum SortOrder {
    asc
    desc
  }

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

  input FilterTodosInput {
    isCompleted: Boolean
    isOverdue: Boolean
  }

  input SortTodosInput {
    sortByCreatedAt: SortOrder
    sortByDueDate: SortOrder
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
      filterBy: FilterTodosInput
      sortBy: SortTodosInput
      skip: Int
      take: Int
    ): [Todo]!
  }
`;
