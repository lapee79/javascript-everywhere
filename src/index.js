const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

let notes = [
    {id: '', content: '', author: ''},
    {id: '', content: '', author: ''},
    {id: '', content: '', author: ''}
];

// GraphQL schema language로 schema를 구성
const typeDefs = gql`
    type Query{
        hello: String
    }
`;

// schema field를 위한 resolver function 제공
const resolvers = {
    Query: {
        hello: () => 'Hello world!'
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
