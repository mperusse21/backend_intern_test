export const typeDefs = /* GraphQL */ `
  input CreateSomethingInput {
    name: String!
  }

  type Something {
    id: ID!
    name: String!
  }

  type Todo {
    id: ID!
    name: String!
    completed: Boolean!
  }
    
  type Mutation {
    createSomething(input: CreateSomethingInput!): Something!
  }

  type Query {
    hello: String
  }
`;
