const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

let notes = [
    {id: '1', content: 'This is a note', author: 'Adam Scott'},
    {id: '2', content: 'This is another note', author: 'Harlow Everly'},
    {id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison'}
];

// GraphQL schema language로 schema를 구성
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String!
        notes: [Note]!
        note(id: ID!): Note!
    }
`;

// schema field를 위한 resolver function 제공
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    }
};

// Apollo server 설정
const server = new ApolloServer({ typeDefs, resolvers });

// Apollo GraphQL middleware를 적용하고 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () => 
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
);
