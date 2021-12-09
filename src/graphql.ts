import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        test: [Test!]!
    }

    type Test {
        id : Int!
        name: String!
    }
`

export const resolvers = {
    Query: {
        test: () => [{ id: 1, name: "test" }]
    }
};